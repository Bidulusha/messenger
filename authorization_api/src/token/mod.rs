/*              Includes                 */
// Std
use std::hash::{DefaultHasher, Hash, Hasher};
use std::sync::Arc;

// Argon2
use argon2::{
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier, password_hash::{Salt, SaltString, rand_core::{Error,  OsRng}}
};

// Tokio postgres
use tokio_postgres::Client;

// Project libraries
use shared_lib::database::{UsersInfo, ActiveSessions};
use shared_lib::structures::session::Session;


/*                  Enums                */
pub enum ValidationStatus {
    OK,
    ERR
}


/*              Functions                */
// Calculate hash
fn calculate_hash<T: Hash>(t: &T) -> u64 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    s.finish()
}


// Create token
pub fn create_hash_key(session: Session) -> String {
    let salt = SaltString::generate(&mut OsRng);

    let argon2 = Argon2::default();
    let hash = argon2.hash_password(calculate_hash(&session).to_string().as_bytes(), &salt).unwrap();

    hash.to_string()
}

pub async fn create_token_and_add_to_db(client: &Arc<Client>, user: &UsersInfo, user_agent: &String) -> String{
    let session = Session {user: user.clone(), user_agent: user_agent.to_string()};
    let token = create_hash_key(session);

    let _ = ActiveSessions::add(&client, &user.id, &token).await;
    
    token
}