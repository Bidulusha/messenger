/*              Includes                 */
// std
use std::sync::Arc;

// Axum
use axum::{
    extract::{State},
    Json
};

use axum_extra::TypedHeader;

// Crate
use crate::{AppState};

use crate::token;
// use crate::database::database_functions;

// Headers
use headers::UserAgent;

// Project libraries
use shared_lib::{database::{ActiveSessions, UsersInfo, ChatsUser}, structures::answers::TokenCheckAnswer};
use shared_lib::structures::answers::{AuthAnswer, AuthStatus};
use shared_lib::structures::forms::{SignInAuthForm, SignUpAuthForm};
use shared_lib::database::database_functions;

// Project files
use token::{create_token_and_add_to_db};
use database_functions::select_max_user_id;


/*              Functions                */
// Sing in checker
pub async fn sign_in_auth(
    TypedHeader(user_agent): TypedHeader<UserAgent>,
    State(state): State<Arc<AppState>>, 
    raw_data: String
) -> Json<AuthAnswer> {
    match serde_json::from_str::<SignInAuthForm>(&raw_data) {
        Ok(data) => {
            // 1) User exists check
            let users = UsersInfo::get_by_login(&state.client, &data.login).await;
            // User not found
            if users.len() == 0 {
                return Json(AuthAnswer { status_code: 
                    AuthStatus::USER_NOT_FOUND, 
                    user_id: -1, 
                    token: "".into() 
                });
            }

            // 2) Password check
            // Password incorrect
            if users[0].password != data.password {
                return Json(AuthAnswer { status_code: 
                    AuthStatus::SIGNIN_DATA_ERROR, 
                    user_id: -1, 
                    token: "".into() 
                });
            }

            // 3) Create new session token and add to db
            let token = create_token_and_add_to_db(&state.client, &users[0], &user_agent.to_string()).await;

            // 4) Answer to user
            return Json(AuthAnswer {
                status_code: AuthStatus::ACCESS_ALLOWED,
                user_id: users[0].id,
                token: token
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
pub async fn sign_up_auth(
    TypedHeader (user_agent): TypedHeader<UserAgent>,
    State(state): State<Arc<AppState>>, 
    raw_data: String
) -> Json<AuthAnswer> {
    match serde_json::from_str::<SignUpAuthForm>(&raw_data){
        Ok(data) => {
            let max_id = select_max_user_id(&state.client).await;
            let mut user: UsersInfo = data.into();
            
            // 1) USER EXISTS 
            if UsersInfo::get_by_login(&state.client, &user.login).await.len() != 0 {
                println!("User exists error!");
                return Json(AuthAnswer{
                    status_code: AuthStatus::USER_ALREADY_EXISTS,
                    user_id: -1,
                    token: String::from("")

                });
            }

            // 2) Create user
            user.id = max_id + 1;
            let _ = UsersInfo::add(&state.client, &user).await;

            // 3) Create table active_seesions_user_[id]
            let _ = ActiveSessions::create(&state.client, &user.id).await;

            // 3) Create table chats_user_[id]
            let _ = ChatsUser::create(&state.client, &user.id).await;

            // 4) Create unique token for session and add to db
            let token = create_token_and_add_to_db(&state.client, &user, &user_agent.to_string()).await;

            println!("Create new user!");
            // 5) Answer to user
            Json(AuthAnswer{
                status_code: AuthStatus::OK,
                user_id: user.id,
                token: token
            })
        }
        Err(err) => {
            println!("Cannot create new user! Error: {:?}", err);
            Json(AuthAnswer {
                status_code: AuthStatus::ERR,
                user_id: -1,
                token: String::from("")
            })
        }
    }
}

//Check token
pub async fn check_token(
    State(state) : State<Arc<AppState>>,
    raw_data: String
) -> Json<AuthAnswer>
{
    match serde_json::from_str::<TokenCheckAnswer>(&raw_data){
        Ok(data) => {
            let token_correct = ActiveSessions::check_token(&state.client, &data.user_id, &data.token).await;
            if token_correct{
                Json(AuthAnswer { 
                    status_code: AuthStatus::ACCESS_ALLOWED, 
                    user_id: -1, 
                    token: "".into()
                })
            }
            else {
                Json(AuthAnswer { 
                    status_code: AuthStatus::ACCESS_DENIED, 
                    user_id: -1, 
                    token: "".into()
                })
            }
            
        }
        Err(err) => {
            eprintln!("Error deserialize auth answerd! Error: {:?}", err);
            Json(AuthAnswer {
                status_code: AuthStatus::ERR,
                user_id: -1,
                token: "".into()
            })
        }
    }
}