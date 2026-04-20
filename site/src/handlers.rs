/*              Includes                 */
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
// #[derive(Template)]
// #[template(path = "main_page/index.html")]
// struct MainPageTemplate {}

// pub async fn main_page() -> impl IntoResponse {
//     let _ = axum::response::Redirect::permanent("/chat");
// }


/*          Auth pages           */
/* Sign in */
// get
#[derive(Template)]
#[template(path = "sign_in_page/index.html")]
struct SignInPageTemplate {}

pub async fn sign_in_page() -> impl IntoResponse{
    let template = SignInPageTemplate {};
    HtmlTemplate(template)
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


/*          Chat page            */
#[derive(Template)]
#[template(path = "chat_page/index.html")]
struct ChatPageTemplate {}

pub async fn chat_page() -> impl IntoResponse {
    let template = ChatPageTemplate{};
    HtmlTemplate(template)
}