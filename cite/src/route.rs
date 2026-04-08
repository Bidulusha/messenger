/*              Includes                */
// crates
use crate::handlers;

// Axum
use axum::{
    routing::{get, any},
    Router
};

//tower_http
use tower_http::services::ServeDir;

/*              Functions                */
//create router
pub fn create_router() -> Router {
    Router::new()
        // root
        .route("/",     get(handlers::main_page))
        // chat
        .route("/chat", get(handlers::chat_page))
        // sign in
        .route("/sign_in", any(handlers::sign_in_page))
        //sign up
        .route("/sign_up", any(handlers::sign_up_page))
        // nest service
        .nest_service("/static", ServeDir::new("static"))
}