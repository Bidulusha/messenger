/*              Includes                 */
// Crate 
use crate::AppState;

// Std
use std::{
    sync::Arc,
    net::SocketAddr, 
    ops::ControlFlow
};

//Axum
use axum::{
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


/*              Functions                */
/* Websocket connection for admin page */
pub async fn admin_page_ws_handler(
    ws: WebSocketUpgrade,
    user_agent: Option<TypedHeader<headers::UserAgent>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(state): State<Arc<AppState>>
) -> impl IntoResponse {
    println!("Here!");
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

    let mut rx2 = state.tx.subscribe();

    //Spawn while close answering
    let mut recv_task = tokio::spawn(async move{
        while let Some(Ok(msg)) = receiver.next().await {
            if let Ok(data) = rx2.recv().await {
                println!("Get!");
                let _ = sender.send(Message::text(data)).await;
            }
            if process_message(msg, who).is_break() {
                break;
            }
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

 