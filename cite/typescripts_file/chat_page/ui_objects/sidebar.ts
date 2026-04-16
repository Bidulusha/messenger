import { ChatsInfo } from "../objects/chat_info";
import { ChatsUserWithInfo } from "../objects/chats_user_with_info";
import { WebsocketManager } from "../websocket_connection";
import { ChatUI } from "./chat";
import { ObjectUI } from "./object_ui";

export class SidebarUI implements ObjectUI {
    sidebarDiv: HTMLDivElement = document.querySelector("#main_sidebar")!; 
    
    ws: WebsocketManager;
    currentChat: number;

    constructor(ws: WebsocketManager){
        this.ws = ws;
    }

    setupChats(chats_info: ChatsUserWithInfo[]) {
        console.log(chats_info);
        chats_info.forEach((chat, index) => {
            console.log(chat);
            console.log(index);
            this.addChat(chat);
        })
    }

    addChat(chat: ChatsUserWithInfo){
        const chat_info_button = document.createElement("button");
        chat_info_button.id = `chat_${chat.chat_id}_info`;
        chat_info_button.classList.add("chat__info");
        chat_info_button.classList.add("sidebar-element");
        chat_info_button.addEventListener("click", (ev) => {
            this.ws.openChatMessage(chat.chat_id);
            this.currentChat = chat.chat_id;
        })
        
        const chat_avatar_div = document.createElement("div");
        const chat_avatar_img = document.createElement("img");
        chat_avatar_img.src = `/static/images/avatars/${chat.chat_avatar}`;
        chat_avatar_div.append(chat_avatar_img);

        const chat_info_text = document.createElement("div");
        chat_info_text.classList.add("chat_info__text");

        const chat_info_name = document.createElement("div");
        chat_info_name.classList.add('chat__info-name')
        chat_info_name.classList.add("line-limit-length");
        chat_info_name.innerText = chat.chat_name;
        chat_info_text.append(chat_info_name);

        chat_info_button.append(chat_info_text);
        this.sidebarDiv.append(chat_info_button);
    }

    show(){
        
    }
}