/* Profile Page JavaScript */

"use strict";


document.getElementById('logoutButton').addEventListener('click', function () {
    logout();
});
document.getElementById('postForm').addEventListener('submit', submitPost);



function submitPost(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the post content from the textarea
    const postContent = document.getElementById('postContent').value.trim();

    if (postContent === '') {
        alert('Please enter some content for your post.');
        return;
    }

    // Call function to create post
    createPost(postContent);
}

function createPost(content) {
    const loginData = JSON.parse(localStorage.getItem('login-data')); // Assuming you have stored login data in localStorage

    const postData = {
        text: content,
    };


    fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', {
        method: "POST",
        body: JSON.stringify(postData),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
        },

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create post.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Post created successfully:', data);
            alert('Post created successfully!');

            window.location.href = '/posts.html'; // Redirect to posts page
        })
        .catch(error => {
            console.error('Error creating posts:', error);
        });
}