
#[derive(Debug, Copy, Clone)]
pub struct BotConfig {
    pub max_iter: u32,
    pub thread_count: u8,
    pub start_idx: u32,
    pub end_idx: u32,
}