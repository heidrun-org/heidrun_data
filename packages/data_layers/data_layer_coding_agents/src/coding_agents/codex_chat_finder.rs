//! Finds the chat of Codex that a terminal shows, from the title of the terminal
//! ([issue 924](https://github.com/heidrun-org/heidrun_code/issues/924)).
//!
//! Codex writes the title of its chat in the title of the terminal, for example `Respond to greeting | heidrun`: the title of
//! the chat, then the name of the project. Codex also writes each title in `<codex home>/session_index.jsonl`, with the
//! identifier of the chat and the date of its last change. Codex gives no other link between a terminal and its chat: the
//! hooks of Codex run in the shared server of Codex, not in the terminal. Two chats can have the same title, so the chat must
//! also have started in the folder of the terminal, and the chat that changed last wins.

use crate::coding_agents::scan::{open_lines, read_lines_from};
use crate::coding_agents::session_files::{find_codex_session_file, FolderScope};
use serde_json::Value;
use std::io::BufRead;
use std::path::Path;

/// The text that Codex writes between the title of the chat and the name of the project in the title of the terminal.
const TITLE_SEPARATOR: &str = " | ";

/// The identifier of the chat of Codex that a terminal shows, from the title of the terminal and the folder where Codex runs.
/// The chat has the title that starts the title of the terminal, it started in `folder`, and it changed after every other
/// such chat. `None` when no chat matches, for example before Codex gives the chat a title.
pub fn find_codex_chat_of_terminal_title(home: &Path, terminal_title: &str, folder: &str) -> Option<String> {
    let title = terminal_title.trim_start_matches(|c: char| c.is_alphanumeric() == false).trim_end();
    if title.is_empty() || folder.trim().is_empty() {
        return None;
    }
    let mut candidates: Vec<(String, String)> = Vec::new();
    read_lines_from(&home.join("session_index.jsonl"), 0, |line| {
        let Ok(record) = serde_json::from_str::<Value>(line) else { return };
        let (Some(id), Some(name)) = (record.get("id").and_then(Value::as_str), record.get("thread_name").and_then(Value::as_str))
        else {
            return;
        };
        let name = name.trim();
        if name.is_empty() || is_title_of(title, name) == false {
            return;
        }
        let updated_at = record.get("updated_at").and_then(Value::as_str).unwrap_or("").to_string();
        candidates.retain(|(known, _)| known != id);
        candidates.push((id.to_string(), updated_at));
    });
    candidates.sort_by(|a, b| b.1.cmp(&a.1));
    candidates.into_iter().map(|(id, _)| id).find(|id| started_in(home, id, folder))
}

/// True when the title of the terminal is the title of the chat `name`, alone or followed by the name of the project.
fn is_title_of(title: &str, name: &str) -> bool {
    title == name || title.strip_prefix(name).is_some_and(|rest| rest.starts_with(TITLE_SEPARATOR))
}

/// True when the chat `id` of Codex started in `folder`: the field `cwd` of the first line of its file.
fn started_in(home: &Path, id: &str, folder: &str) -> bool {
    let Some(path) = find_codex_session_file(home, id) else { return false };
    let Some(mut reader) = open_lines(&path, 0) else { return false };
    let mut line = String::new();
    if reader.read_line(&mut line).is_err() {
        return false;
    }
    let Ok(record) = serde_json::from_str::<Value>(&line) else { return false };
    record.pointer("/payload/cwd").and_then(Value::as_str).is_some_and(|cwd| FolderScope::Exactly.includes(cwd, folder))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_samples::{codex_compressed_file, codex_file, temp_folder, write_file};

    const OLD: &str = "01a15208-8350-7352-8209-b48df7daa3ff";
    const NEW: &str = "01a17e13-c2cd-7811-adda-f790dcf914a0";
    const OTHER_FOLDER: &str = "01a17e13-c2cd-7811-adda-f790dcf914a1";

    /// A line of the index of Codex.
    fn index_line(id: &str, name: &str, updated_at: &str) -> String {
        format!(r#"{{"id":"{id}","thread_name":"{name}","updated_at":"{updated_at}"}}"#)
    }

    fn home_with_three_chats(name: &str) -> std::path::PathBuf {
        let home = temp_folder(name);
        codex_compressed_file(&home, "2026/10/19", OLD, "/work/heidrun", &[], 100);
        codex_file(&home, "2026/10/27", NEW, "/work/heidrun", &[], 10);
        codex_file(&home, "2026/10/27", OTHER_FOLDER, "/work/other", &[], 5);
        let index = [
            index_line(OLD, "Respond to greeting", "2026-10-19T02:41:07Z"),
            index_line(NEW, "Respond to greeting", "2026-10-27T15:58:18Z"),
            index_line(OTHER_FOLDER, "Respond to greeting", "2026-10-27T16:30:00Z"),
            index_line("01a17e13-c2cd-7811-adda-f790dcf914a2", "Respond", "2026-10-27T17:00:00Z"),
            "not json".to_string(),
        ];
        write_file(&home.join("session_index.jsonl"), &format!("{}\n", index.join("\n")), 1);
        home
    }

    #[test]
    fn finds_the_chat_with_the_title_of_the_terminal_in_the_folder_that_changed_last() {
        let home = home_with_three_chats("codex_finder_last");
        assert_eq!(find_codex_chat_of_terminal_title(&home, "Respond to greeting | heidrun", "/work/heidrun").as_deref(), Some(NEW));
        assert_eq!(find_codex_chat_of_terminal_title(&home, "Respond to greeting", "/work/heidrun/").as_deref(), Some(NEW));
        assert_eq!(find_codex_chat_of_terminal_title(&home, "Respond to greeting | other", "/work/other").as_deref(), Some(OTHER_FOLDER));
    }

    #[test]
    fn leaves_out_the_mark_of_work_that_codex_writes_before_the_title() {
        let home = home_with_three_chats("codex_finder_spinner");
        assert_eq!(find_codex_chat_of_terminal_title(&home, "⠋ Respond to greeting | heidrun", "/work/heidrun").as_deref(), Some(NEW));
    }

    #[test]
    fn a_rename_of_the_chat_gives_the_last_title_of_the_index() {
        let home = home_with_three_chats("codex_finder_rename");
        let index = std::fs::read_to_string(home.join("session_index.jsonl")).unwrap();
        let renamed = format!("{index}{}\n", index_line(OLD, "Fix the images", "2026-10-28T09:00:00Z"));
        write_file(&home.join("session_index.jsonl"), &renamed, 1);
        assert_eq!(find_codex_chat_of_terminal_title(&home, "Fix the images | heidrun", "/work/heidrun").as_deref(), Some(OLD));
    }

    #[test]
    fn finds_nothing_without_a_title_a_folder_or_a_chat_in_the_folder() {
        let home = home_with_three_chats("codex_finder_nothing");
        assert_eq!(find_codex_chat_of_terminal_title(&home, "heidrun", "/work/heidrun"), None);
        assert_eq!(find_codex_chat_of_terminal_title(&home, "", "/work/heidrun"), None);
        assert_eq!(find_codex_chat_of_terminal_title(&home, "Respond to greeting | heidrun", ""), None);
        assert_eq!(find_codex_chat_of_terminal_title(&home, "Respond to greeting | heidrun", "/work/heidrun/docs"), None);
        assert_eq!(find_codex_chat_of_terminal_title(&home.join("missing"), "Respond to greeting", "/work/heidrun"), None);
    }
}
