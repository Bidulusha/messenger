import { ObjectUI } from "../object_ui";

export interface PopUpUI extends ObjectUI {
    popUpElement: HTMLElement;

    show(): void;
    close(): void;
}