/*              Includes                 */
// core
use core::net::SocketAddr;

use chrono::NaiveTime;
// serde
use serde::{Deserialize, Serialize};

// Project files
use shared_lib::structures::answers::{AuthAnswer, AuthStatus, ChatStatus, UserStatus};

// Project libraries
use shared_lib::database::{ChatMessage, ChatsInfo, ChatsUserWithInfo, MessageContent, UsersInfo};


/*              ENUMS                    */
#[allow(non_camel_case_types)]
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum MessageType {
    AUTH_CHECK,
    GET_CHATS,
    START_CHAT,
    OPEN_CHAT,
    SEND_MESSAGE,
    CREATE_CHAT,
}

/*              STRUCTURES                */
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct User {
    pub user_id: i32,
    pub authorized: bool,
    pub user_name: String,
    pub user_avatar: String,
    pub connection_info: SocketAddr,
    pub active_chat: Option<ChatsInfo>
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UserMessage {
    pub message_type: MessageType,
    pub content: String
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SendMessage {
    pub id_who: i32,
    pub id_to: i32,
    pub what: MessageContent
}

/*          REQUESTS         */
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuthRequest {
    pub user_id: i32,
    pub token: String
}


/*              IMPLEMENTATIONS              */
impl UserMessage {
    /*              AUTHORIZATION            */
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

    /*              CHATS                */
    pub fn get_chats(chats: &Vec<ChatsUserWithInfo>)  -> String{
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::GET_CHATS,
            content: serde_json::to_string(&chats).unwrap()
        }).unwrap()
    }

    pub fn start_chat(user_info: &ChatsUserWithInfo) -> String{
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::START_CHAT,
            content: serde_json::to_string(
                user_info
            ).unwrap()
        }).unwrap()
    }

    pub fn open_chat(chats: &Vec<ChatMessage>) -> String {
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::OPEN_CHAT,
            content: serde_json::to_string(chats).unwrap()
        }).unwrap()
    }

    pub fn create_chat(chat: ChatsUserWithInfo) -> String {
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::CREATE_CHAT,
            content: serde_json::to_string(&chat).unwrap()
        }).unwrap()
    }

    pub fn send_message(chat: &ChatMessage) -> String{
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::SEND_MESSAGE,
            content: serde_json::to_string(chat).unwrap()
        }).unwrap()
    }

    /*              USER NOT FOUND           */
    pub fn user_not_found() -> String {
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::START_CHAT,
            content: UserStatus::USER_NOT_FOUND.into()
        }).unwrap()
    }

    /*              CHAT NOT FOUND           */
    pub fn chat_not_found() -> String {
        return serde_json::to_string(&UserMessage {
            message_type: MessageType::START_CHAT,
            content: ChatStatus::CHAT_NOT_FOUND.into()
        }).unwrap()
    }
}


impl From<SendMessage> for ChatMessage {
    fn from(value: SendMessage) -> Self {
        ChatMessage { 
            id: -1, 
            who_sended: value.id_who, 
            send_time: chrono::Utc::now().time(), 
            content: value.what
        }
    }
}