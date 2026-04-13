/*              Includes                 */
// core
use core::net::SocketAddr;

// serde
use serde::{Deserialize, Serialize};

// Project files
use shared_lib::structures::answers::{AuthAnswer, AuthStatus};

// Project libraries
use shared_lib::database::{ChatsInfo};

/*              Functions                */
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum MessageType {
    AUTH_CHECK,
    GET_CHATS,
    OPEN_CHAT,
    SEND_MESSAGE,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct User {
    pub user_id: i32,
    pub authorized: bool,
    pub connection_info: SocketAddr
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserMessage {
    pub message_type: MessageType,
    pub content: String
}

/*          REQUESTS         */
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuthRequest {
    pub user_id: i32,
    pub token: String
}


impl UserMessage {
    pub fn auth_access_allowed() -> String {
        return serde_json::to_string(&UserMessage { 
            message_type: MessageType::AUTH_CHECK, 
            content: AuthStatus::ACCESS_ALLOWED.into()
        }).unwrap()
    }

    pub fn auth_access_denied() -> String {
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::AUTH_CHECK,
            content: AuthStatus::ACCESS_DENIED.into()
        }).unwrap()
    }

    pub fn get_chats(chats: Vec<ChatsInfo>)  -> String{
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::GET_CHATS,
            content: serde_json::to_string(&chats).unwrap()
        }).unwrap()
    }
}


/*  ACCESS DENIED  */
// pub fn access_denied() -> String{
    
// }

// /*  ACCESS ALLOWED */
// pub fn access_allowed() -> String{
    
// }