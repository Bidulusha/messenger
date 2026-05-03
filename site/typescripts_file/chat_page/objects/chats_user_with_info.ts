import { ChatsInfo } from "./chat_info";

export class ChatsUserWithInfo {
    chat_id: number;
    chat_name: string;
    chat_avatar: string;
    with_user: number | null;
    members_id: number[];


    constructor(chat_id: number | void, chat_name: string | void, chat_avatar: string | void, with_user: number | null | void, members_id: number[] | void) {
        if (typeof(chat_id) != undefined) {
            this.chat_id = chat_id!;
            this.chat_name = chat_name!;
            this.chat_avatar = chat_avatar!;
            this.with_user = with_user!;
            this.members_id = members_id!;
        }   
    }

    into_chats_info(): ChatsInfo {
        return new ChatsInfo(
            this.chat_id,
            this.chat_avatar,
            this.chat_name,
            this.members_id
        )
    }
}