/*              Include              */
// mod
mod route;
mod handlers;
mod model;
mod structures;
mod database;

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

    let ans = model::UsersInfo::select_all(&state.client).await;
    println!("{:?}", ans);

    // Create app with state
    let app = create_router(Arc::new(state));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8081").await.unwrap();

    axum::serve(listener, app).await.unwrap();
    Ok(())
}
