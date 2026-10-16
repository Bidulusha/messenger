use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct SignUpForm {
    pub email: String,
    pub login: String,
    pub password: String
}

#[derive(Serialize, Deserialize)]
pub struct SignInForm {
    pub login: String,
    pub password: String
}