/*              Include              */
// Serde
use serde::{Deserialize, Serialize};

// Project files
use crate::database::UsersInfo;


/*              Structures           */
// Sign up form
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignUpAuthForm {
    pub email: String,
    pub login: String,
    pub password: String
}

// Sign in form
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignInAuthForm {
    pub login: String,
    pub password: String
}


/*              Implementations     */
// sign in
impl From<SignUpAuthForm> for UsersInfo {
    fn from(data: SignUpAuthForm) -> Self {
        UsersInfo {
                id: -1,
                email: data.email,
                login: data.login,
                password: data.password
            }
    }
}

impl From<SignInAuthForm> for UsersInfo {
    fn from(data: SignInAuthForm) -> Self {
        UsersInfo { 
            id: -1,
            email: "".into(), 
            login: data.login, 
            password: data.password
        }
    }
}