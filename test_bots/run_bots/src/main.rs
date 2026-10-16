mod write_to_csv;

use csv::Writer;
use std::thread::{self, JoinHandle};
use std::error::Error;
use tokio::runtime::Runtime;

use bot::{TestBot, BotConfig};
use sign_up_bot::SignUpBot;
use sign_in_bot::SignInBot;
use additional_functions::{TimePoint, ToStringVector};

use write_to_csv::write_to_file; 


const URL: &str = "http://localhost:3000";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let bot_config = BotConfig {
        max_iter: 1000,
        thread_count: 8,
        start_idx: 1001,
        end_idx: 2000
    };

    let sign_up_bot = SignUpBot::new("http://localhost:8081");
    let sign_in_bot = SignInBot::new("http://localhost:8081");


    let sign_up_bot_data: JoinHandle<Result<Box<Vec<TimePoint>>, ()>> = thread::spawn(move || {
        let rt = Runtime::new().unwrap();
        if let Ok(res) = rt.block_on(sign_up_bot.start_bot(bot_config)) {
            if let Ok(res) = res.downcast::<Vec<TimePoint>>() {
                return Ok(res)
            } else {
                return Err(())
            }
        }
        Err(())
    });

    let sign_in_bot_data = thread::spawn(move || {
        let rt = Runtime::new().unwrap();
        if let Ok(res) = rt.block_on(sign_in_bot.start_bot(bot_config)) {
            if let Ok(res) = res.downcast::<Vec<TimePoint>>() {
                return Ok(res)
            } else {
                return Err(())
            }
        }
        Err(())
    });

    match sign_up_bot_data.join().unwrap() {
        Ok(data) => {
            write_to_file(&data, "sign_up_data_2flow.csv", &["i", "thread", "time"]).unwrap();
        }
        Err(err) => {
            println!("Error in sign up data! Err: {:?}", err);
        }
    }

    match sign_in_bot_data.join().unwrap() {
        Ok(data) => {
            write_to_file(&data, "sign_in_data_2flow.csv", &["i", "thread", "time"]).unwrap();
        }
        Err(err) => {
            println!("Error in sign up data! Err: {:?}", err);
        }
    }
    
    // let bot_config = BotConfig {
    //     max_iter: 1000,
    //     thread_count: 8,
    //     start_idx: 0,
    //     end_idx: 1000
    // };

    // let sign_up_bot = SignUpBot::new("http://localhost:8081");
    // let sign_in_bot = SignInBot::new("http://localhost:8081");

    // let sign_up_bot_data = sign_up_bot.start_bot(bot_config).await;
    // let sign_in_bot_data = sign_in_bot.start_bot(bot_config).await;

    // match sign_up_bot_data {
    //     Ok(data) => {
    //         if let Ok(vec) = data.downcast::<Vec<TimePoint>>() {
    //             write_to_file(&vec, "sign_up_data.csv", &["i", "thread", "time"]).unwrap();
    //         }
    //     }
    //     Err(err) => {
    //         println!("Error in sign up data! Err: {:?}", err);
    //     }
    // }

    // match sign_in_bot_data {
    //     Ok(data) => {
    //         if let Ok(vec) = data.downcast::<Vec<TimePoint>>() {
    //             write_to_file(&vec, "sign_in_data.csv", &["i", "thread", "time"]).unwrap();
    //         }
    //     }
    //     Err(err) => {
    //         println!("Error in sign up data! Err: {:?}", err);
    //     }
    // }

    Ok(())
}
