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