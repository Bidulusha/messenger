/*              Includes                 */
// Crate 
use crate::AppState;
use crate::message_from_user;

// Std
use std::{
    sync::Arc,
    net::SocketAddr, 
    ops::ControlFlow
};

//Axum
use axum::{
    Json,
    body::Bytes,
    response::{
        IntoResponse
    },
    extract::{
        State,
        ws::{
            Message,
            //Utf8Bytes,
            WebSocket,
            WebSocketUpgrade,
            //CloseFrame
        },
        connect_info::ConnectInfo
    },
    //http::StatusCode
};
use axum_extra::{
    TypedHeader, 
    headers
};

//futures util
use futures_util::{sink::SinkExt, stream::StreamExt};

// Project files
use message_from_user::{
    User, 
    UserMessage, 
    AuthRequest,
    MessageType
};

use shared_lib::database::ChatsInfo;
// Project libraries
use shared_lib::structures::answers::TokenCheckAnswer;
use shared_lib::structures::answers::AuthAnswer;
use shared_lib::structures::answers::AuthStatus;
use shared_lib::database::ChatsUser;


/*              Functions                */
/* Websocket connection for admin page */
pub async fn admin_page_ws_handler(
    ws: WebSocketUpgrade,
    user_agent: Option<TypedHeader<headers::UserAgent>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<Arc<AppState>>
) -> impl IntoResponse {
    let user_agent = if let Some(TypedHeader(user_agent)) = user_agent {
        user_agent.to_string()
    } else {
        String::from("Unkown browser")
    };
    println!("User agent `{user_agent}` at `{addr}` connected.");

    ws.on_upgrade(move |socket| handle_socket(socket, addr, state))
}

async fn handle_socket(mut socket: WebSocket, who: SocketAddr, state: Arc<AppState>){
    if socket
        .send(Message::Ping(Bytes::from_static(&[1, 2, 3])))
        .await
        .is_ok()
    {
        println!("Pinged {who}...");
    } else {
        println!("Couldn't send ping {who}!");
        return;
    }

    // Creating websocket req->ans connection
    // For making req<->ans check https://github.com/tokio-rs/axum/blob/main/examples/websockets/src/client.rs
    // receive single message from a client (we can either receive or send with socket).
    // this will likely be the Pong for our Ping or a hello message from client.
    // waiting for message from a client will block this task, but will not block other client's
    // connections.
    if let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            if process_message(msg, who).is_break() {
                return;
            }
        } else {
            println!("Client {who} abruptly disconnected!");
            return;
        }
    }

    
    let (mut sender, mut receiver) = socket.split();

    if sender
        .send(Message::Text(format!("Connection to {who} succesful!").into()))
        .await
        .is_err()
    {
        return;
    }

    // subscribe broadcast
    let mut rx2 = state.tx.subscribe();

    // Create user
    let mut user = User {
        user_id: -1,
        authorized: false,
        connection_info: who
    };

    

    //Spawn while close answering
    let mut recv_task = tokio::spawn(async move{
        while let Some(Ok(msg)) = receiver.next().await {
            // Get data from ws
            println!("{}", msg.to_text().unwrap());
            match serde_json::from_str::<UserMessage>(msg.to_text().unwrap()) {
                Ok(data) => {
                    // NOT AUTHORIZED USER
                    if user.authorized != true && data.message_type != MessageType::AUTH_CHECK {
                        let _ = sender.send(Message::text(UserMessage::auth_access_allowed())).await;
                        break;
                    }

                    // GET REQUESTS
                    match data.message_type{

                        MessageType::AUTH_CHECK => { // Check token
                            if let Ok(req) = serde_json::from_str::<AuthRequest>(&data.content) {
                                let client = reqwest::Client::new();
                                match serde_json::from_str::<AuthAnswer>(
                                    &client.post("http://localhost:8081/api/auth/check_token")
                                    .body(serde_json::to_string(
                                        &TokenCheckAnswer{
                                            user_id: req.user_id, 
                                            token: req.token
                                        }).unwrap())
                                    .send()
                                    .await.unwrap().text().await.unwrap()) {
                                        Ok(data) => {
                                            if data.status_code == AuthStatus::ACCESS_ALLOWED {
                                                user.user_id = req.user_id;
                                                user.authorized = true;
                                                let _ = sender.send(Message::text(UserMessage::auth_access_allowed())).await;
                                                drop(data);
                                            }
                                            else {
                                                let _ = sender.send(Message::text(UserMessage::auth_access_denied())).await;
                                                break;
                                            }
                                        }
                                        Err(_) => {
                                            let _ = sender.send(Message::text(UserMessage::auth_access_denied())).await;
                                            break;
                                        }
                                    }
                            } else {
                                let _ = sender.send(Message::text(UserMessage::auth_access_denied())).await;
                                break;
                            }
                        }

                        MessageType::GET_CHATS => { // Get chats
                            let chats = ChatsUser::select_all(&state.client, &user.user_id).await;
                            let chats_info = ChatsInfo::get_chats(&state.client, &chats).await; 
                            let _  = sender.send(Message::text(UserMessage::get_chats(chats_info))).await;
                            drop(chats);
                        }
                        MessageType::OPEN_CHAT =>  {

                        }
                        MessageType::SEND_MESSAGE => {

                        }
                    }
                }
                Err(err) => { 
                    eprintln!("{}", err);
                }
            }

            if process_message(msg, who).is_break() {
                break;
            }
            
            // if let Ok(data) = rx2.recv().await { // or use tokio spawn module
            //     println!("Get!");
            //     let _ = sender.send(Message::text(data)).await;
            // }
        }
    });

}

fn process_message(msg: Message, who: SocketAddr) -> ControlFlow<(), ()> {
    match msg {
        Message::Text(t) => {
            println!(">>> {who} sent str: {t:?}");
        }
        Message::Binary(d) => {
            println!(">>> {who} sent {} bytes: {d:?}", d.len());
        }
        Message::Close(c) => {
            if let Some(cf) = c {
                println!(">>> {who} sent close with code {} and reason `{}`", cf.code, cf.reason);
            } else {
                println!(">>> {who} somehow sent close message without CloseFrame");
            }
            return ControlFlow::Break(());
        }
        Message::Pong(v) => {
            println!(">>> {who} sent pong with {v:?}");
        }
        Message::Ping(v) => {
            println!(">>> {who} sent ping with {v:?}");
        }
    }
    ControlFlow::Continue(())
}

 