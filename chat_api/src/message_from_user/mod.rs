enum MessageType {
    AUTH_CHECK,
    GET_CHATS,
    OPEN_CHAT,
    SEND_MESSAGE,
}

struct Content {
    pub what: String,
    pub to: String,
    pub content: String,
}

pub struct Message {
    pub message_type: MessageType,
    pub content: Content
}