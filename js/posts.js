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

  // Fetch the posts from the API
  fetch(`${API_URL}/posts`, {
    headers: { 'Authorization': `Bearer ${token}` } // Include the token in the request headers
  })
  .then(response => {
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Throw an error if the response is not ok
    }
    return response.json(); // Parse the JSON response
  })
  .then(posts => {
    // Get the container for displaying posts
    const postsContainer = document.getElementById('posts-container');
    
    // Iterate over the posts and create HTML elements for each post
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
        <h3>${post.author}</h3>
        <p>${post.content}</p>
        <small>${new Date(post.timestamp).toLocaleString()}</small>
      `;
      postsContainer.appendChild(postElement); // Append the post element to the container
    });
  })
  .catch(error => {
    // Log the error and display an error message if fetching posts fails
    console.error('Error fetching posts:', error);
    displayMessage('Error fetching posts. Please try again later.');
  });
});

// Add an event listener to the logout button
document.getElementById('logout-button').addEventListener('click', logout);

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
  
  // If the message container is found, set its text content to the message
  if (messageContainer) {
    messageContainer.textContent = message;
  } else {
    // Fallback: show an alert with the message if the container is not found
    alert(message);
  }
}
