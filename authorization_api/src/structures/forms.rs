/*              Include              */
// Serde
use serde::{Deserialize, Serialize};


/*              Structures           */
// AuthorizationForm
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthForm{
    pub login: String,
    pub password: String
}