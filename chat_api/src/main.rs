/*              Include              */
// mod
mod route;
mod handlers;
mod message_from_user;
mod websocket_messages;
mod chat_functions;

// std
use std::{
    collections::HashMap, net::SocketAddr, sync::Arc
};

use axum::extract::ws::{Message, WebSocket};
// dotenv
use dotenv::dotenv;

use futures_util::stream::SplitSink;
// Tokio
use tokio::sync::broadcast::{self, Receiver, Sender};
use tokio::sync::Mutex;

use tokio::sync::mpsc::UnboundedSender;
// Tokio postgres
use tokio_postgres::{
    NoTls,
    Error,
    Client
};

// tower http
use tower_http::cors::{CorsLayer, Any, AllowOrigin};

// http
use http::Method;

// Project files
use route::create_router;

// Project libraries
use shared_lib::database::create_postgresql_client;


/*              App state            */
struct AppState{
    client: Arc<Client>,
    connections: Arc<Mutex<HashMap<i32, UnboundedSender<Message>>>>
}


/*              Main function        */
#[tokio::main]
async fn main() -> Result<(), Error>{
    // Connect to postgresql
    let (client, connection) = create_postgresql_client().await?;

    tokio::spawn(async move{
        if let Err(err) = connection.await {
            eprint!("Connection error: {err}")
        }
    });
    

    // Create broadcast
    let (tx, rx) = broadcast::channel::<String>(16);

    // Create state
    let state = AppState{
        client: Arc::new(client),
        connections: Arc::new(Mutex::new(HashMap::new()))
    };
    
    // Create app with state
    let cors = CorsLayer::new()
        // .allow_origin(AllowOrigin::exact("http://localhost:3000".parse().unwrap()))
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS]) // Разрешаем OPTIONS
        .allow_headers([http::header::CONTENT_TYPE, http::header::AUTHORIZATION]); // Разрешаем нужные заголовки
        // .allow_credentials(true); // Если используете cookies/сессии
    
    let app = create_router(Arc::new(state)).layer(cors);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
    Ok(())
}
