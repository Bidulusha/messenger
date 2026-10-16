use std::sync::Arc;
use chrono::prelude::*;
use tokio::runtime::Runtime;
use async_trait::async_trait;
use std::thread::{self, Thread};
use futures::executor::block_on;

use bot::TestBot;
use form_structures::SignInForm;
use additional_functions::TimePoint;
use bot_errors::BotError;


pub struct SignInBot {
    client: reqwest::Client,
    url: String
}

impl SignInBot {
    pub fn new(url: &str) -> Arc<SignInBot> {
        Arc::new(SignInBot {
            client: reqwest::Client::new(),
            url: url.to_owned()
        })
    }

    async fn test(&self, max_iter: i32, mut time_vec: Vec<TimePoint>) -> Result<Vec<TimePoint>, Box<BotError>> { 
        for i in 0..max_iter {
            let start = Utc::now();
            match self.client.post(&format!("{}/api/auth/sign_in_auth",self.url))
                .header(reqwest::header::USER_AGENT, "sign_up_bot/1.0")
                .json(
                    &SignInForm {
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
                                println!("{}", thread_id::get());
                                time_vec.push(TimePoint { iter: i, thread: thread_id::get() as u32, time: iter_time });
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

            Ok(time_vec)
    }
}

#[async_trait]
impl TestBot for SignInBot {
    async fn start_bot(self: Arc<Self>, max_iter: i32) -> Result<Box<dyn std::any::Any>, Box<dyn std::error::Error>> {
        let mut time_vec: Vec<TimePoint>  = vec![];
        let mut thread_vec = vec![];
        
        for _ in 0..8 {
            let bot = Arc::clone(&self);
            thread_vec.push(thread::spawn(move || {
                    let mut time_vec: Vec<TimePoint>  = vec![];
                    let rt = Runtime::new().expect("Can't spawn tokio runtime");
                    rt.block_on(bot.test(max_iter, time_vec))
                    }
                )
            );
        }

        let mut i: usize = 0;

        for handler in thread_vec {
            match handler.join().unwrap() {
                Ok(vec) => {
                    time_vec.extend(vec);
                }
                Err(err) => {
                    println!("{:?}", err);
                }
            };
        }

        Ok(Box::new(time_vec))
    }
}