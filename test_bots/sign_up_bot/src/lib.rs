mod errors;

use std::thread;
use std::sync::Arc;
use colored::Colorize;
use chrono::prelude::*;
use async_trait::async_trait;
use tokio::runtime::Runtime;

use bot::{TestBot, BotConfig};
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

    async fn test(&self, config: BotConfig, cur_th: u8) -> Vec<TimePoint> {
        let mut time_vec: Vec<TimePoint> = vec![];
        for i in config.start_idx..config.end_idx {
            let start = Utc::now();
            match self.client.post(&format!("{}/api/auth/sign_up_auth",self.url))
                .header(reqwest::header::USER_AGENT, "sign_up_bot/1.0")
                .json(
                    &SignUpForm {
                        email: String::from(format!("Email{cur_th}{i}",)),
                        login: String::from(format!("Log{cur_th}{i}")),
                        password: String::from("1234"),
                    }
                )
                .send()
                .await {
                    Ok(data) => {
                        match data.text().await {
                            Ok(body) => {
                                let end = Utc::now();
        
                                let iter_time = (end-start).num_nanoseconds().unwrap() as f64 / 1e9;
                                println!("{}", format!("Time: {:?}", iter_time).green());
                                println!("{}", format!("cur i: {i} Body is: {}", body).green());
                                println!("{}", format!("{}", thread_id::get()).green());
                                time_vec.push(TimePoint { iter: i, thread: thread_id::get() as u32, time: iter_time });
                            }
                            Err(err) => {
                                println!("{}", format!("{err}!").red());
                            }
                        } 
                    }
                    Err(err) => {
                        println!("{}", format!("{err}!").red());
                    }
                }
        }
        
        time_vec
    }
}

#[async_trait]
impl TestBot for SignUpBot {
    async fn start_bot(self: Arc<Self>, config: BotConfig) -> Result<Box<dyn std::any::Any>, Box<dyn std::error::Error>> {
        let mut time_vec: Vec<TimePoint>  = vec![];
        let mut thread_vec = vec![];
        
        for th in 0..config.thread_count {
            let bot = Arc::clone(&self);
            thread_vec.push(thread::spawn(move || {
                    let rt = Runtime::new().expect("Can't spawn tokio runtime");
                    rt.block_on(bot.test(config, th as u8))
                    }
                )
            );
        }

        for handler in thread_vec {
            match handler.join(){
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