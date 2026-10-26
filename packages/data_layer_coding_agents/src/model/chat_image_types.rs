//! The data shapes of the images that the developer pasted or dropped in a chat session of Claude Code. The JSON of these
//! shapes is the JSON that the Clipboard sidebar section reads.

use serde::Serialize;

/// One image of a chat session, with the number that the text `[Image #N]` of the chat gives to it.
#[derive(Serialize, Debug, Clone, PartialEq, Eq)]
pub struct ChatImage {
    /// The number `N` of the text `[Image #N]`.
    pub number: u32,
    /// The media type of the image, for example `image/png`.
    pub media_type: String,
    /// The whole image in base64, as the chat session file holds it.
    pub data: String,
}

/// The images of one chat session, in the order of their numbers.
#[derive(Serialize, Debug, Clone, Default, PartialEq, Eq)]
pub struct ChatImageList {
    /// The number of every image of the chat session, in order, also of the images that `images` leaves out.
    pub numbers: Vec<u32>,
    /// The images whose number is above the number that the caller already has, in the order of their numbers.
    pub images: Vec<ChatImage>,
}
