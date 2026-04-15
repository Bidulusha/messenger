import { Websocket } from "websocket-ts";
import { SIGN_IN_URL } from "../constants";
import { SidebarUI } from "./ui_objects/sidebar";
import { WebsocketManager } from "./websocket_connection";
import { ChatsUserWithInfo } from "./objects/chats_user_with_info";
import { PopUpNewChatUI } from "./ui_objects/pop_up/start_new_chat";
import { AuthRequest, MessageType, UserMessage } from "./ws_messages/message";
import { UserShortInfo } from "./objects/user_info";
import { ChatUI } from "./ui_objects/chat";

const user_id: string | null = localStorage.getItem("user_id")
const token: string | null = localStorage.getItem("access_token");
const ws_manager = new WebsocketManager();


const sidebar: SidebarUI = new SidebarUI();
const pop_up_new_chat: PopUpNewChatUI = new PopUpNewChatUI(ws_manager);
const chat: ChatUI = new ChatUI(ws_manager, sidebar);

/*          INITIALIZIND         */
if (token != null && user_id != null) {
    ws_manager.addEventListeners(

        // On open
        () => {
            console.log("Open connection!"); 
            /*      Authorize user     */
            ws_manager.authorizationMessage(parseInt(user_id), token);

            /*      Get chats          */
            ws_manager.getChatsMessage();
        },

        // On close 
        () => {console.log("Close connection!")},

        // On message
        (i: Websocket, ev: MessageEvent) => {
            try {
                const ans = JSON.parse(ev.data);
                switch (ans["message_type"]) {

                    // Auth check
                    case MessageType.AUTH_CHECK: {
                        if (ans["content"] == "ACCESS_DENIED"){
                            localStorage.removeItem("token");
                            localStorage.removeItem("user_id");
                            window.location.replace("/sign_in");
                        }
                        else {
                            
                            console.log("Access to user allowed!");
                        }

                        break;
                    }

                    // Get chats
                    case MessageType.GET_CHATS: {
                        console.log(ans["content"]);
                        const chats = Object.assign(new ChatsUserWithInfo(), JSON.parse(ans["content"]));
                        console.log(chats);
                        
                        sidebar.setupChats(chats);

                        break;
                    }
                    
                    case MessageType.START_CHAT: {
                        if (ans["content"] == "USER_NOT_FOUND") {
                            alert("Пользователь не существует!");
                            break;
                        }

                        pop_up_new_chat.close();
                        
                        const short_info = Object.assign(new UserShortInfo(), JSON.parse(ans["content"]));
                        chat.start_chat(short_info);

                        break;
                    }

                }
            } catch (error) {
                console.log("Server message: ", ev.data);
            }
        }
    )

    // Add listener to create new chat button
    const create_new_chat_button = document.querySelector("#sidebar__create-chat");
    create_new_chat_button?.addEventListener("click", (event) => {
        pop_up_new_chat.show();
    });
}
else {
    window.location.replace(SIGN_IN_URL);
}