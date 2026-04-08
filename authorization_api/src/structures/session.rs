/*              Includes             */
// Std
use std::hash::{Hash};

// Chrono
use chrono::NaiveTime;

// Project libraries
use crate::model::UsersInfo;


#[derive(Hash)]
pub struct Session{
    pub user: UsersInfo,
    pub user_agent: String
}