/*              Include              */
// std
use std::sync::Arc;

// crate
use crate::handlers;
use crate::AppState;

// Axum
use axum::{
    routing::{any},
    Router
};

/*              Functions            */
pub fn create_router(shared_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/chat_ws", any(handlers::admin_page_ws_handler))
        .with_state(shared_state)
}