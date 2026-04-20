export class Form {
    // form elements
    email: string;
    login: string;
    password: string;

    // html elements
    private formElement: HTMLFormElement = document.querySelector("form")!;
    private emailElement: HTMLInputElement = document.querySelector("#form__email")!;
    private loginElement: HTMLInputElement = document.querySelector("#form__login")!;
    private passwordElement: HTMLInputElement = document.querySelector("#form__password")!;
    private secondPasswordElement: HTMLInputElement = document.querySelector("#form__second_password")!;

    // get elements
    get element(): HTMLFormElement {
        return this.formElement;
    }   
    
    // Constructor
    constructor() {}

    // Update
    update() {
        this.email = this.emailElement.value;
        this.login = this.loginElement.value;
        this.password = this.passwordElement.value;
    }

    // get 
    getObject(): Object{
        return {
            email: this.email,
            login: this.login,
            password: this.password,
        }
    }


}