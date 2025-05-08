export function openChatTab() {
    const socket = new WebSocket('wss://congenial-system-x76557wwgx93px46-3000.app.github.dev/ws/chat');
    // For using outside codespaces:
    // const socket = new WebSocket('ws://127.0.0.1:3000/ws');
  
  
  
    // When the connection is opened
    socket.onopen = function() {
      console.log('Connected to WebSocket server!');
    };
  
    // When a message is received from the server
    socket.onmessage = function(event) {
      console.log('Message from server:', event.data);
      displayMessage('Server: ' + event.data); // Display the server message
    };
  
    // When the WebSocket encounters an error
    socket.onerror = function(error) {
      console.error('WebSocket Error:', error);
    };
  
    // When the connection is closed
    socket.onclose = function() {
      console.log('Connection closed');
    };
  
    // Function to display messages in the chat window
    function displayMessage(message) {
      const messagesDiv = document.getElementById('messages');
      messagesDiv.innerHTML += `<p>${message}</p>`;
      messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
    }
  
    // Send a message to the WebSocket server when the button is clicked
    document.getElementById('sendBtn').addEventListener('click', function() {
      const messageInput = document.getElementById('messageInput');
      const message = messageInput.value.trim();
      
      if (message && socket.readyState === WebSocket.OPEN) {
        // Send the message to the server
        socket.send(message);
        
        // Display the sent message in the chat window
        displayMessage('You: ' + message);
        
        // Clear the input field
        messageInput.value = '';
      }
    });
  
    // Optionally, allow sending a message by pressing "Enter" on the keyboard
    document.getElementById('messageInput').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        document.getElementById('sendBtn').click();
      }
    });
  }