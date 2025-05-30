// import { setupTabs } from "./main.js";
import {avatarHandler } from "./avatar.js"
import AuthManager from "../managers/authManager.js";
import { logIntoDatabase, signupInDatabase, logout } from "./authRequests.js";


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

	const defaultAvatar = document.getElementById("defaultAvatar");
	
	
	// Show profile if already logged in
	if (AuthManager.isLoggedIn()) {
		document.querySelectorAll("a[data-requires-auth='true']").forEach(link => {
			link.style.display = "block";
		});
		flipCard.classList.add("flipped");
		flipCard.style.display = "block";
		openProfileCard();
	}
	else {
		document.querySelectorAll("a[data-requires-auth='true']").forEach(link => {
			link.style.display = "none";
		});
		flipCard.classList.remove("flipped");//add here block???????????????????
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

export function openProfileCard() {
	defaultAvatar.src = "";
	// console.log("defaultAvatar: ", defaultAvatar);
	avatarHandler();
}
