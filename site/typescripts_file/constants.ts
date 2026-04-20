// SERVER SETTINGS
const PROTOCOL = "http://";
// const DOMEN = "localhost";
const DOMEN = "91.122.215.194";

// BASE OF URL
export const BASE_URL = PROTOCOL + DOMEN;
export const WS_URL = "ws://" + DOMEN;

// STATIC
export const STATIC_URL = "/static"

// AVATART IMAGES
export const AVATARS_URL = STATIC_URL + "/images/avatars/"

// Pages 
export const AUTH_API_URL = BASE_URL + ":8081";
export const CHAT_URL = BASE_URL + ":3000/chat";
export const SIGN_IN_URL = BASE_URL + ":3000/sign_in";
export const CHAT_WS_URL = WS_URL + ":8080/api/chat_ws";