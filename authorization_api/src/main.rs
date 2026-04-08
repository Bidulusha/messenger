/*              Include              */
// mod
mod route;
mod handlers;
mod model;
mod structures;
mod database;
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

/*              App state            */
struct AppState {
    client: Arc<Client>
}


/*              Main function        */
#[tokio::main]
async fn main() -> Result<(), Error>{
    // Connect to postgresql
    //init dotenv
    dotenv().ok();

    //init database
    let db_host = std::env::var("POSTGRES_HOST").expect("POSTGRES_HOST must be set!");
    let db_port = std::env::var("POSTGRES_PORT").expect("POSTGRES_PORT must be set!");
    let db_name = std::env::var("POSTGRES_DB").expect("POSTGRES_DB must be set!");
    let db_user = std::env::var("POSTGRES_USER").expect("POSTGRES_USER must be set!");
    let db_password = std::env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set");

    let (client, connection) = 
        tokio_postgres::connect(&format!("host={} port={} dbname={} user={} password={}", db_host, db_port, db_name, db_user, db_password), NoTls).await?;

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
        .allow_origin(AllowOrigin::exact("http://localhost:3000".parse().unwrap()))
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS]) // Разрешаем OPTIONS
        .allow_headers([http::header::CONTENT_TYPE, http::header::AUTHORIZATION]) // Разрешаем нужные заголовки
        .allow_credentials(true); // Если используете cookies/сессии
    
    let app = create_router(Arc::new(state)).layer(cors);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8081").await.unwrap();

    axum::serve(listener, app).await.unwrap();
    Ok(())
}
