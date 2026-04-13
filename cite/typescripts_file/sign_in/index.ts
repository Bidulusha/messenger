import { AUTH_API_URL, CHAT_URL } from "../constants";
import { Form } from "./form";

const signUpButton: HTMLButtonElement | undefined = document.querySelector(".button-sign-in button")!;
const form = new Form();

form.element.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    try{
        form.update();
        console.log(JSON.stringify(form.getObject()));
        const respons = await fetch(
            AUTH_API_URL + "/api/auth/sign_in_auth",
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
            case "ACCESS_ALLOWED": {
                localStorage.setItem("user_id", result["user_id"]);
                localStorage.setItem("access_token", result["token"]);

                alert(result["user_id"]);
                window.location.replace(CHAT_URL);
                break;
            }
            case "USER_NOT_FOUND" : {
                alert("Пользователь не найден!");
                break;
            }
            case "SIGNIN_DATA_ERROR": {
                alert("Не правильный логин или пароль!");
                form.passwordField.value = "";
                break;
            }
            case "ERR": {
                alert("Непредвиденная ошибка!");
                break;
            }
        }        
    }catch (error) {
        console.error(error);
    }
});