export class MessageContent {
    answer_to: number;
    forwarded_from: string;
    text_content: string;
    photo_content: string[];
    files: string[];
}

export class ChatsInfo {
    id: number;
    avatar: string;
    name: string;
    members_id: number[];
}

export class ChatMessages {
    id: number;
    who_sended: number;
    send_time: Date;
    content: MessageContent;
}