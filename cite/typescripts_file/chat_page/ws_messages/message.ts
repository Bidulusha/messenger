export enum MessageType {
    AUTH_CHECK,
    GET_CHATS,
    OPEN_CHAT,
    SEND_MESSAGE,
}

export class Content {
    what: String;
    to: String;
    content: String;
}

export class Message {
    type: MessageType;
    content: Content;
}