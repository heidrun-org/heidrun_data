//! The images of a chat session of Claude Code, read from its chat session file at each call.
//!
//! The images are not copied into the SQLite file: the package stores facts only, and a copy of every image would double
//! the disk space that the images take. So `find_chat_images` reads the chat session file, as the exception of
//! [data_layer_access.md](https://github.com/heidrun-org/heidrun_code/blob/main/docs/agents_rules/data_layer_access.md) says.

use crate::coding_agents::agent_homes::claude_dir;
use crate::coding_agents::chat_images_reader::read_chat_images;
use crate::model::chat_image_types::ChatImageList;

/// The images of the chat session `session_id` of Claude Code, with the number of the text `[Image #N]` of each one.
/// `images` holds only the images whose number is above `after_number`, and `numbers` holds every number.
pub fn find_chat_images(session_id: &str, after_number: u32) -> ChatImageList {
    read_chat_images(&claude_dir().join("projects"), session_id, after_number)
}
