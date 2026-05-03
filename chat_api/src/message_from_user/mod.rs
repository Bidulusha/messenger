/*              Includes                 */
// core
use core::net::SocketAddr;

use chrono::NaiveTime;
// serde
use serde::{Deserialize, Serialize};

// Project files
use shared_lib::structures::answers::{AuthAnswer, AuthStatus, ChatStatus, UserStatus};

// Project libraries
use shared_lib::database::{ChatMessage, ChatsInfo, ChatsUserWithInfo, MessageContent, UserShortInfo, UsersInfo};


/*              ENUMS                    */
#[allow(non_camel_case_types)]
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum MessageType {
    AUTH_CHECK,
    USER_NOT_FOUND,
    USER_SHORT_INFO,
    CHAT_INFO,
    GET_CHATS,
    START_CHAT,
    OPEN_CHAT,
    SEND_MESSAGE,
    CREATE_CHAT,
    DELETE_ACCOUNT,
    TEXT
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
    pub req_id: i32,
    pub message_type: MessageType,
    pub content: String
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SendMessage {
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
    pub fn auth_access_allowed(req_id: i32) -> String {
        return serde_json::to_string(&UserMessage { 
            req_id,
            message_type: MessageType::AUTH_CHECK, 
            content: AuthStatus::ACCESS_ALLOWED.into()
        }).unwrap()
    }

    pub fn auth_access_denied(req_id: i32) -> String {
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::AUTH_CHECK,
            content: AuthStatus::ACCESS_DENIED.into()
        }).unwrap()
    }

    /*               INFO                */
    pub fn user_short_info(req_id:i32, user: &UserShortInfo) -> String {
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::USER_SHORT_INFO,
            content: serde_json::to_string(
                user
            ).unwrap()
        }).unwrap()
    }

    pub fn send_text(req_id: i32, text: String) -> String {
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::TEXT,
            content: text
        }).unwrap()
    }

    /*              CHATS                */
    pub fn get_chats(req_id:i32, chats: &Vec<ChatsUserWithInfo>)  -> String{
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::GET_CHATS,
            content: serde_json::to_string(&chats).unwrap()
        }).unwrap()
    }

    pub fn start_chat(req_id: i32, user_info: &ChatsUserWithInfo) -> String{
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::START_CHAT,
            content: serde_json::to_string(
                user_info
            ).unwrap()
        }).unwrap()
    }

    pub fn open_chat(req_id: i32, chats: &Vec<ChatMessage>) -> String {
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::OPEN_CHAT,
            content: serde_json::to_string(chats).unwrap()
        }).unwrap()
    }

    pub fn create_chat(req_id: i32, chat: &ChatsUserWithInfo) -> String {
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::CREATE_CHAT,
            content: serde_json::to_string(&chat).unwrap()
        }).unwrap()
    }

    pub fn send_message(req_id: i32, chat: &ChatMessage) -> String{
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::SEND_MESSAGE,
            content: serde_json::to_string(chat).unwrap()
        }).unwrap()
    }

    pub fn sm_result_ok(req_id: i32) -> String {
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::SEND_MESSAGE, 
            content: "Ok".into()
        }).unwrap()
    }

    pub fn sm_result_new_chat(req_id: i32, chat_info: &ChatsUserWithInfo) -> String {
        return serde_json::to_string(&UserMessage{
            req_id,
            message_type: MessageType::SEND_MESSAGE,
            content: serde_json::to_string(chat_info).unwrap()
        }).unwrap()
    }

    /*              USER NOT FOUND           */
    pub fn user_not_found(req_id: i32) -> String {
        return serde_json::to_string(&UserMessage {
            req_id, 
            message_type: MessageType::USER_SHORT_INFO,
            content: UserStatus::USER_NOT_FOUND.into()
        }).unwrap()
    }

    /*              CHAT NOT FOUND           */
    pub fn chat_not_found(req_id: i32) -> String {
        return serde_json::to_string(&UserMessage {
            req_id,
            message_type: MessageType::START_CHAT,
            content: ChatStatus::CHAT_NOT_FOUND.into()
        }).unwrap()
    }
}


impl SendMessage {
    pub fn to_chat_message(self, user_id: i32) -> ChatMessage {
        ChatMessage { 
            id: -1, 
            who_sended: user_id, 
            send_time: chrono::Utc::now().time(), 
            content: self.what
        }
    }

    pub fn to_chat_message_with_chat_id(self, user_id: i32, chat_id: i32) -> ChatMessage {
        ChatMessage { 
            id: chat_id, 
            who_sended: user_id, 
            send_time: chrono::Utc::now().time(), 
            content: self.what
        }
    }
}