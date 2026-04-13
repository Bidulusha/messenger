/*              Includes                 */
// Crate
use crate::database::{
    ActiveSessions, Chat, ChatsInfo, ChatsUser, UsersInfo
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
            .query("select * from users_info where login = $1 or email = $1", &[login])
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

    pub async fn get_by_user_id(client: &Arc<Client>, user_id: &i32) -> Vec<UsersInfo>{
        match client
            .query("select * from users_info where id = $1", &[user_id])
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
        match client.query("insert into users_info(email, login, password) \
                values($1, $2, $3)",
                &[&data.email, &data.login, &data.password]
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

    pub async fn check_token(client: &Arc<Client>, user_id: &i32, token: &String) -> bool {
        match client
            .query(&format!(
                "select * from active_sessions_user_{user_id}"), 
                &[])
            .await {
                Ok(data) => {
                    for i in 0..data.len() {
                        if data[i].get::<&str, &str>("token") == token { return true; }
                    }
                    return false;
                }
                Err(err) => {
                    eprintln!("Can't find token! Error message: {:?}", err);
                    false
                }
            }
    }

    pub async fn add(client: &Arc<Client>, user_id: &i32, token: &String) -> Result<(), Error> {
        match client.query(&format!("\
            insert into active_sessions_user_{user_id} (token) \
                values($1)"), &[&token]).await {
                Ok(_) => {println!("Add new token!")}
                Err(err) => {println!("Cannot add new token! Error: {:?}", err)}
            }
            Ok(())
    }
}

impl ChatsUser {
    pub async fn create(client: &Arc<Client>, user_id: &i32) {
        match client.query(&format!("\
            create table if not exists public.chats_user_{user_id} (\
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1),\
                chat_id integer NOT NULL references chats_info(id)\
            );"), &[]).await {
                Ok(_) => {println!("Create chats_user_{user_id} table!")}
                Err(err) => {println!("Cannot create chats_user_{user_id} table! Error: {:?}", err)}
            }
    }

    pub async fn select_all(client: &Arc<Client>, user_id: &i32) -> Vec<ChatsUser> {
        match client.query(
            &format!("select * from public.chats_user_{user_id}"),
            &[]).await {
                Ok(data) => {
                    data.into_iter().map(Into::into).collect()
                }
                Err(err) => {
                    eprint!("Cannot select * from public.chats_user_{user_id}! Error: {:?}", err);
                    vec![]
                }
            }
    }
}

impl ChatsInfo {
    pub async fn get_chats(client: &Arc<Client>, chats: &Vec<ChatsUser>) -> Vec<ChatsInfo>{
        let mut req = String::from("");
        let _ = chats.into_iter().map(|chat| {req.push_str(&chat.chat_id.to_string());req.push(',');});
        req.pop();
        match client.query(&format!("\
        select * from public.chats_info\
        where id in ({req})"), &[] 
        ).await {
            Ok(data) => {
                data.into_iter().map(Into::into).collect()
            }
            Err(err) => {
                eprintln!("Cannot select * from chats_info! Error = {:?}", err);
                vec![]
            }
        }
    }
}