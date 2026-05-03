/*          Includes             */
// crate
use crate::AppState;
use crate::chat_functions::start_chat::start_chat;
use crate::message_from_user::{SendMessage, UserMessage};
use crate::message_from_user::User;
use crate::websocket_messages::RequestType;

// std
use std::sync::Arc;

use axum::extract::ws::Message;
// Project libraries
use shared_lib::database::ChatsInfo;
use shared_lib::database::ChatMessage;
use shared_lib::database::ChatsUser;
use shared_lib::database::ChatsUserWithInfo;
use tokio::sync::mpsc::UnboundedSender;

pub async fn send_message(state: &Arc<AppState>, user: &mut User, message: &SendMessage, tx: &UnboundedSender<Message>, req_id: i32){
    let mut chat_id = message.id_to;
    let mut chat_info: Option<ChatsUserWithInfo> = None;
    let chat_exists = ChatsUser::find_chat(&state.client, &user.user_id, &chat_id).await;
    // 1) If chat not exists create it
    // if first_message is true
    if (!chat_exists) {
        chat_id = start_chat(&state, &user, &message).await;
        if let Ok(chat_info_get) = ChatsUser::select_chat_join_chat_info(
                &state.client, &message.id_to, &chat_id).await {
                    chat_info = Some(chat_info_get);
                };
    }
    // 2) Put message to db
    ChatMessage::add(&state.client, &chat_id, &message.clone().to_chat_message(user.user_id)).await; 

    // 3) Check active chats of user
    if user.clone().active_chat.is_none() {
        user.active_chat = Some(ChatsInfo::get(&state.client, &chat_id).await[0].clone());
    }
    

    // 4) Send answer
    if chat_info.is_some() {
        // New chat message to user
        if let Ok(chat_info_for) = ChatsUser::select_chat_join_chat_info(
                &state.client, &user.user_id, &chat_id).await {
                    tx.send(Message::text(
                        UserMessage::create_chat(RequestType::START_CHAT.into(), &chat_info_for))
                    ).unwrap();
                };
        // Send chat id
        tx.send(Message::text(UserMessage::send_text(req_id, chat_id.to_string()))).unwrap();
    } else {
        tx.send(Message::text(UserMessage::sm_result_ok(req_id))).unwrap();
    }

    // 5) Send message to chat members
    for member in user.clone().active_chat.unwrap().members_id {
        // 6) set last change
        let _ = ChatsUser::update_last_change(&state.client, &member, &chat_id).await;
        if (member != user.user_id){
            if let Some(recipient_tx) = state.connections.lock().await.get(&member) {
                // Start chat
                if let Some(ref chat) = chat_info {
                    let _ = recipient_tx.send(
                        Message::text(
                            UserMessage::create_chat(RequestType::START_CHAT.into(), chat)
                        )
                    );
                }
                    
                // Send message
                let _ = recipient_tx.send(
                    Message::text(
                        UserMessage::send_message(
                            RequestType::SEND_MESSAGE.into(),
                            &message.clone().to_chat_message_with_chat_id(user.user_id, chat_id)
                        )
                    )
                );
            }
        }    
    }
}