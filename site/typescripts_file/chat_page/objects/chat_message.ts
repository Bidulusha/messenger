import { Time } from "../objects/time";

export class MessageContent {
    answer_to: number;
    forwarded_from: number;
    text_content: string;
    photos_content: string[];
    files: string[];

    constructor(
        answer_to: number | void,
        forwarded_from: number | void,
        text_content: string | void,
        photos_content: string[] | void,
        files: string[] | void,
    ) {
        if (typeof answer_to != (typeof text_content)) {
            this.answer_to = answer_to!;
            this.forwarded_from = forwarded_from!;
            this.text_content = text_content!;
            this.photos_content = photos_content!;
            this.files = files!;
        }
    }
    
}

export class ChatMessages { 
    id: number;
    who_sended: number;
    send_time: String;
    content: MessageContent;

    constructor(
        id: number | void,
        who_sended: number | void,
        send_time: Time | void,
        content: MessageContent | void,
    ) {
        if ((typeof id) != (typeof send_time)){
            this.id = id!;
            this.who_sended = who_sended!;
            this.send_time = send_time!.hmsTime;
            this.content = content!;
        }
    }
}

export class SendMessage {
    id_to: number;
    what: MessageContent;

    constructor(
        id_to: number,
        what: MessageContent
    ) {
        this.id_to = id_to;
        this.what = what;
    }
}