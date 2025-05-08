const routes = {
    home: function() {
      showView('home');
    },
    practice: function() {
      showView('practice');
      console.log("Practice started");
    },
    tournament: function() {
      showView('tournament');
      console.log("Tournament started");
    }
  };
  
  let currentRoute = '';
  
  function showView(viewId) {
    document.querySelectorAll('.tab-view').forEach(el => {
      el.style.display = 'none';
    });
  
    const view = document.getElementById(`view-${viewId}`);
    if (view) view.style.display = 'block';
  }
  
  function router() {
    const hash = window.location.hash.replace('#', '') || 'home';
  
    if (hash !== currentRoute) {
      if (currentRoute === 'practice') {
        console.log("Practice stopped");
        // handleStopGame();
      }
      currentRoute = hash;
      if (routes[hash]) {
        routes[hash]();
      } else {
        showView('home');
      }
    }
  }
  
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
  