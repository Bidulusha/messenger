import { AVATARS_URL } from "../../constants";
import { ChatsInfo } from "../objects/chat_info";
import { ChatsUserWithInfo } from "../objects/chats_user_with_info";
import { UserShortInfo } from "../objects/user_info";
import { WebsocketManager } from "../websocket_connection";
import { ChatUI } from "./chat";
import { ObjectUI } from "./object_ui";

export class SidebarUI implements ObjectUI {
    // HTML elements
    sidebarDiv: HTMLDivElement = document.querySelector("#main_sidebar")!; 
    userInfoDiv: HTMLDivElement = document.querySelector(".sidebar__user-info")!;
    userInfoAvatarImage: HTMLImageElement = this.userInfoDiv.querySelector("img")!;
    userInfoNameDiv: HTMLDivElement = this.userInfoDiv.querySelector(".sidebar__user-info__header-info__name")!;


    // WS manager
    ws: WebsocketManager;
    
    // Chat info
    currentChat: ChatsInfo;


    constructor(ws: WebsocketManager){
        this.ws = ws;
    }

    setupChats(chats_info: ChatsUserWithInfo[]) {
        console.log(chats_info);
        chats_info.forEach((chat, index) => {
            this.addChat(chat);
        })
    }

    setUserInfo(user_info: UserShortInfo) {
        this.userInfoAvatarImage.src = AVATARS_URL + user_info.avatar;
        this.userInfoNameDiv.innerText = user_info.login;
    }

    addChat(chat: ChatsUserWithInfo){
        const chat_info_button = document.createElement("button");
        chat_info_button.id = `chat_${chat.chat_id}_info`;
        chat_info_button.classList.add("chat__info");
        chat_info_button.classList.add("sidebar-element");
        chat_info_button.addEventListener("click", (ev) => {
            this.ws.openChatMessage(chat.chat_id);
            this.currentChat = new ChatsInfo(
                chat.chat_id,
                chat.chat_avatar,
                chat.chat_name,
                chat.members_id
            );
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

    getMessageInChat(chat_id: number) {
        console.log(chat_id);
        const chat_info = document.querySelector(`#chat_${chat_id}_info`);
        console.log(chat_info);
        if (chat_info) this.sidebarDiv.children[1].after(chat_info);
        
    }

    show(){
        
    }
}