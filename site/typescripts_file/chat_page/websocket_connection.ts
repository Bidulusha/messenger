import {
    ArrayQueue,
    ConstantBackoff,
    ExponentialBackoff,
    Websocket,
    WebsocketBuilder,
    WebsocketEvent,
} from "websocket-ts";

import { CHAT_WS_URL } from "../constants";
import { UserMessage, MessageType } from "./ws_messages/message";
import { AuthRequest } from "./ws_messages/message";
import { ChatMessages, SendMessage } from "./objects/chat_message";
import { ChatsUserWithInfo } from "./objects/chats_user_with_info";
import { UserShortInfo } from "./objects/user_info";
import { RequestType } from "./objects/request_types";
import { ChatsInfo } from "./objects/chat_info";


export class WebsocketManager {

    private message_req = new Map<number, (value: UserMessage | null) => void>();
    private req_max_id: number = 0;
    private timeout: number = 5000;
    private ws: Websocket;

    constructor () {
        this.ws = new WebsocketBuilder(CHAT_WS_URL)
            .withBuffer(new ArrayQueue())
            .withBackoff(new ExponentialBackoff(1000, 6))
            .build();
        
        this.ws.addEventListener(WebsocketEvent.message, (i, ev) => {
            try {
                const req: UserMessage = Object.assign(new UserMessage, JSON.parse(ev.data));
                const req_handler = this.message_req.get(req.req_id);
                
                if (req_handler == null) throw "Req id not found!";
                req_handler(req);
            } catch (error) { console.error(error);}
        });
    }

    /*              MESSAGES                */
    // Send message with request as promise
    private sendMessageRequest(message_type: MessageType, content: any): Promise <UserMessage | null>{
        this.ws.send(
            JSON.stringify(
                new UserMessage(
                    this.req_max_id,
                    message_type, 
                    content
            )
        ));

        return new Promise<UserMessage | null>((resolve) => {
            this.message_req.set(this.req_max_id, resolve);
            this.req_max_id = (this.req_max_id + 1) % 10000;

            setTimeout(() => {
                resolve(null);
            }, this.timeout);;
        });
    }

    // New chat getter
    async getNewChats(): Promise <UserMessage | null> {
        return new Promise((resolve) => {
            this.message_req.set(RequestType.START_CHAT, resolve);
        });
    }

    // Message getter 
    async getMessage(): Promise <UserMessage | null> {
        return new Promise((resolve) => {
            this.message_req.set(RequestType.SEND_MESSAGE, resolve);
        })
    }

    // Create new chat
    async createNewChat(avatar: string, chat_name: string, members: number[]): Promise <ChatsUserWithInfo | null> {
        const req = await this.sendMessageRequest(
            MessageType.CREATE_CHAT,
            JSON.stringify(new ChatsInfo(
                -1,
                avatar,
                chat_name,
                members
            ))
        );

        if (req == null) return null;
        return Object.assign(new ChatsUserWithInfo(), JSON.parse(req.content));
    }

    // Authorization message
    async authorizationMessage(user_id: number, token: string): Promise<boolean> {
        const req = await this.sendMessageRequest(
            MessageType.AUTH_CHECK, 
            JSON.stringify(
            new AuthRequest(
                user_id,
                token
            )));
        
        if (req != null && req['content'] == "ACCESS_ALLOWED") return true;
        else return false;
    }

    // Get chats message
    async getChatsMessage(): Promise<ChatsUserWithInfo[]> {
        const req = await this.sendMessageRequest(MessageType.GET_CHATS, "");

        if (req != null){
            if (req.content == "USER_NOT_FOUND") return [];
            const chats: ChatsUserWithInfo[] = JSON.parse(req.content);
            console.log(chats);
            chats.forEach((chat, index) => {
                chat = Object.assign(new ChatsUserWithInfo(), chat);
            });
            return chats;
        }
        else {
            return [];
        }
    }

    // Get user info
    async getUserInfo(user_id: number): Promise<UserShortInfo | null> {
        const req = await this.sendMessageRequest(MessageType.USER_SHORT_INFO, user_id.toString());

        if (req != null && req.content != "USER_NOT_FOUND") {
            return Object.assign(new UserShortInfo(), JSON.parse(req.content));
        }
        return null;
    }

    async getUserByLogin(login: string): Promise<UserShortInfo | null> {
        const req = await this.sendMessageRequest(MessageType.USER_SHORT_INFO, login);
        if (req == null) return null;
        if (req.content == "USER_NOT_FOUND") return null;
        
        return Object.assign(new UserShortInfo, JSON.parse(req.content));
    }

    // Open chat message
    async openChatMessage(chat_id: number): Promise<ChatMessages[] | null> { 
        const req = await this.sendMessageRequest(MessageType.OPEN_CHAT, chat_id.toString());

        if (req == null) return null;
        const chat_messages: ChatMessages[] = JSON.parse(req.content);
        chat_messages.forEach((value, key) => {
            value = Object.assign(new ChatMessages, value);
        });

        return chat_messages;
    }

    // Send message to user
    async sendChatMessage(message: SendMessage): Promise<number | string | null> {
        const req = await this.sendMessageRequest(MessageType.SEND_MESSAGE, JSON.stringify(message));

        if (req == null) return null;
        if (req.content == "Ok") return "Ok";
        return Number.parseInt(req.content);
    }

    // DELETE ACCOUNT
    async sendDeleteAccount() {
        await this.sendMessageRequest(MessageType.DELETE_ACCOUNT, "");
    }
}