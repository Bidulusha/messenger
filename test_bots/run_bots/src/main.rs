use std::error::Error;

use csv::Writer;

use bot::TestBot;
use sign_up_bot::SignUpBot;
use sign_in_bot::SignInBot;
use additional_functions::TimePoint;

const URL: &str = "http://localhost:3000";

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let sign_up_bot = SignUpBot::new("http://localhost:8081");
    let sign_in_bot = SignInBot::new("http://localhost:8081");
    // let exit_data = sign_up_bot.start_bot(10000).await;
    let exit_data = sign_in_bot.start_bot(10).await;
    let mut wrt = Writer::from_path("sign_up_data.csv")?;
    
    wrt.write_record(&["i", "thread" ,"time"])?;

    match exit_data {
        Ok(data) => {
            if let Ok(vec) = data.downcast::<Vec<TimePoint>>() {
                println!("{:?}", vec);
                for time_point in vec.iter() {
                    wrt.write_record(&[
                        time_point.iter.to_string(), 
                        time_point.thread.to_string(),
                        time_point.time.to_string()
                    ])?;
                }
            } else {
                println!("We lost all data, idk why..");
                panic!()
            }

        }
        Err(err_data) => {
            if let Ok(err) = err_data.downcast::<sign_up_bot::BotError>() {
                println!("Error message: {}", err.message);
                for time_point in err.time_vec.iter() {
                    wrt.write_record(&[
                        time_point.iter.to_string(), 
                        time_point.time.to_string()
                    ])?;
                }
            } else {
                println!("We lost all data, idk why..");
                panic!()
            }
        }
    }

    // wrt.write_record(&["0", "0.27"])?;
    // wrt.flush()?;

    Ok(())
}
