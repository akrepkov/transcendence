// import { setupTabs } from "./main.js";
import {uploadAvatar } from "./avatar.js"
import AuthManager from "./managers/authManager.js";

let email = {};
let password = {};
let username = {};


function openProfileCard() {
	uploadAvatar();
	console.log ("Ïn profile");
}

export async function openProfileTab() {
	const signup = document.getElementById("signupTest");
	const login = document.getElementById("loginTest");
	const flipCard = document.getElementById("flipCard");

	const showLoginBtn = document.getElementById("showLoginBtn");
	const showSignupBtn = document.getElementById("showSignupBtn");
	const flipToProfileBtnLog = document.getElementById("flipToProfileBtnLog");
	const flipToProfileBtnSign = document.getElementById("flipToProfileBtnSign");
	const logoutBtn = document.getElementById("logoutBtn");

	const loginWarning = document.getElementById("loginWarning"); //?????
	const emailInput = document.getElementById("emailInput");
	const passwordInput = document.getElementById("passwordInput");

	const emailInputSign = document.getElementById("emailInputSign");
	const passwordInputSign = document.getElementById("passwordInputSign");
	const usernameInputSign = document.getElementById("usernameInputSign");

	// Show profile if already logged in
	if (AuthManager.isLoggedIn()) {
		// console.log('User is logged in profile.js');
		flipCard.classList.add("flipped");
		flipCard.style.display = "block";
		openProfileCard();
	}

	//This is for choosing between login and signup
	if (showLoginBtn) {
		showLoginBtn.addEventListener('click', () => {
			login.style.display = "flex";
			signup.style.display = "none";
		});
	}
	if (showSignupBtn) {
		showSignupBtn.addEventListener('click', () => {
			login.style.display = "none";
			signup.style.display = "flex";
		});
	}

	//LOGIN
	if (flipToProfileBtnLog) {
		flipToProfileBtnLog.addEventListener('click', async (event) => {
			event.preventDefault();
			email = emailInput.value;
			password = passwordInput.value;
			try {
				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email, password }),
					credentials: 'include' // Include cookies in the request
				});
				if (!response.ok) {
					loginWarning.style.display = "block";
					setTimeout(() => { loginWarning.style.display = "none" }, 3000);
					console.log('Login failed:', response.statusText);
					return;
				}
				const data = await response.json();
				console.log ("I FLIP HERE")
				flipCard.classList.add("flipped");
				AuthManager.login(data.username);
				// setupTabs();
				openProfileCard();
			} catch (error) {
				console.error('Error:', error);
			}
		});
	}
	//SIGNUP
	if (flipToProfileBtnSign) {
		flipToProfileBtnSign.addEventListener('click', async (event) => {
			event.preventDefault();
			email = emailInputSign.value;
			password = passwordInputSign.value;
			username = usernameInputSign.value;
			try {
				const response = await fetch('/api/auth/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email, password, username }),
					credentials: 'include' // Include cookies in the request
				});
				if (!response.ok) {
					loginWarning.style.display = "block";
					setTimeout(() => { loginWarning.style.display = "none" }, 3000);
					return;
				}
				const data = await response.json();
				flipCard.classList.add("flipped");
				AuthManager.login(data.username);
				// setupTabs();
				openProfileCard();
			} catch (error) {
				console.error('Error:', error);
			}
		});
	}

	//LOGOUT
	if (logoutBtn) {
		logoutBtn.addEventListener('click', (event) => {
			event.preventDefault();
			fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include'
			})
				.then(response => {
					if (response.ok) {
						AuthManager.logout();
						console.log('User logged out');
						flipCard.classList.remove("flipped");
						// setupTabs();
					} else {
						console.error('Logout failed:', response.statusText);
					}
				})
		});
	}


}
