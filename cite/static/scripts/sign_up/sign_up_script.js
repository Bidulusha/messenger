(() => {
  // ../constants.ts
  var BASE_URL = "http://localhost";
  var AUTH_API_URL = BASE_URL + ":8081";
  var CHAT_URL = BASE_URL + ":3000/chat";

  // form.ts
  var Form = class {
    // Constructor
    constructor() {
      // html elements
      this.formElement = document.querySelector("form");
      this.emailElement = document.querySelector("#form__email");
      this.loginElement = document.querySelector("#form__login");
      this.passwordElement = document.querySelector("#form__password");
      this.secondPasswordElement = document.querySelector("#form__second_password");
    }
    // get elements
    get form() {
      return this.formElement;
    }
    // Update
    update() {
      this.email = this.emailElement.value;
      this.login = this.loginElement.value;
      this.password = this.passwordElement.value;
    }
    // get 
    getObject() {
      return {
        email: this.email,
        login: this.login,
        password: this.password
      };
    }
  };

  // index.ts
  var signUpButton = document.querySelector(".button-sign-up button");
  var form = new Form();
  form.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      form.update();
      const respons = await fetch(
        AUTH_API_URL + "/api/auth/sign_up_auth",
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
        case "OK": {
          localStorage.setItem("user_id", result["user_id"]);
          localStorage.setItem("access_token", result["token"]);
          window.location.replace(CHAT_URL);
          break;
        }
        case "USER_ALREADY_EXISTS": {
          alert("\u0422\u0430\u043A\u043E\u0439 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442!");
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
})();
