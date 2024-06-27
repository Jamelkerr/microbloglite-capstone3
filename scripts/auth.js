"use strict";

// Base URL for API requests
const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
// Backup server (mirror):   "https://microbloglite.onrender.com"
// const apiBaseURL = "https://microbloglite.onrender.com";

// NOTE: API documentation is available at /docs 
// For example: http://microbloglite.us-east-2.elasticbeanstalk.com/docs


// Function to retrieve login data from local storage
function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}


// Function to check if the user is logged in
function isLoggedIn() {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}


// Function to handle user login
function login(loginData) {
    // POST /auth/login endpoint
    const options = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify(loginData), // Convert login data to JSON string
    };

    return fetch(apiBaseURL + "/auth/login", options)
        .then(response => response.json())
        .then(loginData => {
            // Handle login response
            if (loginData.message === "Invalid username or password") {
                console.error(loginData);
                // Potential UI feedback for invalid login
                return null;
            }

            // Store login data in local storage
            window.localStorage.setItem("login-data", JSON.stringify(loginData));
            window.location.assign("/posts.html"); // Redirect to posts page

            return loginData;
        });
}


// Function to handle user logout
function logout() {
    const loginData = getLoginData();

    // GET /auth/logout endpoint
    const options = { 
        method: "GET",
        headers: { 
            Authorization: `Bearer ${loginData.token}`, // Include JWT token for authentication
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data)) // Log logout response data
        .finally(() => {
            // Cleanup: Remove login data from local storage
            window.localStorage.removeItem("login-data");
            // Redirect to landing page after logout
            window.location.assign("/");
        });
}
