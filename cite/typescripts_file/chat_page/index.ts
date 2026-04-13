import { Websocket } from "websocket-ts";
import { SIGN_IN_URL } from "../constants";
import { SidebarUI } from "./ui_objects/sidebar";
import { ChatsInfo } from "./objects/chat_info";
import { WebsocketManager } from "./websocket_connection";
import { AuthRequest, MessageType, UserMessage } from "./ws_messages/message";

const token: string | null = localStorage.getItem("access_token");
const wsManager = new WebsocketManager();


let sidebar: SidebarUI = new SidebarUI();


/*          INITIALIZIND         */
if (token != null) {
    wsManager.addEventListeners(

        // On open
        () => {
            console.log("Open connection!"); 
            /*      Authorize user     */
            const auth_msg = new UserMessage(
                MessageType.AUTH_CHECK,
                JSON.stringify(
                    new AuthRequest(
                        parseInt(localStorage.getItem("user_id")!),
                        localStorage.getItem("access_token")!
                    )
                )
            );
            wsManager.sendMessage(JSON.stringify(auth_msg));

            /*      Get chats          */
            const get_chats_msg = new UserMessage(
                MessageType.GET_CHATS,
                ""
            );

            wsManager.sendMessage(JSON.stringify(get_chats_msg));
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
                        const chats = Object.assign(new ChatsInfo(), JSON.parse(ans["content"]));
                        console.log(chats);
                        
                        sidebar.setupChats(chats);

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
        console.log(event.currentTarget);
    });
}
else {
    window.location.replace(SIGN_IN_URL);
}