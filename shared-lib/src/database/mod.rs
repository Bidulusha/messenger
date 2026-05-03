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

// tokio postgres
use tokio_postgres::{Client, Connection, Error, NoTls, Socket, tls::NoTlsStream};

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
    pub with: Option<i32>,
    pub last_change: Option<NaiveTime>
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

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserShortInfo {
    pub id: i32,
    pub login: String,
    pub avatar: String
}
pub async fn create_postgresql_client()  -> Result<(Client, Connection<Socket, NoTlsStream>), Error>{ 
    //init dotenv
    dotenv::dotenv().ok();

    //init database
    let db_host = std::env::var("POSTGRES_HOST").expect("POSTGRES_HOST must be set!");
    let db_port = std::env::var("POSTGRES_PORT").expect("POSTGRES_PORT must be set!");
    let db_name = std::env::var("POSTGRES_DB").expect("POSTGRES_DB must be set!");
    let db_user = std::env::var("POSTGRES_USER").expect("POSTGRES_USER must be set!");
    let db_password = std::env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set");

    let (client, connection) = 
        tokio_postgres::connect(&format!(
                "host={} port={} dbname={} user={} password={}", 
                db_host, db_port, db_name, db_user, db_password
            ), NoTls).await?;

    Ok((client, connection))
}
