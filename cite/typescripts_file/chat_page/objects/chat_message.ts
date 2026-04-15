export class MessageContent {
    answer_to: number;
    forwarded_from: string;
    text_content: string;
    photo_content: string[];
    files: string[];

    constructor(
        answer_to: number,
        forwarded_from: string,
        text_content: string,
        photo_content: string[],
        files: string[],
    ) {
        this.answer_to = answer_to;
        this.forwarded_from = forwarded_from;
        this.text_content = text_content;
        this.photo_content = photo_content;
        this.files = files;
    }
    
}