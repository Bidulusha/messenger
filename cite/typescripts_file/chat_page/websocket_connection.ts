import { CHAT_WS_URL } from "../constants";

import {
    ArrayQueue,
    ConstantBackoff,
    Websocket,
    WebsocketBuilder,
    WebsocketEvent,
} from "websocket-ts";

export class WebsocketManager {

    private ws: Websocket;

    constructor () {
        this.ws = new WebsocketBuilder(CHAT_WS_URL)
            .withBuffer(new ArrayQueue())
            .withBackoff(new ConstantBackoff(1000))
            .build()
    }

    sendMessage(message: string){
        this.ws.send(message);
    }

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