//! Reads the images that the developer pasted or dropped in a chat session of Codex, with the number of each one
//! ([issue 924](https://github.com/heidrun-org/heidrun_code/issues/924)).
//!
//! Codex writes a message of the developer as a line of the type `response_item`, with a payload of the type `message` and
//! the role `user`. Each image of the message is three items of its content: the text `<image name=[Image #N] path="...">`,
//! the item `input_image` with the whole image in a `data:` address, then the text `</image>`. A dropped file has the same
//! form, with the path of the file. Codex starts the numbers again in each message, so a chat can have several images with
//! the number 1: the key of an image is its place in the chat, and `message` tells the messages apart. The images of a tool
//! output (payload of the type `function_call_output` or `custom_tool_call_output`) are screenshots that a tool made, not
//! images of the developer, and are left out.

use crate::coding_agents::chat_images_reader::is_session_id;
use crate::coding_agents::scan::read_lines_from;
use crate::coding_agents::session_files::find_codex_session_file;
use crate::model::chat_image_types::{ChatImage, ChatImageList};
use serde_json::Value;
use std::path::Path;

/// The text that comes before the number of an image in a message of Codex.
const IMAGE_NAME_START: &str = "<image name=[Image #";

/// The images of the chat session `session_id` of Codex, from its file `<home>/sessions/YYYY/MM/DD/rollout-<date>-<id>.jsonl`
/// or its compressed file. `images` holds only the images whose key is above `after_key`, and `keys` holds every key. An
/// identifier that is not a chat session identifier, or a chat session with no file, gives `None`.
pub fn read_codex_chat_images(home: &Path, session_id: &str, after_key: u32) -> Option<ChatImageList> {
    if is_session_id(session_id) == false {
        return None;
    }
    let path = find_codex_session_file(home, session_id)?;
    let mut found: Vec<ChatImage> = Vec::new();
    let mut message = 0;
    read_lines_from(&path, 0, |line| {
        if line.contains(IMAGE_NAME_START) == false {
            return;
        }
        let Ok(record) = serde_json::from_str::<Value>(line) else { return };
        let images = numbered_images(&record);
        if images.is_empty() {
            return;
        }
        message += 1;
        for (number, media_type, data) in images {
            let key = found.len() as u32 + 1;
            found.push(ChatImage { key, number, message: Some(message), media_type, data });
        }
    });
    let keys = found.iter().map(|image| image.key).collect();
    let images = found.into_iter().filter(|image| image.key > after_key).collect();
    Some(ChatImageList { keys, images })
}

/// The number, the media type, and the base64 data of each image of a message of the developer. An item `input_image`
/// without the text `<image name=[Image #N]` just before it has no number and is left out.
fn numbered_images(record: &Value) -> Vec<(u32, String, String)> {
    if record.get("type").and_then(Value::as_str) != Some("response_item") {
        return Vec::new();
    }
    let Some(payload) = record.get("payload") else { return Vec::new() };
    if payload.get("type").and_then(Value::as_str) != Some("message") || payload.get("role").and_then(Value::as_str) != Some("user") {
        return Vec::new();
    }
    let Some(content) = payload.get("content").and_then(Value::as_array) else { return Vec::new() };
    let mut images = Vec::new();
    let mut number: Option<u32> = None;
    for item in content {
        match item.get("type").and_then(Value::as_str) {
            Some("input_text") => number = item.get("text").and_then(Value::as_str).and_then(image_number),
            Some("input_image") => {
                let address = item.get("image_url").and_then(Value::as_str);
                if let (Some(found), Some((media_type, data))) = (number.take(), address.and_then(split_data_address)) {
                    images.push((found, media_type, data));
                }
            }
            _ => number = None,
        }
    }
    images
}

/// The number `N` of a text that starts with `<image name=[Image #N]`.
fn image_number(text: &str) -> Option<u32> {
    let rest = text.trim_start().strip_prefix(IMAGE_NAME_START)?;
    let (digits, _) = rest.split_once(']')?;
    digits.parse().ok()
}

/// The media type and the base64 data of an address `data:<media type>;base64,<data>`. Another address gives `None`.
fn split_data_address(address: &str) -> Option<(String, String)> {
    let (media_type, data) = address.strip_prefix("data:")?.split_once(";base64,")?;
    if media_type.is_empty() || data.is_empty() {
        return None;
    }
    Some((media_type.to_string(), data.to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_samples::{codex_compressed_file, codex_file, codex_message, temp_folder};

    const ID: &str = "01a17e05-bc59-7e70-8f26-aa9c8f220604";

    /// The items of one image of a message of Codex, pasted (`/var/folders/.../codex-clipboard.png`) or dropped.
    fn image_items(number: u32, path: &str, data: &str) -> String {
        format!(
            r#"{{"type":"input_text","text":"<image name=[Image #{number}] path=\"{path}\">"}},{{"type":"input_image","image_url":"data:image/png;base64,{data}","detail":"high"}},{{"type":"input_text","text":"</image>"}}"#
        )
    }

    /// A message of the developer with the images `(number, data)`, then the text that names them.
    fn image_message(images: &[(u32, &str)]) -> String {
        let items: Vec<String> =
            images.iter().map(|(number, data)| image_items(*number, "/var/folders/x/codex-clipboard-A.png", data)).collect();
        let text: String = images.iter().map(|(number, _)| format!("[Image #{number}]")).collect();
        format!(
            r#"{{"type":"response_item","payload":{{"type":"message","role":"user","content":[{},{{"type":"input_text","text":"{text} What is it?"}}]}}}}"#,
            items.join(",")
        )
    }

    /// A tool output of the type `kind` with a screenshot. The text before the screenshot names an image on purpose, so the
    /// test proves that the type of the payload, and not the text, leaves the screenshot out.
    fn tool_output(kind: &str) -> String {
        format!(
            r#"{{"type":"response_item","payload":{{"type":"{kind}","call_id":"c1","output":[{}]}}}}"#,
            image_items(1, "/tmp/screenshot.png", "TOOL")
        )
    }

    fn found(list: &ChatImageList) -> Vec<(u32, u32, Option<u32>, &str)> {
        list.images.iter().map(|image| (image.key, image.number, image.message, image.data.as_str())).collect()
    }

    #[test]
    fn reads_one_pasted_image_with_its_media_type() {
        let home = temp_folder("codex_images_one");
        codex_file(&home, "2026/10/27", ID, "/work/app", &[&codex_message("hello"), &image_message(&[(1, "AAA")])], 10);
        let list = read_codex_chat_images(&home, ID, 0).unwrap();
        assert_eq!(found(&list), vec![(1, 1, Some(1), "AAA")]);
        assert_eq!(list.images[0].media_type, "image/png");
    }

    #[test]
    fn gives_each_image_a_key_and_its_message_because_codex_starts_the_numbers_again_in_each_message() {
        let home = temp_folder("codex_images_several");
        let messages =
            [image_message(&[(1, "AAA")]), codex_message("no image"), image_message(&[(1, "BBB"), (2, "CCC")]), image_message(&[(1, "DDD")])];
        let lines: Vec<&str> = messages.iter().map(String::as_str).collect();
        codex_file(&home, "2026/10/27", ID, "/work/app", &lines, 10);
        let list = read_codex_chat_images(&home, ID, 0).unwrap();
        assert_eq!(list.keys, vec![1, 2, 3, 4]);
        assert_eq!(
            found(&list),
            vec![(1, 1, Some(1), "AAA"), (2, 1, Some(2), "BBB"), (3, 2, Some(2), "CCC"), (4, 1, Some(3), "DDD")]
        );
        assert_eq!(found(&read_codex_chat_images(&home, ID, 2).unwrap()), vec![(3, 2, Some(2), "CCC"), (4, 1, Some(3), "DDD")]);
        assert_eq!(read_codex_chat_images(&home, ID, 2).unwrap().keys, vec![1, 2, 3, 4]);
    }

    #[test]
    fn reads_a_dropped_file_like_a_pasted_image() {
        let home = temp_folder("codex_images_dropped");
        let dropped = format!(
            r#"{{"type":"response_item","payload":{{"type":"message","role":"user","content":[{},{{"type":"input_text","text":"[Image #1]"}}]}}}}"#,
            image_items(1, "/Users/someone/Desktop/drawing.png", "DROP")
        );
        codex_file(&home, "2026/10/27", ID, "/work/app", &[&dropped], 10);
        assert_eq!(found(&read_codex_chat_images(&home, ID, 0).unwrap()), vec![(1, 1, Some(1), "DROP")]);
    }

    #[test]
    fn leaves_out_the_screenshots_of_a_tool_output_and_an_image_without_a_number() {
        let home = temp_folder("codex_images_tool");
        let without_number = r#"{"type":"response_item","payload":{"type":"message","role":"user","content":[{"type":"input_text","text":"<image name=[Image #9] path=\"/x.png\">"},{"type":"input_text","text":"other"},{"type":"input_image","image_url":"data:image/png;base64,NONUMBER"}]}}"#;
        let web_address = image_message(&[(1, "AAA")]).replace("data:image/png;base64,AAA", "https://example.com/a.png");
        let messages = [
            tool_output("function_call_output"),
            tool_output("custom_tool_call_output"),
            without_number.to_string(),
            web_address,
            image_message(&[(1, "KEPT")]),
        ];
        let lines: Vec<&str> = messages.iter().map(String::as_str).collect();
        codex_file(&home, "2026/10/27", ID, "/work/app", &lines, 10);
        assert_eq!(found(&read_codex_chat_images(&home, ID, 0).unwrap()), vec![(1, 1, Some(1), "KEPT")]);
    }

    #[test]
    fn reads_a_compressed_file() {
        let home = temp_folder("codex_images_compressed");
        codex_compressed_file(&home, "2026/09/25", ID, "/work/app", &[&image_message(&[(1, "ZST")])], 10);
        assert_eq!(found(&read_codex_chat_images(&home, ID, 0).unwrap()), vec![(1, 1, Some(1), "ZST")]);
    }

    #[test]
    fn gives_nothing_for_an_unknown_chat_session_and_for_an_identifier_that_names_another_file() {
        let home = temp_folder("codex_images_unknown");
        codex_file(&home, "2026/10/27", ID, "/work/app", &[&image_message(&[(1, "AAA")])], 10);
        assert_eq!(read_codex_chat_images(&home, "01a17e05-bc59-7e70-8f26-aa9c8f220699", 0), None);
        assert_eq!(read_codex_chat_images(&home, "../x", 0), None);
        assert_eq!(read_codex_chat_images(&home, "", 0), None);
        assert_eq!(read_codex_chat_images(&home.join("nothing"), ID, 0), None);
    }

    #[test]
    fn a_chat_without_an_image_gives_an_empty_list() {
        let home = temp_folder("codex_images_none");
        codex_file(&home, "2026/10/27", ID, "/work/app", &[&codex_message("hello")], 10);
        assert_eq!(read_codex_chat_images(&home, ID, 0), Some(ChatImageList::default()));
    }

    #[test]
    fn reads_the_number_of_an_image_and_a_data_address() {
        assert_eq!(image_number("<image name=[Image #12] path=\"/a.png\">"), Some(12));
        assert_eq!(image_number("[Image #1]"), None);
        assert_eq!(split_data_address("data:image/jpeg;base64,QQ=="), Some(("image/jpeg".to_string(), "QQ==".to_string())));
        assert_eq!(split_data_address("https://example.com/a.png"), None);
    }
}
