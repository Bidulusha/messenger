/*              Includes                */
// mod
pub mod database_functions;
pub mod struct_functions;

// Std
use std::hash::{Hash};

// Chrono
use chrono::{NaiveTime};

// serde
use serde::{Serialize, Deserialize};

// postgres_types
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
#[derive(Debug, Clone, Serialize, Deserialize, Hash)]
pub struct UsersInfo {
    pub id: i32,
    pub email: String,
    pub login: String,
    pub password: String
}

// Chats info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatsInfo{
    pub id: i32,
    pub avatar: String,
    pub name: String,
    pub members_id: Vec<i64>
}

// Chat [id]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Chat {
    pub id: i32,
    pub who_sended: i64,
    pub send_time: NaiveTime,
    pub content: MessageContent
}

// Active sessions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveSessions {
    pub id: i32,
    pub token: String
}


