//! Reads the images that the developer pasted or dropped in a chat session of Claude Code, with the number of each one.
//!
//! Claude Code writes the text `[Image #N]` in the message of the developer, and the whole image in base64 in an image block of
//! the same line. The field `imagePasteIds` of the line gives the number `N` of each image block, in the order of the blocks.
//! The numbers are not a count of the image blocks: an image that the developer removed before sending keeps its number, so a
//! chat can have the images 1, 2, 6, and 7 ([issue 790](https://github.com/heidrun-org/heidrun_code/issues/790)). An image
//! block of a line without `imagePasteIds`, or with a list of another length, has no number and is left out.

use crate::coding_agents::scan::read_lines_from;
use crate::model::chat_image_types::{ChatImage, ChatImageList};
use serde_json::Value;
use std::collections::BTreeMap;
use std::path::{Path, PathBuf};
use std::time::SystemTime;

/// The images of the chat session `session_id` of Claude Code, from its file `<projects>/<folder name>/<session id>.jsonl`.
/// The key of an image is its number. `images` holds only the images whose key is above `after_key`, and `keys` holds every
/// key. When two files have the same chat session identifier (Claude Code copies a resumed chat into another project folder),
/// the file that changed last is read. An identifier that is not a chat session identifier, or a chat session with no file,
/// gives `None`.
pub fn read_chat_images(projects: &Path, session_id: &str, after_key: u32) -> Option<ChatImageList> {
    let path = find_session_file(projects, session_id)?;
    let mut found: BTreeMap<u32, (String, String)> = BTreeMap::new();
    read_lines_from(&path, 0, |line| {
        if line.contains("\"imagePasteIds\"") == false {
            return;
        }
        let Ok(record) = serde_json::from_str::<Value>(line) else { return };
        for (number, media_type, data) in numbered_images(&record) {
            found.insert(number, (media_type, data));
        }
    });
    let keys = found.keys().copied().collect();
    let images = found
        .into_iter()
        .filter(|(number, _)| *number > after_key)
        .map(|(number, (media_type, data))| ChatImage { key: number, number, message: None, media_type, data })
        .collect();
    Some(ChatImageList { keys, images })
}

/// True when `session_id` has only the characters of a chat session identifier, so it cannot name another file.
pub fn is_session_id(session_id: &str) -> bool {
    session_id.is_empty() == false && session_id.chars().all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
}

/// The file of the chat session `session_id` in a folder of `projects`, the one that changed last.
fn find_session_file(projects: &Path, session_id: &str) -> Option<PathBuf> {
    if is_session_id(session_id) == false {
        return None;
    }
    let file_name = format!("{session_id}.jsonl");
    let mut best: Option<(SystemTime, PathBuf)> = None;
    for entry in std::fs::read_dir(projects).ok()?.flatten() {
        let path = entry.path().join(&file_name);
        let Ok(metadata) = std::fs::metadata(&path) else { continue };
        let modified = metadata.modified().unwrap_or(SystemTime::UNIX_EPOCH);
        if best.as_ref().map_or(true, |(date, _)| modified > *date) {
            best = Some((modified, path));
        }
    }
    best.map(|(_, path)| path)
}

/// The number, the media type, and the base64 data of each image block of a message of the developer. A line of a subagent
/// (`isSidechain`) has no image of the developer.
fn numbered_images(record: &Value) -> Vec<(u32, String, String)> {
    if record.get("type").and_then(Value::as_str) != Some("user") {
        return Vec::new();
    }
    if record.get("isSidechain").and_then(Value::as_bool) == Some(true) {
        return Vec::new();
    }
    let Some(numbers) = record.get("imagePasteIds").and_then(Value::as_array) else { return Vec::new() };
    let Some(content) = record.pointer("/message/content").and_then(Value::as_array) else { return Vec::new() };
    let blocks: Vec<&Value> = content.iter().filter(|block| block.get("type").and_then(Value::as_str) == Some("image")).collect();
    if blocks.len() != numbers.len() {
        return Vec::new();
    }
    numbers
        .iter()
        .zip(blocks)
        .filter_map(|(number, block)| {
            let number = u32::try_from(number.as_u64()?).ok()?;
            let source = block.get("source")?;
            if source.get("type").and_then(Value::as_str) != Some("base64") {
                return None;
            }
            let media_type = source.get("media_type").and_then(Value::as_str)?;
            let data = source.get("data").and_then(Value::as_str)?;
            Some((number, media_type.to_string(), data.to_string()))
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_samples::{claude_user_line, temp_folder, write_file};

    /// A line of a message of the developer with one image block for each `(number, data)`, and the field `imagePasteIds`.
    fn image_line(images: &[(u32, &str)]) -> String {
        let blocks: Vec<String> = images
            .iter()
            .map(|(_, data)| format!(r#"{{"type":"image","source":{{"type":"base64","media_type":"image/png","data":"{data}"}}}}"#))
            .collect();
        let numbers: Vec<String> = images.iter().map(|(number, _)| number.to_string()).collect();
        let text: Vec<String> = images.iter().map(|(number, _)| format!("[Image #{number}]")).collect();
        format!(
            r#"{{"type":"user","imagePasteIds":[{}],"message":{{"role":"user","content":[{{"type":"text","text":"{}"}},{}]}}}}"#,
            numbers.join(","),
            text.join(" "),
            blocks.join(",")
        )
    }

    fn data_of(list: &ChatImageList) -> Vec<(u32, &str)> {
        list.images.iter().map(|image| (image.number, image.data.as_str())).collect()
    }

    #[test]
    fn gives_each_image_the_number_of_its_text_also_when_numbers_are_missing() {
        let projects = temp_folder("chat_images_numbers").join("projects");
        let text = [
            claude_user_line("/work/app", "hello"),
            image_line(&[(1, "AAA"), (2, "BBB")]),
            image_line(&[(6, "FFF"), (7, "GGG")]),
        ]
        .join("\n");
        write_file(&projects.join("-work-app").join("chat-1.jsonl"), &format!("{text}\n"), 10);
        let list = read_chat_images(&projects, "chat-1", 0).unwrap();
        assert_eq!(list.keys, vec![1, 2, 6, 7]);
        assert!(list.images.iter().all(|image| image.key == image.number && image.message.is_none()));
        assert_eq!(data_of(&list), vec![(1, "AAA"), (2, "BBB"), (6, "FFF"), (7, "GGG")]);
        assert_eq!(list.images[0].media_type, "image/png");
    }

    #[test]
    fn gives_only_the_images_above_the_number_that_the_caller_has_and_every_number() {
        let projects = temp_folder("chat_images_after").join("projects");
        let text = [image_line(&[(1, "AAA")]), image_line(&[(2, "BBB")]), image_line(&[(3, "CCC")])].join("\n");
        write_file(&projects.join("-work-app").join("chat-1.jsonl"), &format!("{text}\n"), 10);
        let list = read_chat_images(&projects, "chat-1", 2).unwrap();
        assert_eq!(list.keys, vec![1, 2, 3]);
        assert_eq!(data_of(&list), vec![(3, "CCC")]);
    }

    #[test]
    fn leaves_out_an_image_without_a_number_and_an_image_of_a_subagent() {
        let projects = temp_folder("chat_images_left_out").join("projects");
        let without_numbers = r#"{"type":"user","message":{"role":"user","content":[{"type":"image","source":{"type":"base64","media_type":"image/png","data":"XXX"}}]}}"#;
        let wrong_length = image_line(&[(4, "DDD"), (5, "EEE")]).replace("\"imagePasteIds\":[4,5]", "\"imagePasteIds\":[4]");
        let subagent = image_line(&[(8, "HHH")]).replacen("{\"type\":\"user\",", "{\"type\":\"user\",\"isSidechain\":true,", 1);
        let text = [without_numbers.to_string(), wrong_length, subagent, image_line(&[(1, "AAA")])].join("\n");
        write_file(&projects.join("-work-app").join("chat-1.jsonl"), &format!("{text}\n"), 10);
        let list = read_chat_images(&projects, "chat-1", 0).unwrap();
        assert_eq!(data_of(&list), vec![(1, "AAA")]);
    }

    #[test]
    fn reads_the_file_that_changed_last_when_two_folders_hold_the_chat_session() {
        let projects = temp_folder("chat_images_two_files").join("projects");
        write_file(&projects.join("-work-app").join("chat-1.jsonl"), &format!("{}\n", image_line(&[(1, "OLD")])), 100);
        write_file(&projects.join("-work-other").join("chat-1.jsonl"), &format!("{}\n", image_line(&[(1, "NEW")])), 10);
        assert_eq!(data_of(&read_chat_images(&projects, "chat-1", 0).unwrap()), vec![(1, "NEW")]);
    }

    #[test]
    fn gives_nothing_for_an_unknown_chat_session_and_for_an_identifier_that_names_another_file() {
        let projects = temp_folder("chat_images_unknown").join("projects");
        write_file(&projects.join("-work-app").join("chat-1.jsonl"), &format!("{}\n", image_line(&[(1, "AAA")])), 10);
        assert_eq!(read_chat_images(&projects, "chat-2", 0), None);
        assert_eq!(read_chat_images(&projects, "../-work-app/chat-1", 0), None);
        assert_eq!(read_chat_images(&projects, "", 0), None);
        assert_eq!(read_chat_images(&projects.join("nothing"), "chat-1", 0), None);
    }
}
