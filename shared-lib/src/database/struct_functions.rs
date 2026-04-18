/*              Includes                 */

// crates
use crate::database::{
    ChatMessage, ChatsInfo, ChatsUser, ChatsUserWithInfo, UsersInfo
};

// tokio postgres
use tokio_postgres::Row;


/*              Implementations          */
/*      From impl        */
impl From<Row> for UsersInfo {
    fn from(item: Row) -> Self{
        UsersInfo {
            id: item.get("id"),
            email: item.get("email"),
            login: item.get("login"),
            password: item.get("password"),
            avatar: item.get("avatar")
        }
    }
}

impl From<Row> for ChatsUser {
    fn from(item: Row) -> Self {
        ChatsUser {
            id: item.get("id"),
            chat_id: item.get("chat_id"),
            with: item.get("with")
        }
    }
}

impl From<Row> for ChatsInfo {
    fn from(item: Row) -> Self {
        ChatsInfo { 
            id: item.get("id"), 
            avatar: item.get("avatar"), 
            chat_name: item.get("chat_name"), 
            members_id: item.get("members_id") 
        }
    }
}

impl From<Row> for ChatsUserWithInfo {
    fn from(item: Row) -> Self {
        ChatsUserWithInfo { 
            chat_id: item.get("chat_id"), 
            chat_name: item.get("chat_name"), 
            chat_avatar: item.get("chat_avatar"), 
            with_user: item.get("with_user"), 
            members_id: item.get("members_id") 
        }
    }
}

impl From<Row> for ChatMessage {
    fn from(item: Row) -> Self {
        ChatMessage { 
            id: item.get("id"),
            who_sended: item.get("who_sended"),
            send_time: item.get("send_time"),
            content: item.get("content")
        }
    }
}



/*              From ChatsUserWith Info to ChatsInfo */
impl From<UsersInfo> for ChatsUserWithInfo{
    fn from(item: UsersInfo) -> Self {
        ChatsUserWithInfo { 
            chat_id: item.id, 
            chat_name: item.login, 
            chat_avatar: item.avatar, 
            with_user: Some(item.id), 
            members_id: vec![]
        } 
    }
}