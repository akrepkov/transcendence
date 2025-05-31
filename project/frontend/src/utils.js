function mainScript(event, tabName) {
  // Hide all tab contents
  var tabcontent = document.getElementsByClassName('tabcontent');
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Remove "active" class from all tab links
  var tablinks = document.getElementsByClassName('tablinks');
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  // Show the selected tab
  document.getElementById(tabName).style.display = 'block';

  // Add "active" class to clicked tab
  event.currentTarget.className += ' active';
  if (document.getElementById('Game').style.display === 'block' && tabName !== 'Game') {
    if (typeof stopPongGame === 'function') {
      stopPongGame();
    }
  }
  // Load game logic
  if (tabName === 'Game') {
    if (!document.querySelector('script[src="./pong.js"]')) {
      const scriptGame = document.createElement('script');
      scriptGame.src = './pong.js';
      scriptGame.onload = function () {
        startPongGame('Player 1', 'Player 2');
      };
      document.head.appendChild(scriptGame);
    } else {
      startPongGame('Player 1', 'Player 2');
    }
  }

  // Load chat logic
  if (tabName === 'Chat') {
    if (!document.querySelector('script[src="./chat.js"]')) {
      const scriptChat = document.createElement('script');
      scriptChat.src = './chat.js';
      scriptChat.onload = function () {
        startChat('Player 1', 'Player 2');
      };
      document.head.appendChild(scriptChat);
    } else {
      startChat('Player 1', 'Player 2');
    }
  }
}
