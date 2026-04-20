/*              Includes                 */
// Crate 
use crate::AppState;
use crate::message_from_user;
use crate::chat_functions;

// Std
use std::{
    sync::Arc,
    net::SocketAddr, 
    ops::ControlFlow
};

// Colorized
use colored::Colorize;

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

use shared_lib::database::ChatsUserWithInfo;
// Tokio
use tokio::sync::mpsc;

//futures util
use futures_util::{sink::SinkExt, stream::StreamExt};

// Project files
use message_from_user::{
    User, 
    UserMessage, 
    AuthRequest,
    MessageType,
    SendMessage
};

use chat_functions::{
    start_chat::start_chat,
    send_message::send_message,
};

// Project libraries
use shared_lib::structures::answers::TokenCheckAnswer;
use shared_lib::structures::answers::AuthAnswer;
use shared_lib::structures::answers::AuthStatus;
use shared_lib::structures::answers::ChatStatus;
use shared_lib::database::{
    ChatsUser,
    ChatMessage,
    UsersInfo,
    ChatsInfo
};


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

    let (mut sender, mut receiver) = socket.split();

    let (tx, mut rx) = mpsc::unbounded_channel::<Message>();

    let mut send_task = tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            if sender.send(msg).await.is_err() {
                break;
            }
        }
    });

    // Create user
    let mut user = User {
        user_id: -1,
        user_name: "".into(),
        user_avatar: "".into(),
        authorized: false,
        connection_info: who,
        active_chat: None
    };

    
    while let Some(Ok(msg)) = receiver.next().await {
            if let Ok(text) = msg.to_text() {
                println!("{}", text);
                match serde_json::from_str::<UserMessage>(text) {
                    Ok(data) => {
                        // NOT AUTHORIZED USER
                        if user.authorized != true && data.message_type != MessageType::AUTH_CHECK {
                            let _ = tx.send(Message::text(UserMessage::auth_access_denied()));
                            break;
                        }

                        // GET REQUESTS
                        match data.message_type{
                            MessageType::AUTH_CHECK => { // Check token
                                println!("HERE!");
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
                                                    let user_info = 
                                                            UsersInfo::get_by_user_id(&state.client, &user.user_id).await;
                                                    user.user_name = user_info[0].clone().login;
                                                    user.user_avatar = user_info[0].clone().avatar;
                                                    state.connections.lock().await.insert(user.user_id, tx.clone());
                                                    let _ = tx.send(Message::text(UserMessage::auth_access_allowed()));
                                                    drop(data);
                                                }
                                                else {
                                                    let _ = tx.send(Message::text(UserMessage::auth_access_denied()));
                                                    break;
                                                }
                                            }
                                            Err(_) => {
                                                let _ = tx.send(Message::text(UserMessage::auth_access_denied()));
                                                break;
                                            }
                                        }
                                } else {
                                    let _ = tx.send(Message::text(UserMessage::auth_access_denied()));
                                    break;
                                }
                            }

                            MessageType::CREATE_CHAT => {

                            }

                            // GET CHATS
                            MessageType::GET_CHATS => { // Get chats
                                let chats = ChatsUser::select_all_join_chat_info(&state.client, &user.user_id).await;
                                let _ = tx.send(Message::text(UserMessage::get_chats(&chats)));
                                drop(chats);
                            }

                            // START CHAT
                            MessageType::START_CHAT => { 
                                let found_users = UsersInfo::get_by_login(&state.client, &data.content).await;
                                if found_users.len() > 0 {
                                    let _ = tx.send(Message::text(UserMessage::start_chat(&found_users[0].clone().into())));                                
                                }
                                else {
                                    let _ = tx.send(Message::text(UserMessage::user_not_found()));
                                }
                                drop(found_users);
                            }

                            // OPEN CHAT
                            MessageType::OPEN_CHAT =>  {
                                match data.content.parse::<i32>() {
                                    Ok(chat_id) => {
                                        let chats = ChatMessage::select_all(&state.client, &chat_id).await;
                                        user.active_chat = Some(ChatsInfo::get(&state.client, &chat_id).await[0].clone());

                                        let _ = tx.send(Message::text(UserMessage::open_chat(&chats)));
                                    }
                                    Err(_) => {
                                        let _ = tx.send(Message::text(UserMessage::chat_not_found()));
                                    }
                                }
                            }

                            // SEND MESSAGE
                            MessageType::SEND_MESSAGE => {
                                match serde_json::from_str::<SendMessage>(&data.content) {
                                    Ok(message) => {
                                        let mut chat_id = message.id_to;
                                        // 1) If chat not exists create it
                                        // if first_message is true
                                        if (message.first_message) {
                                            chat_id = start_chat(&state, &user, &message).await;
                                        }
                                        // 2) Put message to db
                                        send_message(&state, &user, &message).await;

                                        // 3) Check active chats of user
                                        if user.clone().active_chat.is_none() {
                                            user.active_chat = Some(ChatsInfo::get(&state.client, &chat_id).await[0].clone());
                                        }

                                        // 3) Send message to chat members

                                        for member in user.clone().active_chat.unwrap().members_id {
                                            if (member != user.user_id){
                                                if let Some(recipient_tx) 
                                                        = state.connections.lock().await.get(&member) {
                                                    let _ = recipient_tx.send(
                                                        Message::text(
                                                            UserMessage::send_message(
                                                                &message.clone().to_chat_message_with_chat_id(user.user_id, chat_id)
                                                            )
                                                        )
                                                    );
                                                }
                                            }
                                        }
                                    }
                                    Err(err) => {println!("{}", format!("Error getting chat message! Error {:?}", err).red())}
                                }
                            }
                        }

                        drop(data);
                    }
                    Err(err) => { 
                        println!("{who} Send {}. Error {:?} ", msg.to_text().unwrap(), err);
                    }
                }
            }
        if process_message(msg, who).is_break() {
            break;
        }
    }
    
    if user.authorized {
        state.connections.lock().await.remove(&user.user_id);
    }
    send_task.abort();        
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

 