/*          Includes             */
// crate
use crate::AppState;
use crate::message_from_user::SendMessage;
use crate::message_from_user::User;

// std
use std::sync::Arc;

// Project libraries
use shared_lib::database::ChatsInfo;
use shared_lib::database::ChatMessage;

pub async fn send_message(state: &Arc<AppState>, user: &User, message: &SendMessage){
    // 1) add message to chat_messages
    let chat_id = message.id_to;
    let _ = ChatMessage::add(&state.client, &chat_id, &message.clone().to_chat_message(user.user_id)).await;
}