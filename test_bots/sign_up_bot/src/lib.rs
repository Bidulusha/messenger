mod errors;

use std::sync::Arc;
use chrono::prelude::*;
use async_trait::async_trait;

use bot::TestBot;
use form_structures::SignUpForm;
use additional_functions::TimePoint;

pub use errors::*;

pub struct SignUpBot {
    client: reqwest::Client,
    url: String
}

impl SignUpBot {
    pub fn new(url: &str) -> Arc<SignUpBot> {
        Arc::new(SignUpBot {
            client: reqwest::Client::new(),
            url: url.to_owned()
        })
    }
}

#[async_trait]
impl TestBot for SignUpBot {
    async fn start_bot(self: Arc<Self>, max_iter: i32) -> Result<Box<dyn std::any::Any>, Box<dyn std::error::Error>> {
        let mut time_vec: Vec<TimePoint>  = vec![];

        for i in 0..max_iter {
            let start = Utc::now();
            match self.client.post(&format!("{}/api/auth/sign_up_auth",self.url))
                .header(reqwest::header::USER_AGENT, "sign_up_bot/1.0")
                .json(
                    &SignUpForm {
                        email: String::from(format!("Email{i}")),
                        login: String::from(format!("Log{i}")),
                        password: String::from(format!("1234")),
                    }
                )
                .send()
                .await {
                    Ok(data) => {
                        match data.text().await {
                            Ok(body) => {
                                let end = Utc::now();
        
                                let iter_time = (end-start).num_nanoseconds().unwrap() as f64 / 1e9;
                                println!("Time: {:?}", iter_time);
                                println!("cur i: {i} Body is: {}", body);
                                time_vec.push(TimePoint { iter: i, thread: std::process::id(), time: iter_time });
                            }
                            Err(err) => {
                                println!("{err}! Exiting...");
                                return Err(Box::new(BotError::new(&err.to_string(), Box::new(time_vec))));
                            }
                        } 
                    }
                    Err(err) => {
                        println!("{err}! Exiting...");
                        return Err(Box::new(BotError::new(&err.to_string(), Box::new(time_vec))));
                    }
                }
        }

        Ok(Box::new(time_vec))
    }
}