import { ObjectUI } from "./object_ui";
import { ChatsUserWithInfo } from "../objects/chats_user_with_info";
import { ChatsInfo} from "../objects/chat_info";
import { UserShortInfo } from "../objects/user_info";
import { AVATARS_URL } from "../../constants";
import { WebsocketManager } from "../websocket_connection";
import { MessageContent, ChatMessages, SendMessage} from "../objects/chat_message";
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

    chatInputElement: HTMLElement = this.chatElement.querySelector(".chat__input")!;
    chatInputField: HTMLDivElement = this.chatInputElement.querySelector(".chat__input-text")!;
    chatButtonSend: HTMLButtonElement = this.chatInputElement.querySelector(".chat__input-button")!;
    
    // Script elements
    ws: WebsocketManager;
    sidebar: SidebarUI;

    // Input element charatresitics
    input_base_height: number = this.chatInputField.scrollHeight;

    // Additional info
    user_id: number;
    user_with_chat_id: number;
    chat: ChatsInfo;
    private _chat_id: number;


    first_message: boolean = false;

    // Constructor
    constructor(ws: WebsocketManager, sidebar: SidebarUI, user_id: number) {
        this.ws = ws;
        this.user_id = user_id;

        this.close();
        this.chatButtonSend.addEventListener("click", () => this.send_message());
        this.chatInputElement.addEventListener("keypress", (ev) => {
            if (ev.keyCode == 13 && !ev.shiftKey) { 
                ev.preventDefault();
                this.send_message(); 
            }
        });
    }

    // Set chat_id
    set chat_id(value: number) {
        this._chat_id = value;
    }

    // Add message to page
    add_message(message: ChatMessages) {
        const sended_message_container = document.createElement("div");
        sended_message_container.classList.add("chat__body-text__message-container");
        const sended_message_text = document.createElement("div");

        if (message.who_sended == this.user_id) 
            sended_message_text.classList.add("chat__body-text__sended_message");
        else sended_message_text.classList.add("chat__body-text__recieved_message");

        sended_message_text.classList.add("message-text");
        sended_message_text.innerText = message.content.text_content;
        
        sended_message_container.append(sended_message_text);
        this.chatBodyTextElement.append(sended_message_container);
    }

    // Add header
    add_header(login: string, avatar: string) {
        // Create base elements
        this.chatNameElement.innerText = login;
        this.chatAvatartImage.style.display = "block";
        this.chatAvatartImage.src = AVATARS_URL + avatar;
    }

    private add_message_string(message: string) {
        const sended_message_container = document.createElement("div");
        sended_message_container.classList.add("chat__body-text__message-container");
        
        const sended_message_text = document.createElement("div");
        sended_message_text.classList.add("chat__body-text__sended_message");
        sended_message_text.classList.add("message-text");
        sended_message_text.innerText = message;
        
        sended_message_container.append(sended_message_text);
        this.chatBodyTextElement.append(sended_message_container);
    }

    show() {
        this.chatElement.style.display = "flex";
        this.chatBodyTextElement.scroll(0, this.chatBodyTextElement.scrollHeight);
    }

    close() {
        this.chatBodyTextElement.innerHTML = "";
        this.chatElement.style.display = "none";
    }

    open_chat(chat_id: number, messages: ChatMessages[]) {
        this.close();
        this._chat_id = chat_id;
        messages.forEach((message, ind) => {
            this.add_message(message);
        });
        this.show();
    }

    start_chat(user_info: ChatsUserWithInfo){
        this.close();
        // Base
        this.first_message = true;
        this.user_with_chat_id = user_info.chat_id;
        this.chat = new ChatsInfo (
            user_info.chat_id,
            user_info.chat_avatar,
            user_info.chat_name,
            user_info.members_id
        );

        console.log(this.chat);

        // Show UI
        this.show();
        this.add_header(user_info.chat_name, user_info.chat_avatar);
    }

    send_message() {
        // Set scroll

        // Not empty
        if (this.chatInputField.innerText == "") {
            alert("Текст не может быть пустым!");
            return;
        }

        // If first message
        if (this.first_message){
            this.first_message = false;
            this.ws.sendChatFirstMessage(
                new SendMessage(
                    this.user_id,
                    this.user_with_chat_id,
                    new MessageContent (
                        -1,
                        -1,
                        this.chatInputField.innerText,
                        [""],
                        [""],
                    )
                )
            );
        } 
        // Just send message
        else {
            this.ws.sendChatMessage(
                new SendMessage(
                    this.user_id,
                    this._chat_id,
                    new MessageContent (
                        -1,
                        -1,
                        this.chatInputField.innerText,
                        [""],
                        [""],
                    )
                )
            )
        }

        // Create message on page
        this.add_message_string(this.chatInputField.innerText);

        // Remove text from intput
        this.chatInputField.innerText = "";
        this.chatBodyTextElement.scroll(0, this.chatBodyTextElement.scrollHeight);
    }
}