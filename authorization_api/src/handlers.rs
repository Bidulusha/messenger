/*              Includes                 */
// std
use std::sync::Arc;

// Axum
use axum::{
    extract::State,
    Json
};

// Crate
use crate::AppState;
use crate::structures::forms::{AuthForm};
use crate::structures::answers::{AuthAnswer, AuthStatus};
use crate::model::UsersInfo;

// Serde html form
use serde_html_form;

/*              Functions                */
// Sing in checker
pub async fn sign_in_auth(State(state): State<Arc<AppState>>, raw_data: String) -> Json<AuthAnswer> {
    match serde_html_form::from_str::<AuthForm>(&raw_data) {
        Ok(data) => {
            let users = UsersInfo::get_by_login(&state.client, &data.login).await;
            println!("{:?}", users);
            println!("login = {}, password = {}", data.login, data.password);
            return Json(AuthAnswer {
                status_code: AuthStatus::OK,
                user_id: 1,
                token: String::from("1")
            });
        }
        Err(err) => {
            println!("Cannot parse authorization form! Error: {err}");
            return Json(AuthAnswer {
                status_code: AuthStatus::ERR,
                user_id: -1,
                token: String::from("")
            });
        }
    }
}

// Sign up checker
pub async fn sign_up_auth(State(state): State<Arc<AppState>>, raw_data: String) -> Json<AuthAnswer> {
    match serde_html_form::from_str::<AuthForm>(&raw_data){
        Ok(data) => {
            let user = UsersInfo {
                id: -1,
                login: data.login,
                password: data.password,
                active_sessions: vec![],
                chats: vec![]
            };
            UsersInfo::add(&state.client, user).await;
        }
        Err(_) => {

        }
    }
    return Json(AuthAnswer {
                status_code: AuthStatus::OK,
                user_id: 1,
                token: String::from("1")
            });
}