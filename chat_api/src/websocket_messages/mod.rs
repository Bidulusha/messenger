#[allow(non_camel_case_types)]
pub enum RequestType {
    START_CHAT,
    SEND_MESSAGE
}

impl From<RequestType> for i32 {
    fn from(value: RequestType) -> Self {
        match value {
            RequestType::START_CHAT => {-1}
            RequestType::SEND_MESSAGE => {-2}
        }
    }
}