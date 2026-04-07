/*              Includes                */
// crates
use crate::handlers;

// Axum
use axum::{
    routing::{get, post},
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
        .route("/sign_in", get(handlers::sign_in_page))
        .route("/sign_in", post(handlers::sign_in_post))
        //sign up
        .route("/sign_up", get(handlers::sign_up_page))
        .route("/sign_up", post(handlers::sign_up_post))
        // nest service
        .nest_service("/static", ServeDir::new("static"))
}