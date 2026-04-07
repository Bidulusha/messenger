/*              Includes                 */
// Crate
use crate::answers::{AuthAnswer, AuthStatus};

// Askama
use askama::Template;

// Axum
use axum::{
    response::{
        Html,
        IntoResponse,
        Response
    },
    http::StatusCode
};

// Serde


/*                Functions              */
// Base html template struct and handler
struct HtmlTemplate<T>(T);

impl<T> IntoResponse for HtmlTemplate<T>
where
    T: Template,
{
    fn into_response(self) -> Response{
        match self.0.render() {
            Ok(html) => Html(html).into_response(),
            Err(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to render template. Error: {err}")
            ).into_response(),
        }
    }
}


/*          Main page            */
#[derive(Template)]
#[template(path = "main_page/index.html")]
struct MainPageTemplate {}

pub async fn main_page() -> impl IntoResponse {
    let template = MainPageTemplate {};
    HtmlTemplate(template)
}


/*          Auth pages           */
/* Sign in */
// get
#[derive(Template)]
#[template(path = "sign_in_page/index.html")]
struct SignInPageTemplate {}

pub async fn sign_in_page() -> impl IntoResponse {
    let template = SignInPageTemplate {};
    HtmlTemplate(template)
}

// post
pub async fn sign_in_post(raw_data: String) -> &'static str {
    let client = reqwest::Client::new();
    // Get answer about user from auth api
    match serde_json::from_str::<AuthAnswer>(&client.post("http://localhost:8081/api/auth/sign_in_auth")
            .body(raw_data)
            .send()
            .await.unwrap().text().await.unwrap()
        ) {
            Ok(data) => {
                println!("{:?}", data)
            }
            Err(err) => {println!("Error to parse json from answer. Error msg = {}", err)}
        }

    "Ok"
}

/* Sign up */
// get
#[derive(Template)]
#[template(path = "sign_up_page/index.html")]
struct SignUpPageTemplate {}

pub async fn sign_up_page() -> impl IntoResponse {
    let template = SignUpPageTemplate {};
    HtmlTemplate(template)
}

//post
pub async fn sign_up_post(raw_data: String) -> impl IntoResponse {
    let client = reqwest::Client::new();
    // Get answer about user from auth api
    match serde_json::from_str::<AuthAnswer>(&client.post("http://localhost:8081/api/auth/sign_up_auth")
            .body(raw_data)
            .send()
            .await.unwrap().text().await.unwrap()
        ) {
            Ok(data) => {
                println!("{:?}", data)
            }
            Err(err) => {println!("Error to parse json from answer. Error msg = {}", err)}
        }

    "Ok"
}



/*          Chat page            */
#[derive(Template)]
#[template(path = "chat_page/index.html")]
struct ChatPageTemplate {}

pub async fn chat_page() -> impl IntoResponse {
    let template = ChatPageTemplate{};
    HtmlTemplate(template)
}