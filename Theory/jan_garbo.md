so npx is just a way of running things without having to download specific packages
we use it for running nodemon which allows us not to download nodemon itself and just have it on our system temporarily and then deleted after

So the "type": "module"; thingie should be used to tell Node that our project is module based, not base don CommonJS, which is the old way of doing things
This makes sure thing slike import work and Node doesnt complain about them

run npx depcheck to see which dependencies are unused


 <!-- while read -r word; do
        grep -qF "$word" package.json || echo "$word"
    done <<< "$ALL_DEPENDENCIES" -->


Apparently bcrypt sucks?

so API is just a way to communicate between client and server, also to have the server start some internal functions, store things etc.
So f.e. the API request something, once it gets that information it will process it a certain way. Like a name of a person and a date, then the server processes their timesheet and teels you how much they worked that day

so how would a server call its own things, ergo a tournament needs to send messages to certain players, a tournament starts a game or a message contains a start to a game
You call the functions internally I guess

Hoe to notify a player
{
"status": "success",
"message": "You have a new match!",
"showAlert": true
}
Could be done with this, or by setting up event listeners in the frontend to listen for push notifications, this is rather convoluted and will require a bunch more work

What should an API response look like
apparently an API response can be marked as cacheable or non cacheable?
Code on demand part of REST APIs?
Look up some example documentation on APIs
composite API
API gateways
rate limiting

So the URL is just the Uniform Resource Locator, it is the path to a resource
The URL is kind of the endpoint and specifies to the server what the client requires
There is a method you send, so GET just gets resource, POST posts it to the server, PUT will update it and DELETE deltes

So Rest APIs have endpoints for resources and when a client request it the server returns all the information about that resource, ex. fetch user will return all the info about the user

TODOS
merge Anna code, check if it works and merge it back to Anna, we'll prbably have to do this with Anna there

Okay so things we still need to do

BACKEND

FRONTEND

DATABASE
- figuring out the information we need to store in the database, what tables are we using and the relations between those tables (these are just examples and stuff Anna already setup):
  - user information: login, password, email, avatar, id, display name, friends?, bloked users?
  - match information: two players, winner, score, when

- then we need ways to add things to the database
- updating information in the database
- deleting maybe?
- handling duplicate emails, usernames
- we need ways to retreive this information. This part is closely connected to the backend a I think? So might be good to discuss with the person doing that? Or, just have information about what API call returns what information?

MODULES INVOLVED - User Management, Live Chat? backend framework (might have to use this one)?

DOCKER
- needs to run in rootless mode, this introduces issues with volumes and the runtime needs to be in goinfre or sgoinfre whatever this means

GAME
- Just the logic itself
- remote players
- tournament
  - registration for the tournament
  - matchmaking system for the tournament

SECURITY
- passwords must be hashed
- SQL injections/XSS attacks
- HTTPS connection for all aspects, so we need to use wss as well
- need validation for forms or other user inputs in our case in the backend
- need to protect API routes whatever that means, what are JWT tokens


MODULES
- MAJOR: framework to build backend
- MAJOR: standard user management
- MAJOR: remote players
- MAJOR: Live chat
- MAJOR: AI opponent
- MAJOR: server side pong
- MAJOR: multiplayer?
- MAJOR: another game?
- MINOR: toolkit for frontend
- MINOR: database for the backend


- making things work as a single page application, which also involves the back and forward buttons. We have it as an SPA right now, just not the back and forward buttons working

