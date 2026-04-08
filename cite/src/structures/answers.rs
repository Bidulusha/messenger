/*              Include              */
// Serde
use serde::{Serialize, Deserialize};

/*              Structures           */
/*      Auth Answering      */
// Status enum
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AuthStatus {
    OK,
    ERR,
    USER_NOT_FOUND,
    USER_ALREADY_EXISTS,
    SIGNIN_DATA_ERROR,
    ACCES_ALLOWED,
    ACCESS_DENIED
}
// Auth answer
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthAnswer {
    pub status_code: AuthStatus,
    pub user_id: i128,
    pub token: String
}