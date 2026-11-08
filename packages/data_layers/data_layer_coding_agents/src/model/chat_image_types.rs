//! The data shapes of the images that the developer pasted or dropped in a chat session of Claude Code or of Codex. The JSON
//! of these shapes is the JSON that the Clipboard sidebar section reads.

use serde::Serialize;

/// One image of a chat session, with the number that the text `[Image #N]` of the chat gives to it.
#[derive(Serialize, Debug, Clone, PartialEq, Eq)]
pub struct ChatImage {
    /// The key of the image in its chat session: no other image of the chat has it, and a later image has a larger key. For
    /// Claude Code it is the number `N`. For Codex it is the place of the image in the chat, from 1, because Codex starts the
    /// numbers again in each message.
    pub key: u32,
    /// The number `N` of the text `[Image #N]`.
    pub number: u32,
    /// For Codex, the place of the message of the image among the messages of the chat that hold images, from 1. Two images
    /// of a chat of Codex can have the same number, so the message tells them apart. `None` for Claude Code, whose numbers
    /// are never repeated in a chat.
    pub message: Option<u32>,
    /// The media type of the image, for example `image/png`.
    pub media_type: String,
    /// The whole image in base64, as the chat session file holds it.
    pub data: String,
}

/// The images of one chat session, in the order of their keys.
#[derive(Serialize, Debug, Clone, Default, PartialEq, Eq)]
pub struct ChatImageList {
    /// The key of every image of the chat session, in order, also of the images that `images` leaves out.
    pub keys: Vec<u32>,
    /// The images whose key is above the key that the caller already has, in the order of their keys.
    pub images: Vec<ChatImage>,
}
