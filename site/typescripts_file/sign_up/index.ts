import { AUTH_API_URL, CHAT_URL } from "../constants";
import { Form } from "./form";

const signUpButton: HTMLButtonElement | undefined = document.querySelector(".button-sign-up button")!;
const form = new Form();

form.element.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    try{
        form.update();
        const respons = await fetch(
            AUTH_API_URL + "/api/auth/sign_up_auth",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form.getObject())
            }
        );
        if (!respons.ok) {
            throw new Error(`Response status: ${respons.status}`);
        }

        const result = await respons.json();
        switch(result["status_code"]){
            case "OK": {
                localStorage.setItem("user_id", result["user_id"]);
                localStorage.setItem("access_token", result["token"]);

                window.location.replace(CHAT_URL);
                break;
            }
            case "USER_ALREADY_EXISTS": {
                alert("Такой пользователь уже существует!");
                break;
            }
        }        
    }catch (error) {
        console.error(error);
    }
});