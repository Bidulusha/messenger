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
#[postgres(name="messagecontent")]
pub struct MessageContent {
    pub answer_to: i32,
    pub forwarded_from: i32,
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
    pub password: String,
    pub avatar: String,
}

// User chats
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatsUser{
    pub id: i32,
    pub chat_id: i32,
    pub with: Option<i32>
}

// Chats info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatsInfo {
    pub id: i32, 
    pub avatar: String,
    pub chat_name: String,
    pub members_id: Vec<i32>
}

// Chats user join chats info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatsUserWithInfo {
    pub chat_id: i32,
    pub chat_name: String,
    pub chat_avatar: String,
    pub with_user: Option<i32>,
    pub members_id: Vec<i32>
}

// Chat [id]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub id: i32,
    pub who_sended: i32,
    pub send_time: NaiveTime,
    pub content: MessageContent
}

// Active sessions
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveSessions {
    pub id: i32,
    pub token: String
}


