/*              Includes                */
// crates
use crate::handlers;

// Axum
use axum::{
    routing::{get},
    Router
};


/*              Functions                */
//create router
pub fn create_router() -> Router {
    Router::new()
        .route("/",     get(handlers::main_page))
        .route("/auth", get(handlers::auth_page))
        .route("/chat", get(handlers::chat_page))
}