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


Tournament

Do we store the tournament matches and scores anywhere? Subject doesn't state it as necessary

Local tournament? Everyone would play on one computer, since we're doing user management it means we need to use people's accounts
Could we maybe just do local, and then have prompt for amoutn fo players, f.e. 8, and then for each player we give a prompt
to either put in a username or login to their account, fetch the configured display name for that account and use that.
This way we setup the whole tournament with just unique names, and both people with accounts and without can play
We then do all the matches locally on one computer.
Issue, storing the tournament score somewhere
Makes things easier since you don't have to use remote players and server-side pong

Remote tournament? Everyone on different accounts
So we start tournament and then I guess the person starting is automatically signed up, you then might be prompted for amount of participants
you put that in and then continue to add people from you friend list?, or just people that are online. This would send prompts to these people
asking to participate. Once enough people are added you can start tournament.
It would then create matches and prompt the users that matched eachother for a game. If they both accept the match starts (maybe give a 1 minute timer)

Matchmaking

Round robin tournament. Everyone plays against everyone. This might be a lot of matches when you get more participants

Swiss system. this is like the chess thing, you have less matches and people get matched based on the score they have currently
but without having repeat matchings. This one would be a bit harder to implement, but it allows for a multitude of different amount
of competitors

Then there is the standard knockout system that pigeonholes you into powers of two

You could also do a football tournament type, with first round robins and then knockout

Or way more complicated things with losers and winners brackets

Database
Do we even store the tournament scores
If we do, we could have a table with tournament IDs, maybe amoutn of participants, when it happened and the amount of rounds and the id of the winner
Then the round would have all the matches and the scores, you could then have a display of the tournament as well
The user would have something that stores the amount of tournaments he won and which ones.


Then there is all the forntend stuff
I guess I would have a tab for the tournament. Then clicking there could have a link to all the previous tournaments (if we store them)
And a button to start a new one. Once started we would be able to invite other players
There would be a general overview of the tournament. Like next round, who is up against whom etc.
If we do locally we just move through the round one match at a time. <---- a lot depend shere on decisions I make beforehand


And then depending on if we do remote or not. I guess if remote we need the whole thing where the backend will open sockets to both players
and then start up a game with them. And then this times multiple games


Okay so websockets
We can have a websocket open whenever a client connects.
Now the frontend would have a state for itself where it would have that it's in the online state
Does it even need one?
So whenever we enter the remote/waiting room tab we send a message through the socket that we're waiting. Whenever we swithc out we send a message that we're done
Live chat?
We always have a connection open.
So we can make a chatroom, where you can chat with people. So then if we're in there we show up on a list. Again we would have a state in the server for this


We have to have a websocket connect when client logs in, so I guess there is a request if there is cookies already
If there is we can mark the connection as online, have it have a bunch of info in it, like the credentials of the player
So we're always open to messages?
So the chat window might just have everyone that is online on there - blocked users and maybe a thing to show they are friends
Then we have the remote play. Maybe whenever it is clicked on you get sent to a waiting room, so the state of the connection changes. Ergo, there need to be ways to send change of state to the backend, like, I'm now in waiting room, I'm now in normal browsing mode, I'm now in game. And then there is ways to catch messages in the frontend

So in our backend we can have a Set of connection classes with the websockets there, these can open everytime someone logs in

So games, one option is to have a tab, you go there and can see veryone waiting in the tab, you can then invite them ot a game, they can accept and when they do a room gets created and you and the other person get put in and play the game, i think this works? It's kind of reliant on Djoyke as well

At any rate, in the backend there needs to keep track of this
One is the game itself and the logic behind it. A game could keep track of the state the game is in, the position of the players paddles, the position of the ball etc. Then whenever a new input is given it will adjust those positions, and do the same for the ball itself.
Then maybe a gameManager, that holds all these games, can start a game, stop one etc
Then maybe rooms?


TODO, add token reauthorization, so when JWT expires

websockets - maybe add rate limiting, better error handling and maybe a cleanup, error handling for messages if what comes in is not in json format

Split things up a bit in authControllers, some functions are unecessary
Add handling of reconnection for websockets in frontend
When a user logs out on a tab we need to disconnect all websockets

add cleanup on server shutdown, involves websocket cleanup

npx wscat -c "wss://localhost:3000/ws/connect" -H "Cookie: token=" -n

{"type":"joinWaitingRoom", "gameType": "pong"}
{"type":"joinWaitingRoom", "gameType": "snake"}
{"type":"leaveWaitingRoom"}


