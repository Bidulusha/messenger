export enum MessageType {
    AUTH_CHECK = "AUTH_CHECK",
    GET_CHATS = "GET_CHATS",
    OPEN_CHAT = "OPEN_CHAT",
    SEND_MESSAGE = "SEND_MESSAGE",
    START_CHAT = "START_CHAT"
}

export class AuthRequest {
    user_id: Number;
    token: String;

    constructor(user_id: Number, token: String) {
        this.user_id = user_id;
        this.token = token;
    }
}

export class UserMessage {
    message_type: MessageType;
    content: String;

    constructor (type: MessageType, content: String) {
        this.message_type = type;
        this.content = content;
    }
}