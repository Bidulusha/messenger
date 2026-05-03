/*              INCLUDES                 */
// crate
use crate::AppState;
use crate::websocket_messages::RequestType;

// std
use std::sync::Arc;

// axum
use axum::extract::ws::Message;
use shared_lib::database::ChatsUserWithInfo;

// Project files
use crate::message_from_user::UserMessage;

// Project libraries
use shared_lib::database::ChatsInfo;
use shared_lib::database::ChatsUser;
use shared_lib::database::ChatMessage;

/*              FUNCTION                 */
pub async fn create_chat(
    state: &Arc<AppState>, 
    chat_avatar: &String, 
    chat_name: &String, 
    members: &Vec<i32>
) -> Result<i32, ()> {
    // 1) Create chat in chat info
    let chat_id = ChatsInfo::add(
        &state.client, 
        &ChatsInfo{ 
            id: -1, 
            avatar: chat_avatar.to_string(), 
            chat_name: chat_name.to_string(), 
            members_id: members.clone()
        }
    ).await;
    if chat_id == -1 { return Err(()); }


    // 2) Add to chats user
    // user who send
    for member in members {
        if ChatsUser::add_chat(
            &state.client,
            &member,
            &chat_id,
            None
        ).await.is_err() {
            return Err(())
        };
    }

    // 3) Create chat message
    let _ = ChatMessage::create(&state.client, &chat_id).await;

    for member in members {
        if let Some(recipient_tx) 
            = state.connections.lock().await.get(&member) {
                let _ = recipient_tx.send(
                    Message::text( UserMessage::create_chat( 
                        RequestType::START_CHAT.into(), 
                        &ChatsUserWithInfo {
                            chat_id: chat_id,
                            chat_avatar: chat_avatar.to_string(),
                            chat_name: chat_name.to_string(), 
                            with_user: None,
                            members_id: members.to_vec()
                        }.into()
                    ))
                );
        }
    }

    Ok(chat_id)
}