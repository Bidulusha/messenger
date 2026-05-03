import { UserShortInfo } from "../../objects/user_info";
import { WebsocketManager } from "../../websocket_connection";
import { UserMessage, MessageType } from "../../ws_messages/message";
import { ChatUI } from "../chat";
import { PopUpUI } from "./pop_up_interface";

export class PopUpNewChatUI implements PopUpUI {
    popUpElement: HTMLElement = document.querySelector('#pop_up_start_new_chat')!;
    findUser: HTMLButtonElement = this.popUpElement.querySelector(".pop_up__form-find_button")!;
    backgroundElement: HTMLElement = this.popUpElement.querySelector(".pop_up__background")!;
    inputElement: HTMLInputElement = this.popUpElement.querySelector(".pop_up__form-login_input")!;
    formContainerElement: HTMLElement = this.popUpElement.querySelector(".pop_up__form-container")!;

    ws_manager: WebsocketManager;
    chat: ChatUI;

    constructor(ws_manager: WebsocketManager, chat: ChatUI) { 
        this.ws_manager = ws_manager;
        this.chat = chat;
        this.backgroundElement.addEventListener("click", () => this.close());

        // send message
        this.findUser.addEventListener("click", () => {
            this.sendMessageToWs();
        });

        this.inputElement.addEventListener("keypress", (ev) => {
            if (ev.keyCode == 13) { 
                ev.preventDefault();
                this.sendMessageToWs();
            }
        })
    }

    async sendMessageToWs() {
        const req = await this.ws_manager.getUserByLogin(this.inputElement.value);
        if (req == null) alert("User not found!");
        else {
            this.chat.start_chat(req);
            this.close();
        }
    }

    show() {
        this.popUpElement.style.display = "flex";
    }
    
    close() {
        this.popUpElement.style.display = "none";
        this.inputElement.value = "";
    }
}