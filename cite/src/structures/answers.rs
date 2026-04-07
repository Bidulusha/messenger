/*              Include              */
// Serde
use serde::{Serialize, Deserialize};

/*              Structures           */
/*      Auth Answering      */
// Status enum
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AuthStatus {
    OK = 0,
    ERR = 1
}
// Auth answer
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthAnswer {
    pub status_code: AuthStatus,
    pub user_id: i128,
    pub token: String
}