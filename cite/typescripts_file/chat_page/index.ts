import { Websocket } from "websocket-ts";
import { SIGN_IN_URL } from "../constants";
import { SidebarUI } from "./ui_objects/sidebar";
import { WebsocketManager } from "./websocket_connection";
import { Message } from "./ws_messages/message";

const token: string | null = localStorage.getItem("access_token");
const wsManager = new WebsocketManager();


if (token != null) {
    wsManager.addEventListeners(
        () => {console.log("Open connection!"); wsManager.sendMessage("Halo wordl?");},
        () => {console.log("Close connection!")},
        (i: Websocket, ev: MessageEvent) => {
            i.send("Halo?");
        }
    )
    
    
}
else {
    window.location.replace(SIGN_IN_URL);
}

let sidebar = new SidebarUI();
sidebar.show();