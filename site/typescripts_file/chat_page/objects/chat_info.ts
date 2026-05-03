import { ChatsUserWithInfo } from "./chats_user_with_info";

export class ChatsInfo {
    id: number;
    avatar: string;
    chat_name: string;
    members_id: number[];

    constructor(
        id: number | void,
        avatar: string | void,
        chat_name: string | void,
        members_id: number[] | void,
    ) {
        if (id != undefined) {
            this.id = id;
            this.avatar = avatar!;
            this.chat_name = chat_name!;
            this.members_id = members_id!;
        }
    }   

    intoChatUserWithInof(): ChatsUserWithInfo {
        return new ChatsUserWithInfo (
            this.id,
            this.chat_name,
            this.avatar,
            null,
            this.members_id
        )
    }
}