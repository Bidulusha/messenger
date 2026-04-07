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
            id: item.get(1),
            login: item.get(2),
            password: item.get(3),
            active_sessions: item.get(4),
            chats: item.get(5),
        }
    }
}