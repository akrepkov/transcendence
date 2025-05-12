const tabs = {
  home(){
    showView("home")
    console.log("Home");
  },
  game() {
    showView("game")
    console.log("game");
  },
  newPage() {
    showView("newPage")
    console.log("new");
  }
}

let currentTab = ""

function showView(tabName){
  const view = document.getElementById(`view-${tabName}`);
  if (view) {
    view.style.display="block";
  }
}

function tabChange() {
  const hash = window.location.hash.replace("#","") || "home";
  console.log(hash);
 if (hash !== currentTab) {
    currentTab = hash;
    if (tabs[hash]) {
      tabs[hash]();
    }
  }
}

window.addEventListener("hashchange", tabChange)
window.addEventListener("load", tabChange);
