import { ObjectUI } from "./object_ui";
import { ChatsUserWithInfo } from "../objects/chats_user_with_info";
import { ChatsInfo} from "../objects/chat_info";
import { UserShortInfo } from "../objects/user_info";
import { AVATARS_URL } from "../../constants";
import { WebsocketManager } from "../websocket_connection";
import { MessageContent, ChatMessages, SendMessage} from "../objects/chat_message";
import { SidebarUI } from "./sidebar";
import { Time } from "../objects/time";
import { markdownToHtml } from "ts-markdown-parser";

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

    // Chat message info
    private _message_id = 0;
    private _answer_to: number = -1;
    private _forwarded_from: number = -1;
    private _photos_content: string[] = [];
    private _files: string[] = [];

    // Chat info
    user_id: number;
    chat: ChatsInfo;
    set chat_id(value: number) { this.chat.id = value; }
    get chat_id() { return this.chat.id; } 
    
    // Markdown options
    md_options = { addCopyToClipboard: true, interactiveCheckboxes: false };
    
    first_message: boolean = false;


    /*                  CONSTRUCTOR              */
    constructor(ws: WebsocketManager, sidebar: SidebarUI, user_id: number) {
        this.ws = ws;
        this.user_id = user_id;
        
        this.close();
        this.chatButtonSend.addEventListener("click", () => this.send_message());
        this.chatInputElement.addEventListener("keypress", (ev) => {
            if (ev.keyCode == 13 && !ev.shiftKey) { 
                ev.preventDefault();
                this.send_message(); 
            };
        });
    }
    

    /*                  UI METHODS                */
    show() {
        this.chatElement.style.display = "flex";
        this.chatBodyTextElement.scroll(0, this.chatBodyTextElement.scrollHeight);
        this.add_header();
    }

    close() {
        this.chatBodyTextElement.innerHTML = "";
        this.chatElement.style.display = "none";
    }

    // Add header
    add_header() {
        // Create base elements
        this.chatAvatartImage.src = AVATARS_URL + this.chat.avatar;
        this.chatNameElement.innerText = this.chat.chat_name;
        this.chatAvatartImage.style.display = "block";
    }


    // Add message to page
    add_message(message: ChatMessages) {
        const hmtlContent = markdownToHtml(message.content.text_content, this.md_options);

        const sended_message_container = document.createElement("div");
        sended_message_container.classList.add("chat__body-text__message-container");
        const sended_message_text = document.createElement("div");

        if (message.who_sended == this.user_id) 
            sended_message_text.classList.add("chat__body-text__sended_message");
        else sended_message_text.classList.add("chat__body-text__recieved_message");

        sended_message_text.classList.add("message-text");
        // sended_message_text.innerText = message.content.text_content;
        sended_message_text.innerHTML = hmtlContent;
        
        sended_message_container.append(sended_message_text);
        this.chatBodyTextElement.append(sended_message_container);
    }
    
    /*                  MESSAGE METHODS              */
    open_chat(chat: ChatsInfo, messages: ChatMessages[]) {
        this.close();

        this.chat = chat;
        messages.forEach((message, ind) => {
            this.add_message(message);
        });
        
        this.show();
    }

    start_chat(user_info: ChatsUserWithInfo){
        this.close();

        this.first_message = true;
        this.chat = new ChatsInfo (
            user_info.chat_id,
            user_info.chat_avatar,
            user_info.chat_name,
            user_info.members_id
        );

        // Show UI
        this.show();
    }

    send_message() {
        // Not empty
        if (this.chatInputField.innerText == "") {
            alert("Текст не может быть пустым!");
            return;
        }

        // Create new MessageContent object
        const message = new MessageContent (
                    this._answer_to,
                    this._forwarded_from,
                    this.chatInputField.innerText,
                    this._photos_content,
                    this._files
                );
        
        // Send message
        this.ws.sendChatMessage(
            new SendMessage(
                this.chat_id,
                this.first_message,
                message
            )
        );

        // Create message on page
        this.add_message(
            new ChatMessages(
                this._message_id,
                this.user_id,
                new Time(new Date()),
                message
            )
        );

        // Remove text from intput
        this.chatInputField.innerText = "";
        this.chatBodyTextElement.scroll(0, this.chatBodyTextElement.scrollHeight);

        // Edit values
        this.first_message = false;
        this._message_id++;
    }
}