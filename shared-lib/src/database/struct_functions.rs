/*              Includes                 */

// crates
use crate::database::{
    UsersInfo,
    ChatsUser,
    ChatsInfo
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
            password: item.get("password")
        }
    }
}

impl From<Row> for ChatsUser {
    fn from(item: Row) -> Self {
        ChatsUser { 
            id: item.get("id"), 
            chat_id: item.get("chat_id") 
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