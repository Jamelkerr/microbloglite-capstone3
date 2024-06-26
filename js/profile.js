// Set the base URL for the MicroblogLite API
const API_URL = 'http://microbloglite.us-east-2.elasticbeanstalk.com';

// Run the code once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the token from local storage
  const token = localStorage.getItem('token');
  
  // If no token is found, redirect to the login page
  if (!token) {
    location.href = 'index.html';
    return;
  }

  // Add an event listener to the logout button
  document.getElementById('logout-button').addEventListener('click', logout);

  // Add an event listener to the create post form if it exists
  const createPostForm = document.getElementById('create-post-form');
  if (createPostForm) {
    createPostForm.addEventListener('submit', handleCreatePost);
  }

  // Fetch and display posts
  fetchPosts(token);
});

// Function to fetch and display posts
function fetchPosts(token) {
  fetch(`${API_URL}/posts`, {
    headers: { 'Authorization': `Bearer ${token}` } // Include the token in the request headers
  })
  .then(response => response.json()) // Parse the JSON response
  .then(posts => {
    // Get the container for displaying posts
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear previous posts
    
    // Iterate over the posts and create HTML elements for each post
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
        <h3>${post.username}</h3>
        <p>${post.text}</p>
        <small>${new Date(post.createdAt).toLocaleString()}</small>
      `;
      postsContainer.appendChild(postElement); // Append the post element to the container
    });
  })
  .catch(error => {
    // Log the error and display an error message if fetching posts fails
    console.error('Error fetching posts:', error);
    displayMessage('Error fetching posts. Please try again later.');
  });
}

// Function to handle post creation
function handleCreatePost(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const token = localStorage.getItem('token');
  const content = document.getElementById('post-content').value; // Get the post content from the input field

  // Send a POST request to create a new post
  fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
      'Authorization': `Bearer ${token}` // Include the token in the request headers
    },
    body: JSON.stringify({ text: content }) // Send the post content in the request body
  })
  .then(response => response.json()) // Parse the JSON response
  .then(post => {
    if (post.id) {
      document.getElementById('post-content').value = ''; // Clear the input field
      fetchPosts(token); // Refresh the posts list
    } else {
      displayMessage('Post creation failed');
    }
  })
  .catch(error => {
    // Log the error and display an error message if post creation fails
    console.error('Error:', error);
    displayMessage('Post creation failed. Please try again later.');
  });
}

// Function to handle user logout
function logout() {
  // Remove the token and username from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  
  // Redirect to the login page
  location.href = 'index.html';
}

// Function to display a message
function displayMessage(message) {
  // Get the message container element
  const messageContainer = document.getElementById('message');
  
  // Set the text content of the message container to the message
  messageContainer.textContent = message;
}
