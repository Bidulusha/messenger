pub trait ToStringVector {
    fn to_string_vector(&self) -> Vec<String>;
}


#[derive(Debug)]
pub struct TimePoint {
    pub iter: u32,
    pub thread: u32,
    pub time: f64
}

impl ToStringVector for TimePoint {
    fn to_string_vector(&self) -> Vec<String> {
        vec![
            self.iter.to_string(),
            self.thread.to_string(),
            self.time.to_string()
        ]
    }
}