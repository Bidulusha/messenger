import { WebsocketManager } from "../../websocket_connection";
import { PopUpUI } from "./pop_up_interface";

export class PopUpUserSettings implements PopUpUI {
    popUpElement: HTMLElement = document.querySelector("#pop_up_start_user_settings")!;
    backgroundElement: HTMLElement = this.popUpElement.querySelector(".pop_up__background")!;
    deleteAccountButton: HTMLButtonElement = this.popUpElement.querySelector(".pop_up__form-delete_account")!;
    exitAccountButton: HTMLButtonElement = this.popUpElement.querySelector(".pop_up__form-exit")!;

    ws_manager: WebsocketManager;

    constructor(user_id: number, ws_manager: WebsocketManager) {
        this.ws_manager = ws_manager;

        // Event listeners
        this.backgroundElement.addEventListener("click", () => this.close());
        this.exitAccountButton.addEventListener("click", () => {
            window.localStorage.removeItem("access_token");
            window.localStorage.removeItem("user_id");
            window.location.replace("/sign_in");
        });
        this.deleteAccountButton.addEventListener("click", () => {
            this.ws_manager.sendDeleteAccount();
            window.localStorage.removeItem("access_token");
            window.localStorage.removeItem("user_id");
            window.location.replace("/sign_in");
        });

        
    }

    show() {
        this.popUpElement.style.display = "flex";
    }

    close() {
        this.popUpElement.style.display = "none";
    }
}