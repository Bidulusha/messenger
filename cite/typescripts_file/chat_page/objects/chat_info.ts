import { MessageContent } from "./chat_message";
import { Time } from "./time";

export class ChatsInfo {
    id: number;
    avatar: string;
    chat_name: string;
    members_id: number[];

    constructor(
        id: number,
        avatar: string,
        chat_name: string,
        members_id: number[],
    ) {
        this.id = id;
        this.avatar = avatar;
        this.chat_name = chat_name;
        this.members_id = members_id;
    }   
}

export class ChatMessages {
    id: number;
    who_sended: number;
    send_time: String;
    content: MessageContent;

    constructor(
        id: number,
        who_sended: number,
        send_time: Time,
        content: MessageContent,
    ) {
        this.id = id;
        this.who_sended = who_sended;
        this.send_time = send_time.hmsTime;
        this.content = content;
    }
}