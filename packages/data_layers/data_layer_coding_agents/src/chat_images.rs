//! The images of a chat session of Claude Code or of Codex, read from its chat session file at each call.
//!
//! The images are not copied into the SQLite file: the package stores facts only, and a copy of every image would double
//! the disk space that the images take. So `find_chat_images` reads the chat session file, as the exception of
//! [data_layer_access.md](https://github.com/heidrun-org/heidrun_code/blob/main/docs/agents_rules/data_layer_access.md) says.

use crate::coding_agents::agent_homes::{claude_dir, codex_home};
use crate::coding_agents::chat_images_reader::read_chat_images;
use crate::coding_agents::codex_chat_finder::find_codex_chat_of_terminal_title;
use crate::coding_agents::codex_chat_images_reader::read_codex_chat_images;
use crate::model::chat_image_types::ChatImageList;

/// The images of the chat session `session_id` of Claude Code or of Codex, with the number of the text `[Image #N]` of each
/// one. `images` holds only the images whose key is above `after_key`, and `keys` holds every key. The chat session file of
/// Claude Code is looked for first, then the one of Codex: the identifiers of the two coding agents never meet.
pub fn find_chat_images(session_id: &str, after_key: u32) -> ChatImageList {
    if let Some(list) = read_chat_images(&claude_dir().join("projects"), session_id, after_key) {
        return list;
    }
    read_codex_chat_images(&codex_home(), session_id, after_key).unwrap_or_default()
}

/// The identifier of the chat of Codex that a terminal shows, from the title of the terminal and the folder where Codex runs.
/// Codex writes the title of its chat in the title of the terminal, and gives no other link between a terminal and its chat.
/// `None` when no chat matches, for example before Codex gives the chat a title.
pub fn find_codex_chat_id(terminal_title: &str, folder: &str) -> Option<String> {
    find_codex_chat_of_terminal_title(&codex_home(), terminal_title, folder)
}
