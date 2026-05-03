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
    
    private last_sender_user: number = -1;

    // Chat info
    user_id: number;
    chat: ChatsInfo;
    users_in_chat_info: Map<number, Map<number, UserShortInfo>> = new Map();

    private resolveUpdateFn: (value: ChatsInfo) => void;
    private resolveSendMessageFn: (value: number) => void;

    set chat_id(value: number) { this.chat.id = value; this.resolveUpdateFn(this.chat);}
    get chat_id() { 
        if (this.chat != undefined) return this.chat.id; 
        else return -1;
    } 

    sendChatMessage(): Promise<number> {
        return new Promise((resolve) => {
            this.resolveSendMessageFn = resolve;
        })
    }

    newChatUpdate(): Promise<ChatsInfo> {
        return new Promise((resolve) => {
            this.resolveUpdateFn = resolve;
        });
    }

    // Markdown options
    md_options = { addCopyToClipboard: true, interactiveCheckboxes: false };

    /*                  CONSTRUCTOR              */
    constructor(ws: WebsocketManager, user_id: number) {
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
    add_message(message: ChatMessages, get: boolean = false) {
        if (get && message.id != this.chat.id) return;
        

        const hmtlContent = markdownToHtml(message.content.text_content, this.md_options);

        const sended_message_container = document.createElement("div");
        const text_container = document.createElement("div");

        sended_message_container.classList.add("chat__body-text__message-container");
        text_container.classList.add("chat__body-text__text-container");

        const sended_message_text = document.createElement("div");

        if (this.last_sender_user != message.who_sended){
            const user = this.users_in_chat_info.get(this.chat.id)?.get(message.who_sended);
            const user_name_div = document.createElement("div");
            const user_avatar = document.createElement("img");

            user_name_div.classList.add("sender_user_name");
            user_avatar.classList.add("sender_avatar");

            if (user != null) {
                user_name_div.innerText = user.login;
                user_avatar.src = AVATARS_URL + user.avatar;
            }

            sended_message_container.append(user_avatar);
            text_container.append(user_name_div);
        }
    
        if (message.who_sended == this.user_id) 
            sended_message_text.classList.add("chat__body-text__sended_message");
        else sended_message_text.classList.add("chat__body-text__recieved_message");

        sended_message_text.classList.add("message-text");
        // sended_message_text.innerText = message.content.text_content;
        sended_message_text.innerHTML = hmtlContent;
        
        text_container.append(sended_message_text);
        sended_message_container.append(text_container);
        this.chatBodyTextElement.append(sended_message_container);
        this.last_sender_user = message.who_sended;
    }
    
    // Setup chat info
    setupChats(chats: ChatsUserWithInfo[]) {
        for (let chat of chats) {
            const users_info = new Map();
            for(let member of chat.members_id) {
                this.ws.getUserInfo(member).then((value) => {
                    users_info.set(member, value);
                });
            }
            this.users_in_chat_info.set(chat.chat_id, users_info);
        }
    }

    addNewChatInfo(chat: ChatsUserWithInfo) {
        const users_info = new Map();
        for(let member of chat.members_id) {
            this.ws.getUserInfo(member).then((value) => {
                users_info.set(member, value);
            });
        }
        this.users_in_chat_info.set(chat.chat_id, users_info);
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

    start_chat(user_info: UserShortInfo){
        this.close();

        this.chat = new ChatsInfo (
            user_info.id,
            user_info.avatar,
            user_info.login,
            [user_info.id, this.user_id]
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
        
        this.resolveSendMessageFn(this.chat_id);

        // Send message
        this.ws.sendChatMessage(
            new SendMessage(
                this.chat_id,
                message
            )
        ).then((answer) => {
            if (answer == null) { console.error("ERROR SENDING MESSAGE!"); return;}
            if (answer == "Ok") { console.log("Message sended succesfuly!"); return; }
            this.chat.id = (answer as number);
            console.log("Created new chat!");
        });

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

        this._message_id++;
    }
}