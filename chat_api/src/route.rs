/*              Include              */
//crate
use crate::handlers;

//axum
use axum::{
    routing::{get},
    Router
};


/*              Functions            */
pub fn create_router() -> Router {
    Router::new()
        .route("/api", get(|| async {"HALO"}))
}