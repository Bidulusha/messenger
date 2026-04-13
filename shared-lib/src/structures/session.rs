/*              Includes             */
// Std
use std::hash::{Hash};

// Project libraries
use crate::database::UsersInfo;


#[derive(Hash)]
pub struct Session{
    pub user: UsersInfo,
    pub user_agent: String
}