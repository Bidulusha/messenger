/*              Includes                 */
// crates
use crate::model::{
    UsersInfo
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
            chats: item.get("chats"),
        }
    }
}