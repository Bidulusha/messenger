/*              Includes                */
// Chrono
use chrono::{NaiveTime};

// serde
use serde::{Serialize, Deserialize};

//postgres_types
use postgres_types::{ToSql, FromSql};


/*              Structures              */
/*   SQL structures  */
#[derive(Debug, Clone, FromSql, ToSql, Serialize, Deserialize)]
pub struct MessageContent {
    pub answer_to: i64,
    pub forwarded_from: i64,
    pub text_content: String,
    pub photos_content: Vec<String>,
    pub files: Vec<String>
}

/*      Models       */
// User info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UsersInfo {
    pub id: i64,
    pub login: String,
    pub password: String,
    pub active_sessions: Vec<i64>,
    pub chats: Vec<i64>,
}

// Chats info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatsInfo{
    pub id: i64,
    pub avatar: String,
    pub name: String,
    pub members_id: Vec<i64>
}

// Chat [id]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Chat {
    pub id: i64,
    pub who_sended: i64,
    pub send_time: NaiveTime,
    pub content: MessageContent
}

// Active sessions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveSessions {
    pub id: i64,
    pub user_id: i64,
    pub token: String
}


