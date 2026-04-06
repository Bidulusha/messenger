/*              Include              */
// Axum
use axum::{
    routing::{get},
    Router
};

/*              Functions            */
pub fn create_router() -> Router {
    Router::new()
        .route("/api", get(|| async {"hello!"}))
}