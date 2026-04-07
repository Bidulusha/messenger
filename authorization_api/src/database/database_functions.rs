/*              Includes                 */
// Crate
use crate::model::{
    UsersInfo
};

// std
use std::sync::Arc;

// tokio postgress
use tokio_postgres::{Client, Error};

/*              Functions                */
impl UsersInfo {
    /*          Select           */
    pub async fn select_all(client: &Arc<Client>) -> Vec<UsersInfo>{
        match client
            .query("select * from users_info", &[])
            .await {
                Ok(data) => {
                    println!("{}, {}, {}, {}, {}", data[0].get(0), data[0].get(1), data[0].get(2), data[0].get(3), data[0].get(4));
                    data.into_iter().map(Into::into).collect()
                }
                Err(err) => {
                    eprintln!("Can't select all from users_info! Error message: {:?}", err);
                    vec![]
                }
            }
    }
    /*          get user         */
    pub async fn get_by_login(client: &Arc<Client>, login: &String) -> Vec<UsersInfo> {
        match client
            .query("select * from users_info where login = $1", &[login])
            .await {
                Ok(data) => {
                    if (data.len() == 0) {
                        return vec![];
                    }
                    data.into_iter().map(Into::into).collect()
                }
                Err(err) => {
                    eprintln!("Can't select all from users_info! Error message: {:?}", err);
                    vec![]
                }
            }
    }

    /*          Add new user     */
    pub async fn add(client: &Arc<Client>, data: UsersInfo) -> Result<(), Error> {
        match client.query("insert into users_info(login, password, active_sessions, chats) \
                values($1, $2, $3, $4)",
                &[&data.login, &data.password, &data.active_sessions, &data.chats]
            ).await {
                Ok(_) => {println!("Add new user!")}
                Err(err) => {println!("Cannot add new user! Error: {:?}", err)}
            }
        Ok(())
    }
}