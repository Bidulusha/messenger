import { ObjectUI } from "./object_ui";
import { ChatsUserWithInfo } from "../objects/chats_user_with_info";
import { ChatMessages, ChatsInfo} from "../objects/chat_info";
import { UserShortInfo } from "../objects/user_info";
import { AVATARS_URL } from "../../constants";
import { WebsocketManager } from "../websocket_connection";
import { MessageContent } from "../objects/chat_message";
import { SidebarUI } from "./sidebar";
import { Time } from "../objects/time";

export class ChatUI implements ObjectUI {
    // Elements on page
    chatElement: HTMLElement = document.querySelector("#chat_body")!;

    chatHeaderElement: HTMLElement = this.chatElement.querySelector(".chat__header")!;
    chatAvatarElement: HTMLElement = this.chatHeaderElement.querySelector(".chat__header-avatar")!;
    chatAvatartImage: HTMLImageElement = this.chatAvatarElement.querySelector("img")!;
    chatInfoElement: HTMLElement = this.chatHeaderElement.querySelector(".chat__header-info")!;
    chatNameElement: HTMLElement = this.chatHeaderElement.querySelector(".chat__header-info__name")!;

    chatBodyElement: HTMLElement = this.chatElement.querySelector(".chat__body")!;
    chatBodyTextElement: HTMLElement = this.chatBodyElement.querySelector(".chat__body-text")!;

    chatInputElement: HTMLElement = this.chatBodyElement.querySelector(".chat__body-input")!;
    chatInputField: HTMLInputElement = this.chatInputElement.querySelector(".chat__body-input__text")!;
    chatButtonSend: HTMLButtonElement = this.chatInputElement.querySelector(".chat__body-input__button")!;
    
    // Script elements
    ws: WebsocketManager;
    sidebar: SidebarUI;
    
    // Additional info
    user_id: number;
    chat: ChatsInfo;
    
    first_message: boolean = false;

    constructor(ws: WebsocketManager, sidebar: SidebarUI, user_id: number) {
        this.ws = ws;
        this.user_id = user_id;

        this.close();
        this.chatButtonSend.addEventListener("click", () => this.send_message());
    }

    startCondition() {

    }

    show() {
        this.chatElement.style.display = "flex";
    }

    close() {
        this.chatBodyTextElement.innerHTML = "";
        this.chatElement.style.display = "none";
    }

    open_chat() {
        // TODO
    }

    start_chat(user_info: UserShortInfo){
        // Base
        this.first_message = true;
        this.chat = new ChatsInfo (
            -1,
            user_info.avatar,
            user_info.login,
            []
        );

        // Show UI
        this.show();

        // Create base elements
        this.chatNameElement.innerText = user_info.login;
        this.chatAvatartImage.style.display = "block";
        this.chatAvatartImage.src = AVATARS_URL + user_info.avatar;
    }

    send_message() {
        // Send message
        this.ws.sendChatMessage(
            new ChatMessages(
                this.chat.id,
                this.user_id,
                new Time(new Date()),
                new MessageContent (
                    -1,
                    "",
                    this.chatInputField.value,
                    [""],
                    [""]    
                )
            )
        );

        // Create message on page
        const sended_message_container = document.createElement("div");
        sended_message_container.classList.add("chat__body-text__message-container");
        const sended_message_text = document.createElement("div");
        sended_message_text.classList.add("chat__body-text__sended_message");
        sended_message_text.innerText = this.chatInputField.value;
        
        sended_message_container.append(sended_message_text);
        this.chatBodyTextElement.append(sended_message_container);
    }
}