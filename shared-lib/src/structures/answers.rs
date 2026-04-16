/*              Include              */
// Serde
use serde::{Serialize, Deserialize};

/*              Structures           */
/*      Auth Answering      */
// Status enum
#[allow(non_camel_case_types)]
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum AuthStatus {
    OK,
    ERR,
    USER_NOT_FOUND,
    USER_ALREADY_EXISTS,
    SIGNIN_DATA_ERROR,
    ACCESS_ALLOWED,
    ACCESS_DENIED,
}


// Auth answer
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthAnswer {
    pub status_code: AuthStatus,
    pub user_id: i32,
    pub token: String
}

// Token checker
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenCheckAnswer {
    pub user_id: i32,
    pub token: String
}

/*                  WS ANSWERS                   */

// User short info for sending
#[derive(Debug, Clone, Serialize, Deserialize, Hash)]
pub struct UserShortInfo {
    pub id: i32,
    pub login: String,
    pub avatar: String,
}

// User status for find
#[allow(non_camel_case_types)]
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum UserStatus {
    USER_NOT_FOUND,
}

// User status for find
#[allow(non_camel_case_types)]
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum ChatStatus {
    CHAT_NOT_FOUND,
}


impl From<AuthStatus> for String {
    fn from(value: AuthStatus) -> Self {
        match value {
            AuthStatus::ACCESS_ALLOWED => {
                "ACCESS_ALLOWED".into()
            }
            AuthStatus::ACCESS_DENIED => {
                "ACCESS_DENIED".into()
            }
            AuthStatus::OK => {
                "OK".into()
            }
            AuthStatus::ERR => {
                "ERR".into()
            }
            AuthStatus::SIGNIN_DATA_ERROR => {
                "SIGNIN_DATA_ERROR".into()
            }
            AuthStatus::USER_ALREADY_EXISTS => {
                "USER_ALREADY_EXISTS".into()
            }
            AuthStatus::USER_NOT_FOUND => {
                "USER_NOT_FOUND".into()
            }
        }
    }
}

impl From<UserStatus> for String {
    fn from(value: UserStatus) -> Self{
        match value {
            UserStatus::USER_NOT_FOUND => {
                "USER_NOT_FOUND".into()
            }
        }
    }
}

impl From<ChatStatus> for String {
    fn from(value: ChatStatus) -> Self{
        match value {
            ChatStatus::CHAT_NOT_FOUND => {
                "CHAT_NOT_FOUND".into()
            }
        }
    }
}