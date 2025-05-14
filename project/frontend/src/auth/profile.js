// import { setupTabs } from "./main.js";
import {uploadAvatar } from "./avatar.js"
import AuthManager from "../managers/authManager.js";
import { logIntoDatabase, signupInDatabase, logout } from "./authRequests.js";

export function openProfileCard() {
	uploadAvatar();
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

	if (flipToProfileBtnLog) {
		logIntoDatabase();
	}

	if (flipToProfileBtnSign) {
		signupInDatabase();
	}

	if (logoutBtn) {
		logout();
	}


}
