(() => {
  // constants.ts
  var PROTOCOL = "http://";
  var DOMEN = "localhost";
  var BASE_URL = PROTOCOL + DOMEN;
  var WS_URL = "ws://" + DOMEN;
  var STATIC_URL = "/static";
  var AVATARS_URL = STATIC_URL + "/images/avatars/";
  var AUTH_API_URL = BASE_URL + ":8081";
  var CHAT_URL = BASE_URL + ":3000/chat";
  var SIGN_IN_URL = BASE_URL + ":3000/sign_in";
  var CHAT_WS_URL = WS_URL + ":8080/api/chat_ws";

  // sign_in/form.ts
  var Form = class {
    // Constructor
    constructor() {
      // html elements
      this.formElement = document.querySelector("form");
      this.loginElement = document.querySelector("#form__login");
      this.passwordElement = document.querySelector("#form__password");
    }
    // get elements
    get element() {
      return this.formElement;
    }
    get passwordField() {
      return this.passwordElement;
    }
    // Update
    update() {
      this.login = this.loginElement.value;
      this.password = this.passwordElement.value;
    }
    // get 
    getObject() {
      return {
        login: this.login,
        password: this.password
      };
    }
  };

  // sign_in/index.ts
  var signUpButton = document.querySelector(".button-sign-in button");
  var form = new Form();
  if (localStorage.getItem("access_token") != null) {
    window.location.replace(CHAT_URL);
  }
  form.element.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      form.update();
      console.log(JSON.stringify(form.getObject()));
      const respons = await fetch(
        AUTH_API_URL + "/api/auth/sign_in_auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form.getObject())
        }
      );
      if (!respons.ok) {
        throw new Error(`Response status: ${respons.status}`);
      }
      const result = await respons.json();
      switch (result["status_code"]) {
        case "ACCESS_ALLOWED": {
          localStorage.setItem("user_id", result["user_id"]);
          localStorage.setItem("access_token", result["token"]);
          window.location.replace(CHAT_URL);
          break;
        }
        case "USER_NOT_FOUND": {
          alert("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D!");
          break;
        }
        case "SIGNIN_DATA_ERROR": {
          alert("\u041D\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C!");
          form.passwordField.value = "";
          break;
        }
        case "ERR": {
          alert("\u041D\u0435\u043F\u0440\u0435\u0434\u0432\u0438\u0434\u0435\u043D\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430!");
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
})();
