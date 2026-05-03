/*              Includes                 */
// std
use std::sync::Arc;

// tokio-postgres
use tokio_postgres::Client;

// Project libraries
use shared_lib::database::UsersInfo;
use shared_lib::database::ActiveSessions;
use shared_lib::database::ChatsUser;

/*              Function                 */
pub async fn delete_account(client: &Arc<Client>, user_id: &i32) {
    ChatsUser::delete(client, user_id).await;
    UsersInfo::delete(client, user_id).await;
    ActiveSessions::delete(client, user_id).await;
}