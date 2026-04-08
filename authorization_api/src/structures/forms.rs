/*              Include              */
// Serde
use serde::{Deserialize, Serialize};

// Project files
use crate::model::UsersInfo;


/*              Structures           */
// AuthorizationForm
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthForm{
    pub email: String,
    pub login: String,
    pub password: String
}



/*              Implementations     */
impl From<AuthForm> for UsersInfo {
    fn from(data: AuthForm) -> Self {
        UsersInfo {
                id: -1,
                email: data.email,
                login: data.login,
                password: data.password,
                chats: vec![]
            }
    }
}