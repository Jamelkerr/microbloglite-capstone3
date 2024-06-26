"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
// Backup server (mirror): "https://microbloglite.onrender.com"

// NOTE: API documentation is available at /docs 
// For example: http://microbloglite.us-east-2.elasticbeanstalk.com/docs

// You can use this function to get the login data of the logged-in
// user (if any). It returns either an object including the username
// and token, or an empty object if the visitor is not logged in.
function getLoginData () {
    const loginJSON = window.localStorage.getItem("login-data");
    return loginJSON ? JSON.parse(loginJSON) : {};
}

// You can use this function to see whether the current visitor is
// logged in. It returns either `true` or `false`.
function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

// This function is already being used in the starter code for the
// landing page, in order to process a user's login. READ this code,
// and feel free to re-use parts of it for other `fetch()` requests
// you may need to write.
function login (loginData) {
    // POST /auth/login
    const options = { 
        method: "POST",
        headers: {
            // This header specifies the type of content we're sending.
            // This is required for endpoints expecting us to send
            // JSON data.
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    };

    return fetch(apiBaseURL + "/auth/login", options)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || "Login failed");
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.message === "Invalid username or password") {
                console.error(data);
                document.querySelector("#message").innerHTML = "***Invalid username or password***";
                return null;
            }

            window.localStorage.setItem("login-data", JSON.stringify(data));
            window.location.assign("/posts");  // redirect

            return data;
        })
        .catch(error => {
            console.error("Error during login:", error);
            document.querySelector("#message").innerHTML = "***Login error: " + error.message + "***";
        });
}

// Add an event listener to the login form
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        login({ username, password });
    });
});
