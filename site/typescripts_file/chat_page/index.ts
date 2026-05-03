import { SIGN_IN_URL } from "../constants";
import { SidebarUI } from "./ui_objects/sidebar";
import { WebsocketManager } from "./websocket_connection";
import { ChatsUserWithInfo } from "./objects/chats_user_with_info";
import { PopUpNewChatUI } from "./ui_objects/pop_up/start_new_chat";
import { ChatUI } from "./ui_objects/chat";
import { ChatMessages} from "./objects/chat_message";
import { PopUpUserSettings } from "./ui_objects/pop_up/user_settings";
import { PopUpStartNewGroupChat } from "./ui_objects/pop_up/new_group_chat";

const user_id: number = parseInt(localStorage.getItem("user_id")!);
const token: string | null = localStorage.getItem("access_token");
const ws_manager = new WebsocketManager();

const chat: ChatUI = new ChatUI(ws_manager, user_id);
const sidebar: SidebarUI = new SidebarUI(ws_manager, chat);

const pop_up_new_chat: PopUpNewChatUI = new PopUpNewChatUI(ws_manager, chat);
const pop_up_user_settings: PopUpUserSettings = new PopUpUserSettings(user_id, ws_manager);
const pop_up_new_group_chat: PopUpStartNewGroupChat = new PopUpStartNewGroupChat(ws_manager, chat, user_id);


let initialized: boolean = false;


/*      GET MESSAGE AND GET NEW CHAT          */
// get new chats
async function getNewChats() {
    for (;;) {
        const req = await ws_manager.getNewChats();
        if (req != null) {
            const new_chat_info: ChatsUserWithInfo = Object.assign(new ChatsUserWithInfo(), JSON.parse(req.content));
            sidebar.addChat(new_chat_info);
            sidebar.updateInChat(new_chat_info.chat_id);
            chat.addNewChatInfo(new_chat_info);
        }
    }
}

// get message
async function getMessages() {
    for(;;) {
        const req = await ws_manager.getMessage();
        if (req != null) {
            const message: ChatMessages = Object.assign(new ChatMessages(), JSON.parse(req.content));
            chat.add_message(message, true);
            sidebar.getMessageInChat(message.id);
        }
    }
}

/*      ADD EVENT LISTENERS FOR SIDEBAR       */
function addEventListeners() {
    
    const user_info_settings_button = document.querySelector("#sidebar__user-info");
    user_info_settings_button?.addEventListener("click", (event) => {
        pop_up_user_settings.show();
    });

    // Add listener to create new chat button
    const create_new_chat_button = document.querySelector("#sidebar__create-chat");
    create_new_chat_button?.addEventListener("click", (event) => {
        pop_up_new_chat.show();
    });

    // Add listener to create new group chat
    const create_new_group_chat_button = document.querySelector("#sidebar__create-group-chat");
    create_new_group_chat_button?.addEventListener("click", (event) => {
        pop_up_new_group_chat.show();
    });
}


/*              MAIN            */
async function main(user_id: number, token: string){
    const auth_req = await ws_manager.authorizationMessage(user_id, token);
    if (!auth_req) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        window.location.replace("/sign_in");
    }

    // add event listeners
    addEventListeners();
 
    // get short info
    ws_manager.getUserInfo(user_id).then((user_info) => {
        if (user_info == null) throw "USER NOT FOUND!";
        sidebar.setUserInfo(user_info);
    });

    // get chats
    ws_manager.getChatsMessage().then((chats) => {
        if (chats == null) throw "NULL CHATS!"
        sidebar.setupChats(chats);
        chat.setupChats(chats);
    });

    // initialize getting info
    getMessages();
    getNewChats();

    console.log("INITIALIZED!");
}

/*          INITIALIZIND         */
if (token != null && !Number.isNaN(user_id)) {
    try {
        main(user_id, token);
    } catch (error) {
        window.location.reload();
    }    
}
else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    window.location.replace(SIGN_IN_URL);
}