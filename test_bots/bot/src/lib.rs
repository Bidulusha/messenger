use std::any::Any;
use std::sync::Arc;

use async_trait::async_trait;

#[async_trait]
pub trait TestBot {
    async fn start_bot(self: Arc<Self>, max_iter: i32) -> Result<Box<dyn Any>, Box<dyn std::error::Error>>;// Or return data flow
}