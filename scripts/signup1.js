"use strict"

const signUpBtn = document.getElementById("signUpBtn");

window.onload = function () {
    signUpBtn.onclick = signUpBtnClicked;
}

function signUpBtnClicked() {
    console.log("test");
    let usernameInput = document.getElementById("username");
    let fullNameInput = document.getElementById("fullName");
    let passwordInput = document.getElementById("password");

    let bodyData = {
        username: usernameInput.value,
        fullName: fullNameInput.value,
        password: passwordInput.value,
    }

    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/users", {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
            "Content-type":
                "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let messagePara =
                document.getElementById("messagePara");
            messagePara.className = "container text-center text-danger message-style"
            messagePara.innerHTML = "***New Account Created***<br>Click <a href='/index.html'>here</a> to log in.";

            // Clear input fields after account creation
            usernameInput.value = "";
            fullNameInput.value = "";
            passwordInput.value = "";

        })
        .catch(error => {
            console.error('Error cant create account:', error);
           
        });

}