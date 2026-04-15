import {
    ArrayQueue,
    ConstantBackoff,
    Websocket,
    WebsocketBuilder,
    WebsocketEvent,
} from "websocket-ts";

import { CHAT_WS_URL } from "../constants";
import { UserMessage, MessageType } from "./ws_messages/message";
import { AuthRequest } from "./ws_messages/message";
import { MessageContent } from "./objects/chat_message";
import { ChatMessages } from "./objects/chat_info";


export class WebsocketManager {

    private ws: Websocket;

    constructor () {
        this.ws = new WebsocketBuilder(CHAT_WS_URL)
            .withBuffer(new ArrayQueue())
            .withBackoff(new ConstantBackoff(1000))
            .build()
    }

    /*              MESSAGES                */
    // base message
    sendMessage(message: string){
        this.ws.send(message);
    }

    // start chat message
    startChatMessage(login: string) {
        this.ws.send(
            JSON.stringify(new UserMessage (
                MessageType.START_CHAT,
                login
            ))
        );
    }

    // Authorization message
    authorizationMessage(user_id: number, token: string) {
        this.ws.send(JSON.stringify(
            new UserMessage(
                MessageType.AUTH_CHECK,
                JSON.stringify(
                    new AuthRequest(
                        user_id,
                        token
                    )
                )
            )));
    }

    // Get chats message
    getChatsMessage() {
        this.ws.send(JSON.stringify(
            new UserMessage(
                MessageType.GET_CHATS,
                ""
            )
        ));
    }

    // Send message to user
    sendChatMessage(message: ChatMessages) {
        this.ws.send(JSON.stringify(
            new UserMessage(
                MessageType.SEND_MESSAGE,
                JSON.stringify(message)
            )
        ))
    }


    /*              LISTENERS              */
    addEventListeners(
        open: () => void,
        close: () => void,
        message: (i: Websocket, ev: MessageEvent) => void
    ) {
        this.ws.addEventListener(WebsocketEvent.open, open);
        this.ws.addEventListener(WebsocketEvent.close, close);
        this.ws.addEventListener(WebsocketEvent.message, message);
    }
}