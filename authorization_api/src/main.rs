/*              Include              */
// mod
mod route;
mod handlers;
mod token;

// std
use std::sync::Arc;

// dotenv
use dotenv::dotenv;

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

// Projecr library
use shared_lib::database::create_postgresql_client;

/*              App state            */
struct AppState {
    client: Arc<Client>
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
    
    // Create state
    let state = AppState{
        client: Arc::new(client)
    };
    
    // Create app with state
    let cors = CorsLayer::new()
        // .allow_origin(AllowOrigin::exact("http://localhost:3000".parse().unwrap()))
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS]) // Разрешаем OPTIONS
        .allow_headers([http::header::CONTENT_TYPE, http::header::AUTHORIZATION]); // Разрешаем нужные заголовки
        // .allow_credentials(true); // Если используете cookies/сессии
    
    let app = create_router(Arc::new(state)).layer(cors);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8081").await.unwrap();

    axum::serve(listener, app).await.unwrap();
    Ok(())
}
