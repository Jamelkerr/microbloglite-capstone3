"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
// Backup server (mirror): "https://microbloglite.onrender.com"

// Function to get login data from local storage
function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return loginJSON ? JSON.parse(loginJSON) : {};
}

// Function to check if user is logged in
function isLoggedIn() {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

// Function to fetch posts
async function getPostsApiCall() {
    try {
        const response = await fetch(apiBaseURL + "/api/posts", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getLoginData().token}`,
            },
        });
        return response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

// Function to create a post
async function createPostApiCall(postString) {
    const postJson = { text: postString };
    try {
        const response = await fetch(apiBaseURL + "/api/posts", {
            method: "POST",
            body: JSON.stringify(postJson),
            headers: {
                Authorization: `Bearer ${getLoginData().token}`,
                "Content-Type": "application/json; charset=UTF-8",
            },
        });
        return response.json();
    } catch (error) {
        console.error("Error creating post:", error);
    }
}

// Function to handle send button click
async function onSendButtonClick() {
    const postTextInput = document.getElementById("postTextInput");
    if (postTextInput.value.trim() !== "") {
        await createPostApiCall(postTextInput.value);
        postTextInput.value = "";
        const posts = await getPostsApiCall();
        populatePosts(posts);
    }
}

// Function to populate posts
function populatePosts(posts) {
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = ""; // Clear existing posts
    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
            <h3>${post.username}</h3>
            <p>${post.text}</p>
            <p><small>${new Date(post.createdAt).toLocaleString()}</small></p>
            <p>Likes: ${post.likes.length}</p>
        `;
        postsContainer.appendChild(postElement);
    });
    scrollToBottom(postsContainer);
}

// Function to scroll to bottom
function scrollToBottom(element) {
    requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight;
    });
}

// Function to handle filter dropdown change
async function onFilterDropdownChange() {
    let sortedData = await getPostsApiCall();
    const filterDropdown = document.getElementById("filterDropdown");
    switch (filterDropdown.value) {
        case "numberOfLikes":
            sortedData.sort((a, b) => b.likes.length - a.likes.length);
            break;
        case "timePostedAscending":
            sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case "timePostedDescending":
            sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    populatePosts(sortedData);
}

// Function to fetch users
async function getUsersAPICall() {
    try {
        const response = await fetch(apiBaseURL + "/api/users", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getLoginData().token}`,
            },
        });
        return response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// Function to logout user
function logout() {
    const loginData = getLoginData();
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            window.localStorage.removeItem("login-data");
            window.location.assign("/"); // Redirect to login page
        });
}

// Event listener setup
document.addEventListener("DOMContentLoaded", () => {
    if (!isLoggedIn()) {
        window.location.assign("/"); // Redirect to login page if not logged in
        return;
    }

    // Load posts on page load
    getPostsApiCall().then(posts => populatePosts(posts));

    // Set up event listener for send button
    const sendButton = document.getElementById("sendButton");
    if (sendButton) {
        sendButton.addEventListener("click", onSendButtonClick);
    }

    // Set up event listener for filter dropdown
    const filterDropdown = document.getElementById("filterDropdown");
    if (filterDropdown) {
        filterDropdown.addEventListener("change", onFilterDropdownChange);
    }

    // Set up event listener for logout button
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    // Enable sending post with Enter key
    const postTextInput = document.getElementById("postTextInput");
    if (postTextInput) {
        postTextInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                onSendButtonClick();
                event.preventDefault();
            }
        });
    }
});
