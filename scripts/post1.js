/* Posts Page JavaScript */

"use strict";


const postCards = document.getElementById("postCards");


document.getElementById('logoutButton').addEventListener('click', function () {
    logout();
});
window.onload = function () {
    fetchPosts();
};


function fetchPosts() {
    fetch("http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${JSON.parse(window.localStorage.getItem("login-data")).token}`,
        },
    })
        .then(response => response.json())
        .then(posts => {
            console.log("Posts:", posts); // Optional: Log fetched posts
            posts.forEach(post => {
                postCards.appendChild(createPostCard(post));
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
}

// function createPostCard(post) {
//     let cardDiv = document.createElement("div");
//     cardDiv.className = "card text-center mb-4";
    

//     let cardHeader = document.createElement("div");
//     cardHeader.className = "card-header bg-warning text-white";
//     cardHeader.innerHTML = formatTimestamp(post.createdAt); 
//     cardDiv.appendChild(cardHeader);

//     let cardBody = document.createElement("div");
//     cardBody.className = "card-body";
//     cardDiv.appendChild(cardBody);

//     let bodyHeading = document.createElement("h5");
//     bodyHeading.className = "card-title"
//     bodyHeading.innerHTML = post.username; /
//     cardBody.appendChild(bodyHeading);

//     let bodyPara = document.createElement("p");
//     bodyPara.className = "card-text";
//     bodyPara.innerHTML = post.text 
//     cardBody.appendChild(bodyPara);

//     let cardFooter = document.createElement("div");
//     cardFooter.className = "card-footer bg-light text-muted";

//     let thumbsUp = document.createElement("i");
//     thumbsUp.className = "fas fa-thumbs-up"

//     cardFooter.appendChild(thumbsUp);
//     cardDiv.appendChild(cardFooter);

//     return cardDiv;


// }

function createPostCard(post) {
    // Create main card element
    let cardDiv = document.createElement("div");
    cardDiv.className = "col-lg-6 col-md-8 mb-4";

    // Create card element
    let card = document.createElement("div");
    card.className = "card";

    // Card header
    let cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    // Avatar
    let avatarImg = document.createElement("img");
    avatarImg.src = "https://picsum.photos/200/300";
    avatarImg.alt = "Avatar";
    avatarImg.className = "rounded-circle me-2";
    avatarImg.style.width = "30px";
    avatarImg.style.height = "30px";
    cardHeader.appendChild(avatarImg);

    // Username
    let usernameSpan = document.createElement("span");
    usernameSpan.textContent = post.username;
    cardHeader.appendChild(usernameSpan);

    // Timestamp
    let timestampSpan = document.createElement("span");
    timestampSpan.textContent = formatTimestamp(post.createdAt);
    timestampSpan.className = "float-end";
    cardHeader.appendChild(timestampSpan);

    card.appendChild(cardHeader);

    // Card body
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Post text
    let postText = document.createElement("p");
    postText.className = "card-text";
    postText.textContent = post.text;
    cardBody.appendChild(postText);

    card.appendChild(cardBody);

    // Card footer
    let cardFooter = document.createElement("div");
    cardFooter.className = "card-footer bg-light";

    // Like button
    let likeButton = document.createElement("button");
    likeButton.className = "btn btn-sm btn-outline-primary";
    likeButton.innerHTML = '<i class="fas fa-thumbs-up me-1"></i> Like';
    cardFooter.appendChild(likeButton);

    // Comment button
    let commentButton = document.createElement("button");
    commentButton.className = "btn btn-sm btn-outline-secondary";
    commentButton.innerHTML = '<i class="fas fa-comment me-1"></i> Comment';
    cardFooter.appendChild(commentButton);

    card.appendChild(cardFooter);

    cardDiv.appendChild(card);

    return cardDiv;
}



function formatTimestamp(timestamp) {
    const date = new Date(timestamp); // Create a Date object from the timestamp string
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}