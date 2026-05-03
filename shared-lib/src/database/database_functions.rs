/*              Includes                 */
// Crate
use crate::database::{
    ActiveSessions, ChatMessage, ChatsInfo, ChatsUser, ChatsUserWithInfo, UsersInfo
};

// std
use std::{sync::Arc};

use chrono::format;
// colored
use colored::Colorize;

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
                    eprintln!("{}", format!("Can't find max(id) from users_info! Error message: {:?}", err).red());
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
                    println!("{}", "Successfully selected all users from users_info!".green());
                    data.into_iter().map(Into::into).collect()
                }
                Err(err) => {
                    eprintln!("{}", format!("Can't select all from users_info! Error message: {:?}", err).red());
                    vec![]
                }
            }
    }
    /*          get user         */
    pub async fn get_by_login(client: &Arc<Client>, login: &String) -> Result<Vec<UsersInfo>, ()> {
        match client
            .query("select * from users_info where login = $1 or email = $1", &[login])
            .await {
                Ok(data) => {
                    if data.is_empty() {
                        println!("{}", format!("No user found with login/email: {}", login).yellow());
                        return Err(())
                    } else {
                        println!("{}", format!("Found {} user(s) with login/email: {}", data.len(), login).green());
                    }
                    Ok(data.into_iter().map(Into::into).collect())
                }
                Err(err) => {
                    eprintln!("{}", format!("Can't select user by login! Error message: {:?}", err).red());
                    Err(())
                }
            }
    }

    pub async fn get_by_user_id(client: &Arc<Client>, user_id: &i32) -> Result<UsersInfo, ()>{
        match client
            .query("select * from users_info where id = $1", &[user_id])
            .await {
                Ok(data) => {
                    if data.is_empty() {
                        println!("{}", format!("No user found with ID: {}", user_id).yellow());
                        return Err(())
                    } else {
                        println!("{}", format!("Found user with ID: {}", user_id).green());
                    }
                    Ok(data[0].clone().into())
                }
                Err(err) => {
                    eprintln!("{}", format!("Can't select user by ID! Error message: {:?}", err).red());
                    Err(())
                }
            }
        }

    /*          Add new user     */
    pub async fn add(client: &Arc<Client>, data: &UsersInfo) -> i32 {
        match client.query("insert into users_info(email, login, password, avatar) \
                values($1, $2, $3, $4) \
                returning id",
                &[&data.email, &data.login, &data.password, &data.avatar]
            ).await {
                Ok(data) => {
                    println!("{}", "Add new user!".green());
                    data[0].get("id")
                }
                Err(err) => {
                    println!("{}", format!("Cannot add new user! Error: {:?}", err).red());
                    -1
                }
            }
    }

    /*          Delete user      */
    pub async fn delete(client: &Arc<Client>, user_id: &i32) {
        match client.query("\
            DELETE FROM users_info \
            WHERE id = $1\
            ", &[user_id]
        ).await {
            Ok(_) => {println!("{}", format!("User {} deleted successfully!", user_id).green())}
            Err(err) => {println!("{}", format!("Cannot delete user! Error: {:?}", err).red())}
        } 
    }
}


/*          active_sessions      */
impl ActiveSessions {
    pub async fn create(client: &Arc<Client>, user_id: &i32) -> Result<(), Error>{
        match client.query(&format!("\
            create table if not exists public.active_sessions_user_{user_id} (\
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1),\
                token text NOT NULL\
            );"), &[]).await {
                Ok(_) => {println!("{}", format!("Create new active_sessions table for user_id: {}", user_id).green())}
                Err(err) => {println!("{}", format!("Cannot create new active_session_table! Error: {:?}", err).red())}
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
                        if data[i].get::<&str, &str>("token") == token { 
                            println!("{}", "Token verified successfully!".green());
                            return true; 
                        }
                    }
                    println!("{}", "Token not found!".yellow());
                    return false;
                }
                Err(err) => {
                    eprintln!("{}", format!("Can't find token! Error message: {:?}", err).red());
                    false
                }
            }
    }

    pub async fn add(client: &Arc<Client>, user_id: &i32, token: &String) -> Result<(), Error> {
        match client.query(&format!("\
            insert into active_sessions_user_{user_id} (token) \
                values($1)"), &[&token]).await {
                Ok(_) => {println!("{}", "Add new token!".green())}
                Err(err) => {println!("{}", format!("Cannot add new token! Error: {:?}", err).red())}
            }
            Ok(())
    }
    
    pub async fn remove_token(client: &Arc<Client>, user_id: &i32, token: &String) -> Result<(), Error> {
        match client.execute(&format!("\
            delete from active_sessions_user_{user_id} where token = $1"), 
            &[&token]).await {
                Ok(rows_affected) => {
                    if rows_affected > 0 {
                        println!("{}", "Token removed successfully!".green());
                    } else {
                        println!("{}", "Token not found for removal!".yellow());
                    }
                }
                Err(err) => {println!("{}", format!("Cannot remove token! Error: {:?}", err).red())}
            }
            Ok(())
    }

    pub async fn delete(client: &Arc<Client>, user_id: &i32) {
        match client.query(&format!("\
            DROP TABLE active_sessions_user_{}", user_id), &[]
        ).await {
            Ok(_) => {println!("{}", format!("Succesful deleted table active session for user {}", user_id).green())}
            Err(err) => {
                println!("{}", format!("Cannot delete table active session for user {}! Error: {:?}", user_id, err).red())
            }
        }
    }
}

impl ChatsUser {
    pub async fn create(client: &Arc<Client>, user_id: &i32) {
        match client.query(&format!("\
            create table if not exists public.chats_user_{user_id} (\
                id integer NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1),\
                chat_id integer NOT NULL references chats_info(id),\
                with_user integer, \
                last_change time not null \
            );"), &[]).await {
                Ok(_) => {println!("{}", format!("Create chats_user_{} table!", user_id).green())}
                Err(err) => {println!("{}", format!("Cannot create chats_user_{} table! Error: {:?}", user_id, err).red())}
            }
    }

    pub async fn select_all(client: &Arc<Client>, user_id: &i32) -> Vec<ChatsUser> {
        match client.query(
            &format!("select * from public.chats_user_{}", user_id),
            &[]).await {
                Ok(data) => {
                    println!("{}", format!("Selected {} chats for user {}", data.len(), user_id).green());
                    data.into_iter().map(Into::into).collect()
                }
                Err(err) => {
                    eprintln!("{}", format!("Cannot select * from public.chats_user_{}! Error: {:?}", user_id, err).red());
                    vec![]
                }
            }
    }

    pub async fn select_all_join_chat_info(client: &Arc<Client>, user_id: &i32) -> Vec<ChatsUserWithInfo> {
        match client.query(
            &format!("\
           SELECT 
            cu.chat_id, \
            CASE \
                WHEN cu.with_user IS NULL THEN ci.chat_name \
                ELSE \
                    CASE WHEN ui.login IS NULL THEN 'deleted' \
                    ELSE ui.login \
                END \
            END AS chat_name, \
            CASE \
                WHEN cu.with_user IS NULL THEN ci.avatar \
                ELSE \
                    CASE WHEN ui.avatar IS NULL THEN 'deleted.png' \
                    ELSE ui.avatar \
                END \
            END AS chat_avatar, \
            cu.with_user, \
            COALESCE(ci.members_id, ARRAY[]::integer[]) AS members_id, \
            cu.last_change \
            FROM chats_user_{} cu \
            LEFT JOIN chats_info ci ON cu.chat_id = ci.id \
            LEFT JOIN users_info ui ON cu.with_user = ui.id \
            ORDER BY cu.last_change DESC\
        ", user_id), &[]
        ).await {
            Ok(data) => {
                println!("{}", format!("Successfully joined chat info for user {}", user_id).green());
                data.into_iter().map(Into::into).collect()
            }
            Err(err) => {
                eprintln!("{}", format!("Cannot select all group chats with chat info! Error: {:?}", err).red());
                vec![]
            }
        }
    }

    pub async fn select_chat_join_chat_info(client: &Arc<Client>, user_id: &i32, chat_id: &i32) -> Result<ChatsUserWithInfo, ()> {
        match client.query(
            &format!("\
            SELECT \
                cu.chat_id, \
                CASE \
                    WHEN cu.with_user IS NULL THEN ci.chat_name \
                    ELSE ui.login \
                END AS chat_name, \
                CASE \
                    WHEN cu.with_user IS NULL THEN ci.avatar \
                    ELSE ui.avatar \
                END AS chat_avatar, \
                cu.with_user, \
                COALESCE(ci.members_id, ARRAY[]::integer[]) AS members_id \
            FROM chats_user_{} cu \
            LEFT JOIN chats_info ci ON cu.chat_id = ci.id \
            LEFT JOIN users_info ui ON cu.with_user = ui.id \
            WHERE cu.chat_id = $1 \
        ", user_id), &[chat_id]
        ).await {
            Ok(data) => {
                println!("{}", format!("Successfully joined chat info for user {}", user_id).green());
                if data.len() > 0 {
                    return Ok(data[0].clone().into())
                }
                Err(())
            }
            Err(err) => {
                eprintln!("{}", format!("Cannot select chat group with user info! Error: {:?}", err).red());
                Err(())
            }
        }
    }

    pub async fn find_chat(client: &Arc<Client>, user_id: &i32, id: &i32) -> bool{
        match client.query(&format!("\
        select id from public.chats_user_{} \
        where chat_id = $1 or with_user = $1", user_id), &[id]
    ).await {
        Ok(data) => {
            data.len() > 0 
        }
        Err(err) => {
            eprintln!("{}", format!("Cannot find chat! Error: {:?}", err).red());
            false
        }
    }

    }
    
    pub async fn add_chat(client: &Arc<Client>, user_id: &i32, chat_id: &i32, with_user: Option<&i32>) -> Result<(), ()> {
        match client.execute(&format!("\
            insert into public.chats_user_{} (chat_id, with_user, last_change) values ($1, $2, $3)", 
            user_id), &[&chat_id, &with_user, &chrono::Utc::now().time()]).await {
                Ok(_) => {
                    println!("{}", format!("Added chat {} for user {}", chat_id, user_id).green()); 
                    return Ok(())
                }
                Err(err) => {
                    println!("{}", format!("Cannot add chat for user! Error: {:?}", err).red()); 
                    return Err(())
                }
            }
    }

    pub async fn update_last_change(client: &Arc<Client>, user_id: &i32, chat_id: &i32) -> Result<(), ()>  {
        match client.execute(&format!("\
            UPDATE public.chats_user_{} \
            SET last_change = $1 \
            WHERE id = $2", 
            user_id), &[&chrono::Utc::now().time(), chat_id]).await {
                Ok(_) => {
                    println!("{}", format!("Added chat {} for user {}", chat_id, user_id).green());
                    return Ok(())
                }
                Err(err) => {
                    println!("{}", format!("Cannot add chat for user! Error: {:?}", err).red());
                    return Err(())
                }
            }
    }

    pub async fn delete(client: &Arc<Client>, user_id: &i32) {
        match client.query(
            &format!("drop table chats_user_{}", user_id), 
            &[]
        ).await {
            Ok(_) => {println!("{}", format!("Chats user {} table successfully deleted!", user_id).green())}
            Err(err) => {
                println!("{}", format!("Cannot delete chats_user_{} table! Error: {:?}", user_id, err).red())
            }
        }
    }
}

impl ChatsInfo {
    pub async fn get(client: &Arc<Client>, chat_id: &i32) -> Vec<ChatsInfo> {
        match client.query("\
            select * from chats_info \
            where id = $1", 
        &[chat_id]).await {
            Ok(data) => {
                data.into_iter().map(Into::into).collect()
            }
            Err(err) => {
                println!("{}", format!("Error get from chat info! Error {:?}", err).red());
                vec![]
            }
        }
    }

    pub async fn add(client: &Arc<Client>, chat_info: &ChatsInfo) -> i32{
        match client.query("\
            insert into chats_info(avatar, chat_name, members_id) \
            values($1, $2, $3) \
            returning id; \
        ", &[&chat_info.avatar, &chat_info.chat_name, &chat_info.members_id])
        .await {
            Ok(data) => {
                println!("{}", "Succesful add chat to chat info".green());
                data[0].get("id")
                }
            Err(err) => {
                println!("{}", format!("Error add chat to chat info! Error {:?}", err).red()); 
                return -1;
            }
        }
    }
}

impl ChatMessage {
    pub async fn select_all(client: &Arc<Client>, chat_id: &i32) -> Vec<ChatMessage> {
        match client.query(&format!("\
        select * from chat_message_{}\
        ", chat_id), &[]).await {
            Ok(data) => {
                println!("{}", "Succesful select * from chat_message".green());
                data.into_iter().map(Into::into).collect()
            }
            Err(err) => {
                println!("{}", format!("Error select * from chat_message table! Error {:?}", err).red());
                vec![]
            }
        }
    }

    pub async fn create(client: &Arc<Client>, chat_id: &i32) {
        match client.query(&format!("\
            create table if not exists public.chat_message_{}( \
            id integer NOT NULL GENERATED ALWAYS AS IDENTITY (INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1),\
            who_sended integer NOT NULL,\
            send_time time NOT NULL, \
            content MessageContent NOT NULL\
        );", chat_id), &[]).await {
            Ok(_) => {println!("{}", "Succesful create chat_message".green()) }
            Err(err) => {println!("{}", format!("Error create chat_message table! Error {:?}", err).red()) }
        }
    }
    
    pub async fn add(client: &Arc<Client>, chat_id: &i32, message: &ChatMessage){
        match client.query(&format!("\
            insert into public.chat_message_{}(who_sended, send_time, content) \
            values($1, $2, $3) ", chat_id
        ), &[&message.who_sended, &message.send_time, &message.content]
        ).await {
            Ok(data) => { println!("{}", "Succesful add message to chat_message!".green()) }
            Err(err) => { println!("{}", format!("Error adding message to chat_message table! Error {:?}", err).red()) }
        }
    }

}