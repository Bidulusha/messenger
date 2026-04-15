/*              Includes                 */

// crates
use crate::database::{
    UsersInfo,
    ChatsUser,
    ChatsInfo,
    ChatsUserWithInfo
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
            avatar: item.get("avatart"), 
            name: item.get("name"), 
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


/*              From ChatsUserWith Info to ChatsInfo */
// impl From<ChatsUserWithInfo> for ChatsInfo{
//     fn from(item: ChatsUserWithInfo) -> Self {
//         ChatsInfo { 
//             id: item.id, 
//             avatar: item., 
//             name: item.get("name"), 
//             members_id: item.get("members_id") 
//         }
//     }
// }