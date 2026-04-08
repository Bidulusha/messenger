/*              Includes                 */
// Crate
use crate::model::{
    UsersInfo,
    ActiveSessions
};

// std
use std::{sync::Arc};

// tokio postgress
use tokio_postgres::{Client, Error};

/*              Functions                */
pub async fn select_max_user_id(client: &Arc<Client>) -> i32{
    match client
            .query("select max(id) from users_info", &[])
            .await {
                Ok(data) => {
                    match data[0].get("max"){
                        Some(id) => {return id}
                        None => {return 0}
                    };
                }
                Err(err) => {
                    eprintln!("Can't find max(id) from users_info! Error message: {:?}", err);
                    -1
                }
            }
}


/*          users_info           */
impl UsersInfo {
    /*          Select           */
    pub async fn select_all(client: &Arc<Client>) -> Vec<UsersInfo>{
        match client
            .query("select * from users_info", &[])
            .await {
                Ok(data) => {
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
                    data.into_iter().map(Into::into).collect()
                }
                Err(err) => {
                    eprintln!("Can't select all from users_info! Error message: {:?}", err);
                    vec![]
                }
            }
    }

    /*          Add new user     */
    pub async fn add(client: &Arc<Client>, data: &UsersInfo) -> Result<(), Error> {
        match client.query("insert into users_info(email, login, password, chats) \
                values($1, $2, $3, $4)",
                &[&data.email, &data.login, &data.password, &data.chats]
            ).await {
                Ok(_) => {println!("Add new user!")}
                Err(err) => {println!("Cannot add new user! Error: {:?}", err)}
            }
        Ok(())
    }
}


/*          acvive_sessions      */
impl ActiveSessions {
    pub async fn create(client: &Arc<Client>, user_id: &i32) -> Result<(), Error>{
        match client.query(&format!("\
            create table if not exists public.active_sessions_user_{user_id} (\
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1),\
                token text NOT NULL\
            );"), &[]).await {
                Ok(_) => {println!("Create new active_sessions table!")}
                Err(err) => {println!("Cannot create new active_session_table! Error: {:?}", err)}
            }
            Ok(())
    }

    pub async fn add(client: &Arc<Client>, user_id: &i32, token: &String) -> Result<(), Error> {
        println!("{}", format!("\
            insert into active_sessions_user_{user_id} (token) \
                values($1)"));
        match client.query(&format!("\
            insert into active_sessions_user_{user_id} (token) \
                values($1)"), &[&token]).await {
                Ok(_) => {println!("Add new token!")}
                Err(err) => {println!("Cannot add new token! Error: {:?}", err)}
            }
            Ok(())
    }
}