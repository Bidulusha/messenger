/*          Includes             */
// crate
use crate::AppState;
use crate::message_from_user::SendMessage;
use crate::message_from_user::User;

// std
use std::sync::Arc;

// Project libraries
use shared_lib::database::ChatsInfo;
use shared_lib::database::ChatsUser;
use shared_lib::database::ChatMessage;
use shared_lib::database::ChatsUserWithInfo;


/*          Function             */
pub async fn start_chat(state: &Arc<AppState>, user: &User, message: &SendMessage) -> i32 {
    let mut chat_id;
    // 1) Add to chats info with null fields
    chat_id = ChatsInfo::add(
    &state.client, 
    &ChatsInfo{ 
        id: -1, 
        avatar: "".into(), 
        chat_name: "".into(), 
        members_id: vec![message.id_to, user.user_id] 
    }).await;
    
    // 2) Add to chats user
    // user who send
    let _ = ChatsUser::add_chat(
        &state.client, 
        &user.user_id, 
        &chat_id,
        Some(&message.id_to)
    ).await;

    if user.user_id != message.id_to {
        // user who receive
        let _ = ChatsUser::add_chat(
            &state.client, 
            &message.id_to, 
            &chat_id,
            Some(&user.user_id)
        ).await;
    }

    // 3) Create chat message
    let _ = ChatMessage::create(&state.client, &chat_id).await;
    
    chat_id
}