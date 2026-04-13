import { Websocket } from "websocket-ts";
import { SIGN_IN_URL } from "../constants";
import { SidebarUI } from "./ui_objects/sidebar";
import { WebsocketManager } from "./websocket_connection";
import { AuthRequest, MessageType, UserMessage } from "./ws_messages/message";

const token: string | null = localStorage.getItem("access_token");
const wsManager = new WebsocketManager();


if (token != null) {
    wsManager.addEventListeners(
        () => {
            console.log("Open connection!"); 
            // Authorize user
            const msg = new UserMessage(
                MessageType.AUTH_CHECK,
                JSON.stringify(
                    new AuthRequest(
                        parseInt(localStorage.getItem("user_id")!),
                        localStorage.getItem("access_token")!
                    )
                )
            )
            wsManager.sendMessage(JSON.stringify(msg));
        },
        () => {console.log("Close connection!")},
        (i: Websocket, ev: MessageEvent) => {
            try {
                const ans = JSON.parse(ev.data);
                switch (ans["message_type"]) {
                    case MessageType.AUTH_CHECK: {
                        if (ans["content"] == "ACCESS_DENIED"){
                            localStorage.removeItem("token");
                            localStorage.removeItem("user_id");
                            window.location.replace("/sign_in");
                        }
                        else {
                            console.log("Access to user allowed!");
                        }
                        break;
                    }
                }
            } catch (error) {
                console.log("Server message: ", ev.data);
            }
        }
    )
}
else {
    window.location.replace(SIGN_IN_URL);
}

let sidebar = new SidebarUI();
sidebar.show();