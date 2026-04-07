/*                  Includes               */
//mods
mod route;
mod handlers;
mod structures;

//Project files
use route::create_router;
use structures::answers;

/*               Main function             */
#[tokio::main]
async fn main() -> Result<(), String>{
    // Creating routing
    let app = create_router();

    // Creating listener for server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    // Start server
    axum::serve(listener, app).await.unwrap();
    Ok(())
}
