export enum MessageType {
    AUTH_CHECK = "AUTH_CHECK",
    GET_CHATS = "GET_CHATS",
    USER_SHORT_INFO = "USER_SHORT_INFO",
    OPEN_CHAT = "OPEN_CHAT",
    SEND_MESSAGE = "SEND_MESSAGE",
    START_CHAT = "START_CHAT",
    CREATE_CHAT = "CREATE_CHAT",
    DELETE_ACCOUNT = "DELETE_ACCOUNT"
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
    req_id: number;
    message_type: MessageType;
    content: string;

    constructor (req_id: number | void, type: MessageType | void, content: string | void) {
        if (typeof(type) != undefined) {
            this.req_id = req_id!;
            this.message_type = type!;
            this.content = content!;
        }
    }
}