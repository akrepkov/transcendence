# transcendence

**Node.js** lets to run JavaScript on the server. Without Node we can't handle user input or store data dynamically. If we want dynamic data, we'd need an actual backend (which JavaScript alone can't create without Node.js).
But.....without **Fastify** we can handle requests and return data. And no built-in routing, JSON parsing, or request validation.
Fastify is a framework that helps to build web servers easily using Node.js.

What is **routing**?
	Routing is the process of handling different URL requests in a web server:
		Return all users when a request is made to /users
		Return a specific user when a request is made to /users/:id
		Create a new user when a POST request is made to /users

What is **JSON Parsing**?
	When a client sends data to the backend using a POST request, the body is in JSON format. Without Fastify we would manually parse strings of data.
What is **request validation**?
	Instead of validating request with if... else .... statements, we can:
		const userSchema = {
			schema: {
				body: {
					type: "object",
					required: ["name"],
					properties: {
						name: { type: "string" }
					}
				}
			}
		};

There are two types of modules in JS (ways to import and export code): 
- Common JS
    const varName = require(locationName);
- ES modules (new way of im-/exporting)
    import varName from 'locationName' 


npm (node package manager) is the dependency/package manager you get out of the box when you install Node.js.
npx is also a CLI tool whose purpose is to make it easy to install and manage dependencies hosted in the npm registry.

### Start working:
Initialize a Node.js Project in the Folder:  npm init -y
npm install fastify@4
npm install @fastify/static@7 for working with html
npm install sqlite3 better-sqlite3 for working with a database

npm init -y && npm install fastify@4 && npm install @fastify/static@7 && npm install sqlite3 better-sqlite3 fastify-sqlite && npm install @fastify/websocket@10 && npm install bcrypt jsonwebtoken && npm install dotenv && npm install concurrently && npm install @fastify/cookie@^7.0.0

If you get : code: 'ERR_DLOPEN_FAILED'
npm rebuild better-sqlite3
npm rebuild bcrypt



 

npm install -g eslint
npx eslint --init
eslint check: npx eslint . 
<!-- If there is issue with global variables check eslint config file and change globals: globals.browser  to globals: globals.node  -->

Run the server: node index.js or npx nodemon index.js or npm start

**API stands for Application Programming Interface**, which is just a way for one software (e.g., your React app) to talk to another software (e.g., Fastify) using standard methods (like GET, POST). The API server takes requests from the frontend, processes them (by talking to databases, other services, or logic), and sends back responses. API: Canvas, MapTiles, Google Search, Youtube.


Using .env:

Step 1: Install dotenv with: npm install dotenv.

Step 2: Add require('dotenv').config() at the top of your entry file.

Step 3: Store your secret in .env as JWT_SECRET=your-secret-key.

Step 4: Access the secret using process.env.JWT_SECRET.

Step 5: Use the secret securely without hardcoding it in your code.




Exports:
🔹 Named Export
You're saying: “I’m exporting a function/variable/class with a name, and it must be imported with that exact name (or aliased).”

Example: old-utils.js
// Named export
export function handleError() {
  console.log("Handling error...");
}

Usage:
import { handleError } from './old-utils.js'; // ✅ Works
✔️ You must use {} and the exact name (handleError in this case).

You can also rename it:
import { handleError as customErrorHandler } from './old-utils.js';



🔹 Default Export
You're saying: “I’m exporting one main thing — import it without needing curly braces.”

Example: old-utils.js
// Default export
export default function handleError() {
  console.log("Handling error...");
}
Usage:
import handleError from './old-utils.js'; // ✅ Works — no curly braces!
✔️ You can name the import whatever you want, since it's the default.

import myCoolErrorHandler from './old-utils.js'; // also valid


✅ When to Use Each?
Use named exports when:

You have multiple exports from a file (add(), subtract(), handleError(), etc.).

Use default export when:

The file only exports one main thing (a class, or a single core function).







Operator	Purpose			Checks			Example			Result
=			Assignment		—	let 		x = 10			x is 10
==			Loose equality	Value			'5' == 5		true
===			Strict equality Value & Type	'5' === 5		false






Everyone must do: 

CSS
https://flukeout.github.io/
https://flexboxfroggy.com
https://cssgridgarden.com
https://codepen.io/pen