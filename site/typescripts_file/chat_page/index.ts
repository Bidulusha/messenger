import { Websocket } from "websocket-ts";
import { SIGN_IN_URL } from "../constants";
import { SidebarUI } from "./ui_objects/sidebar";
import { WebsocketManager } from "./websocket_connection";
import { ChatsUserWithInfo } from "./objects/chats_user_with_info";
import { PopUpNewChatUI } from "./ui_objects/pop_up/start_new_chat";
import { AuthRequest, MessageType, UserMessage } from "./ws_messages/message";
import { UserShortInfo } from "./objects/user_info";
import { ChatUI } from "./ui_objects/chat";
import { ChatMessages, MessageContent } from "./objects/chat_message";

const user_id: number = parseInt(localStorage.getItem("user_id")!);
const token: string | null = localStorage.getItem("access_token");
const ws_manager = new WebsocketManager();


const sidebar: SidebarUI = new SidebarUI(ws_manager);
const pop_up_new_chat: PopUpNewChatUI = new PopUpNewChatUI(ws_manager);
const chat: ChatUI = new ChatUI(ws_manager, sidebar, user_id);
let initialized: boolean = false;


/*          INITIALIZIND         */
if (token != null && !Number.isNaN(user_id)) {
    ws_manager.addEventListeners(

        // On open
        async () => {
            console.log("Open connection!"); 
            // ws_manager.sendMessage("pong");
            ws_manager.authorizationMessage(user_id, token);
        },

        // On close 
        async () => {console.log("Close connection!");},

        // On message
        async (i: Websocket, ev: MessageEvent) => {
            try {
                const ans = JSON.parse(ev.data);

                switch (ans["message_type"]) {

                    // Auth check
                    case MessageType.AUTH_CHECK: {
                        if (ans["content"] == "ACCESS_DENIED"){
                            localStorage.removeItem("access_token");
                            localStorage.removeItem("user_id");
                            window.location.replace("/sign_in");
                        }
                        else {
                            console.log("Access to user allowed!");
                            /*      Get chats          */
                            console.log(initialized);
                            if (!initialized) { 
                                initialized = true;
                                await ws_manager.getChatsMessage(); 
                            }
                        }

                        break;
                    }

                    // Get user short info
                    case MessageType.USER_SHORT_INFO: {
                        const user_info: UserShortInfo = Object.assign(new UserShortInfo (),JSON.parse(ans["content"]));
                        console.log(user_info);
                        sidebar.setUserInfo(user_info);
                        break;
                    }

                    // Get chats
                    case MessageType.GET_CHATS: {
                        const chats: ChatsUserWithInfo[] = JSON.parse(ans["content"]);
                        chats.forEach((chat, index) => {
                            chat = Object.assign(new ChatsUserWithInfo(), chat);
                        });
                        
                        sidebar.setupChats(chats);

                        break;
                    }
                    
                    case MessageType.START_CHAT: {
                        if (ans["content"] == "USER_NOT_FOUND") {
                            alert("Пользователь не существует!");
                            break;
                        }

                        pop_up_new_chat.close();
                        
                        const short_info = Object.assign(new ChatsUserWithInfo(), JSON.parse(ans["content"]));
                        chat.start_chat(short_info);

                        break;
                    }

                    case MessageType.OPEN_CHAT: {
                        if (ans["content"] == "CHAT_NOT_FOUND"){
                            alert("Чата не существует!");
                            break;
                        }
                        const chat_messages: ChatMessages[] = JSON.parse(ans["content"]);
                        chat_messages.forEach((message, ind) => {
                            message = Object.assign(new ChatMessages(), message);
                        });

                        chat.open_chat(sidebar.currentChat, chat_messages);
                        break;
                    }

                    case MessageType.CREATE_CHAT: {
                        const chat_info: ChatsUserWithInfo = Object.assign(new ChatsUserWithInfo(), JSON.parse(ans["content"]));
                        chat.chat_id = chat_info.chat_id;
                        sidebar.addChat(chat_info);

                        break;
                    }

                    case MessageType.SEND_MESSAGE: {
                        const message: ChatMessages = Object.assign(new ChatMessages(), JSON.parse(ans["content"]));
                        message.content = Object.assign(new MessageContent(), message.content);

                        if (message.id == chat.chat_id) chat.add_message(message);

                        break;
                    }

                }
            } catch (error) {
                console.log("Server message: ", ev.data);
            }
        },

        () => {
            console.log("recconect");
        }
    )

    // Add listener to create new chat button
    const create_new_chat_button = document.querySelector("#sidebar__create-chat");
    create_new_chat_button?.addEventListener("click", (event) => {
        pop_up_new_chat.show();
    });
}
else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    window.location.replace(SIGN_IN_URL);
}