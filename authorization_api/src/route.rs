/*              Include              */
// std
use std::sync::Arc;

// crate
use crate::handlers;
use crate::AppState;

// Axum
use axum::{
    routing::{post},
    Router
};

/*              Functions            */
pub fn create_router(shared_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/auth/sign_in_auth", post(handlers::sign_in_auth))
        .route("/api/auth/sign_up_auth", post(handlers::sign_up_auth))
        .route("/api/auth/check_token", post(handlers::check_token))
        .with_state(shared_state)
}