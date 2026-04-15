import { ChatsInfo } from "../objects/chat_info";
import { ObjectUI } from "./object_ui";

// <div id="chat_[id]_info" class="chat__info">
//     <div class="chat__avatar">
//         <img src="/static/images/avatars/ph.png">
//     </div>
//     <div class="chat_info__text">
//         <div class="chat__info-name line-limit-length">Андреев Вадим Антонович</div>
//         // <div class="chat__info-last-message line-limit-length"></div>
//     </div>
// </div>

export class SidebarUI implements ObjectUI {
    sidebarDiv: HTMLDivElement = document.querySelector("#main_sidebar")!; 

    constructor(){
        
    }

    setupChats(chats_info: ChatsInfo[]) {
        chats_info.forEach((chat, index) => {
            this.addChat(chat);
        })
    }

    addChat(chat: ChatsInfo){
        const chat_info_button = document.createElement("button");
        chat_info_button.id = `chat_${chat.id}_info`;
        chat_info_button.classList.add("chat__info");
        chat_info_button.classList.add("sidebar-element");
        
        const chat_avatar_div = document.createElement("div");
        const chat_avatar_img = document.createElement("img");
        chat_avatar_img.src = `/static/images/avatars/${chat.avatar}`;
        chat_avatar_div.append(chat_avatar_img);

        const chat_info_text = document.createElement("div");
        chat_info_text.classList.add("chat_info__text");

        const chat_info_name = document.createElement("div");
        chat_info_name.classList.add('chat__info-name')
        chat_info_name.classList.add("line-limit-length");
        chat_info_name.innerText = chat.chat_name;
        chat_info_text.append(chat_info_name);

        chat_info_button.append(chat_info_text);
        this.sidebarDiv.prepend(chat_info_button);
    }

    show(){
        
    }
}