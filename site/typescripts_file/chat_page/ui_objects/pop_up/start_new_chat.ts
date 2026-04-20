import { WebsocketManager } from "../../websocket_connection";
import { UserMessage, MessageType } from "../../ws_messages/message";
import { PopUpUI } from "./pop_up_interface";

export class PopUpNewChatUI implements PopUpUI {
    popUpElement: HTMLElement = document.querySelector('#pop_up_start_new_chat')!;
    findUser: HTMLButtonElement = this.popUpElement.querySelector(".pop_up__form-find_button")!;
    backgroundElement: HTMLElement = this.popUpElement.querySelector(".pop_up__background")!;
    inputElement: HTMLInputElement = this.popUpElement.querySelector(".pop_up__form-login_input")!;
    formContainerElement: HTMLElement = this.popUpElement.querySelector(".pop_up__form-container")!;

    constructor(ws_manager: WebsocketManager) { 
        this.backgroundElement.addEventListener("click", () => this.close());

        // send message
        this.findUser.addEventListener("click", () => {
            ws_manager.startChatMessage(this.inputElement.value);
        });

        this.inputElement.addEventListener("keypress", (ev) => {
            if (ev.keyCode == 13) { 
                ev.preventDefault();
                ws_manager.startChatMessage(this.inputElement.value);
                
            }
        })
    }

    show() {
        this.popUpElement.style.display = "flex";
    }
    
    close() {
        this.popUpElement.style.display = "none";
        this.inputElement.value = "";
    }
}