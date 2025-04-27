import { openProfileTab } from './profile.js';
import { openGameTab } from './game.js';
import { openChatTab } from './chat.js';
import { openTournamentTab } from './tournament.js';
import { setupAuth } from './auth.js';
import { openTestTab } from './test.js';
import { openRemoteTab } from './remote.js';
import {openSnakeTab} from './snake.js';


let user = null
let isLoggedIn = false;
let snakeOn = false
let currentTab = null;
/**
 * Sets up tab functionality for the webpage.
 * When a tab button is clicked, it hides all tab contents and shows the corresponding content.
 * @returns {void}
 */

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tablinks'); //array
    const tabContents = document.querySelectorAll('.tabcontent'); //array
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => { //run it after click
            const tabName = button.dataset.tab;
            // if (currentTab === 'Snake' && tabName !== 'Snake') {
            //     pauseSnakeGame();
            // }
            //Hide all tab contents
            tabContents.forEach(tab => {
                tab.style.display = 'none';
            });
            //Remove "active" class from all tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            const activeTab = document.getElementById(tabName);
            if (activeTab) {
                activeTab.style.display = 'block';
            }
            //Add "active" class to the clicked button
            button.classList.add('active');
            currentTab = tabName;
            if (tabName === 'Profile') {
                openProfileTab();
            }
            if (tabName === 'Game') {
                openGameTab();
            }
            if (tabName === 'Chat') {
                openChatTab();
            }
            if (tabName === 'Tournament') {
                openTournamentTab();
            }
            if (tabName === 'TestGame') {
                openTestTab()
            }
            if (tabName === 'Remote') {
                openRemoteTab();
            }
            if (tabName === 'Snake') {
                snakeOn = openSnakeTab();
            }
        });
    });
}



window.onload = async function () {
    console.log('Page loaded');

    //Adding test.html
    const response = await fetch('test.html');
    const html = await response.text();
    document.getElementById('TestGame').innerHTML = html;
    //Adding game.html
    const responseRemote = await fetch('remote.html');   
    const htmlRemote = await responseRemote.text();
    document.getElementById('Remote').innerHTML = htmlRemote;
    //Adding snake.html
    const responseSnake = await fetch('snake.html');   
    const htmlSnake = await responseSnake.text();
    document.getElementById('Snake').innerHTML = htmlSnake;
    
    //setup default tab
    // const defaultTab = document.querySelector('.tablinks[data-tab="Game"]');
    // defaultTab.click();
    setupTabs();
};



// This function creates tabbed navigation on a webpage. When you click a tab button (like “Game” or “Profile”), it:
// Hides all other tab contents.
// Highlights the clicked tab button.
// Displays only the corresponding tab content.
/*
- `document.querySelectorAll()` finds **all HTML elements** that match the selector (like `.tablinks` or `.tabcontent`) and returns a **NodeList** (like an array).
- So now you have:
  - `tabButtons`: all the `<button>` elements used to switch tabs.
  - `tabContents`: all the `<div>` sections that hold tab content (hidden/shown dynamically).
  */





/*
What is dataset?
dataset is a special property in JavaScript that lets you access custom attributes in your HTML that start with data-.

🔸 Example:

<button data-tab="Profile">Profile</button>
This button has a custom attribute: data-tab="Profile"


const button = document.querySelector('button');
console.log(button.dataset.tab); // Output: "Profile"
button.dataset.tab gets the value of data-tab

You can treat dataset like an object with keys based on your data-* attributes
*/