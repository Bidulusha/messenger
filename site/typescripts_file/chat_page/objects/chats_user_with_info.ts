export class ChatsUserWithInfo {
    chat_id: number;
    chat_name: string;
    chat_avatar: string;
    with_user: number | null;
    members_id: number[];
}