export class Form {
    // form elements
    login: string;
    password: string;

    // html elements
    private formElement: HTMLFormElement = document.querySelector("form")!;
    private loginElement: HTMLInputElement = document.querySelector("#form__login")!;
    private passwordElement: HTMLInputElement = document.querySelector("#form__password")!;

    // get elements
    get element(): HTMLFormElement {
        return this.formElement;
    }   
    
    get passwordField(): HTMLInputElement {
        return this.passwordElement;
    }
    // Constructor
    constructor() {}

    // Update
    update() {
        this.login = this.loginElement.value;
        this.password = this.passwordElement.value;
    }

    // get 
    getObject(): Object{
        return {
            login: this.login,
            password: this.password,
        }
    }


}