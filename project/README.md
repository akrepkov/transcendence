# Project Overview

This folder contains the main source code and configuration for the Transcendence web application. The project is organized as a full-stack app with a modular structure for maintainability and scalability.

## Structure

- **backend/**  
  Node.js backend using Fastify, handles API, authentication, database, and WebSocket multiplayer.
- **frontend/**  
  TypeScript/JavaScript SPA, handles UI, game rendering, and client logic.
- **init_files/**  
  Shell scripts for initializing Node, installing dependencies, and starting development/production servers.
- **Makefile**  
  Automates setup, linting, and running scripts for both frontend and backend.
- **packages.txt**  
  Central list of dependencies for both frontend and backend.
- **TODO.txt**  
  Development notes and pending tasks.
- **test/**  
  Test scripts and flowcharts for system architecture.
- **Theory/**  
  Documentation, troubleshooting, and design notes.

## Key Technologies

- **Backend:** Fastify, SQLite, Prisma, WebSocket, JWT, bcrypt, dotenv, ESLint, Prettier, Husky
- **Frontend:** TypeScript, Canvas API, TailwindCSS, SPA routing, WebSocket
- **DevOps:** Docker, NGINX, Makefile, shell scripts, GitHub Actions

## How Everything Connects

- The **frontend** communicates with the **backend** via REST API and WebSocket for real-time features.
- **NGINX** (see Docker setup) proxies requests and serves static assets.
- **Database** (SQLite via Prisma) stores users, games, and stats.
- **Shell scripts** in `init_files/` automate environment setup and dependency management.
- **Makefile** provides unified commands for setup, linting, and running the app.
- **ESLint/Prettier/Husky** enforce code quality and formatting.
- **Swagger UI** documents API endpoints (`/docs` route in backend).

## Getting Started

1. **Install dependencies:**  
   Run `make` in the root directory.
2. **Start development servers:**  
   Run `make dev` to launch both frontend and backend with live reload.
3. **Production build:**  
   Run `make production` for optimized deployment.
4. **Lint code:**  
   Run `make lint` or `make lint-fix` to check/fix code style.


# Frontend

This folder contains the client-side code for the Transcendence web application. The frontend is a single-page application (SPA) built with TypeScript/JavaScript, focusing on game rendering, UI, and client logic.

## Structure

- **src/**  
  Main source files: UI components, routing (`app.js`), game logic (`game.js`), input handlers (`controls.js`).
- **public/**  
  Static assets: `index.html`, `styles.css`, images, icons.
- **package.json**  
  Frontend dependencies and scripts.

## Key Technologies

- **TypeScript/JavaScript** for application logic
- **Canvas API** for game rendering
- **SPA Routing** via hash-based router (`app.js`)
- **WebSocket** for real-time multiplayer and chat
- **TailwindCSS** for styling (if used)
- **Fetch API** for RESTful communication with backend

## How It Works

- The SPA loads from `public/index.html` and uses `app.js` for routing.
- Game logic and rendering are handled in `game.js` using the Canvas API.
- User input is managed by `controls.js`.
- Communicates with backend via REST API and WebSocket for live features.

## Development

- Run `make dev` from the project root to start the frontend in development mode.
- Static files are served from `public/`.
- Update dependencies in `package.json` as needed.

# Backend

This folder contains the server-side code for the Transcendence web application. The backend is built with Node.js and Fastify, providing REST APIs, authentication, database access, and real-time multiplayer via WebSocket.

## Structure

- **controllers/**  
  Route handlers for API endpoints.
- **routes/**  
  API route definitions.
- **services/**  
  Business logic and database access.
- **websocket/**  
  WebSocket server and handlers.
- **prisma/**  
  Database schema and migrations (if using Prisma).
- **index.js**  
  Main entry point for the Fastify server.
- **.env**  
  Environment variables for configuration.

## Key Technologies

- **Fastify** for HTTP and WebSocket APIs
- **SQLite** (via Prisma or better-sqlite3) for persistent storage
- **JWT & bcrypt** for authentication
- **dotenv** for environment management
- **Swagger UI** for API documentation
- **ESLint, Prettier, Husky** for code quality

## How It Works

- Exposes REST API endpoints for frontend communication.
- Handles authentication, user management, and game state.
- Provides real-time features via WebSocket.
- Stores data in SQLite database.
- API documentation available at `/docs`.

## Development

- Run `make dev` from the project root to start the backend in development mode.
- Configure environment variables in `.env`.
- Update dependencies in `package.json` as needed.

## Useful Links

- [API Docs](http://localhost:3000/docs)
-