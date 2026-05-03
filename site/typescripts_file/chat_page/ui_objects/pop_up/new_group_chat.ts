import { PopUpUI } from "./pop_up_interface";
import { WebsocketManager } from "../../websocket_connection";
import { AVATARS_URL } from "../../../constants";
import { ChatUI } from "../chat";
import { ChatsInfo } from "../../objects/chat_info";

export class PopUpStartNewGroupChat implements PopUpUI {
    popUpElement: HTMLElement = document.querySelector('#pop_up_start_new_group_chat')!;
    backgroundElement: HTMLElement = this.popUpElement.querySelector(".pop_up__background")!;
    formContainerElement: HTMLElement = this.popUpElement.querySelector(".pop_up__form-container")!;
    usersContainer: HTMLElement = this.popUpElement.querySelector(".pop_up__form-users")!;

    chatNameInputElement: HTMLInputElement = this.popUpElement.querySelector(".pop_up__form-chat_name")!;

    userInputElement: HTMLInputElement = this.popUpElement.querySelector(".pop_up__form-login_input")!;
    findUserContainer: HTMLElement = this.popUpElement.querySelector(".pop_up__form-container")!;
    findUserButton: HTMLButtonElement = this.popUpElement.querySelector(".pop_up__form-find_button")!;

    createNewChatButton: HTMLButtonElement = this.popUpElement.querySelector(".pop_up__form-start_chat")!;

    ws_manager: WebsocketManager;
    chat: ChatUI;

    user_id: number;
    users: number[] = [];

    constructor(ws_manager: WebsocketManager, chat: ChatUI, user_id: number) { 
        this.ws_manager = ws_manager;
        this.user_id = user_id;
        this.chat = chat;

        this.backgroundElement.addEventListener("click", () => this.close());

        // send message
        this.findUserButton.addEventListener("click", async () => {
            await this.findUserAndAdd();
        });

        this.userInputElement.addEventListener("keypress", async (ev) => {
            if (ev.keyCode == 13) { 
                ev.preventDefault();
                await this.findUserAndAdd();
            }
        })

        this.createNewChatButton.addEventListener("click", async (ev) => {
            if (this.chatNameInputElement.value.replace(" ", "") == "") { 
                alert("Название не может быть пустым!");
                return;
            }

            this.users.push(this.user_id);
            const req = await this.ws_manager.createNewChat(
                    "ph.png",
                    this.chatNameInputElement.value,
                    this.users
            );

            if (req == null) alert("Ошибка при создании чата!");
            else {
                this.chat.open_chat(req.into_chats_info(), []);
                this.users = [];
                this.close();
            }
        })
    }

    private async findUserAndAdd() {
        const req = await this.ws_manager.getUserByLogin(this.userInputElement.value);

        if (req == null) { alert("User not found!"); }
        else if (req.id == this.user_id){
            alert("Это вы!");
        }
        else {
            this.users.push(req.id);
            const userContainer = document.createElement("div");
            userContainer.classList.add("user-info");

            const userAvatar = document.createElement("img");
            userAvatar.classList.add("user-avatar");
            userAvatar.src = AVATARS_URL + req.avatar;

            const userLogin = document.createElement("div");
            userLogin.classList.add("user-login");
            userLogin.innerText = req.login;

            userContainer.append(userAvatar);
            userContainer.append(userLogin);

            this.usersContainer.append(userContainer);
            this.userInputElement.value = "";
        }
    }

    show() {
        this.popUpElement.style.display = "flex";
    }
    
    close() {
        this.popUpElement.style.display = "none";
        this.userInputElement.value = "";
    }
}