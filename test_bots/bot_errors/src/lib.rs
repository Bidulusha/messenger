use additional_functions::TimePoint;

#[derive(Debug)]
pub struct BotError {
    pub message: String,
    pub time_vec: Box<Vec<TimePoint>>
}

impl BotError {
    pub fn new(message: &str, vec: Box<Vec<TimePoint>>) -> Self {
        BotError {
            message: message.to_owned(),
            time_vec: vec
        }
    }
}

impl std::fmt::Display for BotError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}
impl std::error::Error for BotError {}