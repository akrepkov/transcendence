import AuthManager from '../managers/authManager.js';
import { openProfileCard } from "./profile.js";



let email = {};
let password = {};
let username = {};

export const verifyLogin = async () => {
	console.log('Verifying login status...');
	try {
		const response = await fetch('/api/auth/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include' // Include cookies in the request
		});
		if (response.ok) {
			const data = await response.json();
			console.log('User data:', data);
			AuthManager.login(data.username);
			// console.log('User is logged in:', AuthManager.getUsername());
		}
	} catch (err) {
		AuthManager.logout();
		console.log('User is not logged in');
	}
};

/*
When you define the logIntoDatabase function and register an event listener 
with flipToProfileBtnLog.addEventListener(...), this event listener "remembers" 
the scope in which it was defined. This is called a closure.
*/

export function logIntoDatabase() {
	flipToProfileBtnLog.addEventListener('click', async (event) => {
		event.preventDefault();
		email = emailInput.value;
		password = passwordInput.value;
		console.log("email: ", email);
		console.log("password: ", password);
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

export function signupInDatabase() {
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
			openProfileCard();
		} catch (error) {
			console.error('Error:', error);
		}
	});
}

export function logout() {
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