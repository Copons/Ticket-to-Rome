# Ticket to Rome

A just-for-laughs-and-giggles rip-off of the amazing boardgame **[Ticket to Ride](https://www.daysofwonder.com/tickettoride/en/usa/)**, but reimagined in an utopian reality where Rome had a proper network and a cool tube map like the London one.

You can play a (hopefully) updated version of the game over **[here](https://ticket-to-rome.herokuapp.com/)**!


## Rules

Each player's goal is to build routes in order to link its own destinations stations.

### The Lobby
When users first connect to the game, they'll be asked to enter their names.<br>
Then they'll be shown the list of available rooms to join (if any), and the possibility of creating a new one.

Only the owner of a room (who created it) can start a game in that room.

Rooms can contain 1 to 5 players (single player games are allowed).<br>
Whenever the owner leaves a room, the room gets deleted and all the other players are kicked out of it.<br>
Whenever anyone leaves a room while the game is in progress, the game ends and all the remaining players, while still in the room, go back to the lobby.

### Claiming Routes
To do so, in their turns, players can claim unbuilt routes by clicking on them and choose what cards to discard to claim (and build) the route.<br>
All routes have a color and a length (described by the number of route segments on the map). To claim a route, a player must use a number of cards, equal to the length of the route, of the same color of the route.<br>
*For example, to claim a red route of 4 segments, a player must use 4 red cards.*

Additionally, to claim a route, a player will consume a number of wagons equals to the route length.<br>
*So, in the example above, on top of the 4 red cards, the player will also use 4 wagons.*

### Turns
The starting player is chosen randomly at the beginning of the game, then the turn order will follow the left to right direction as shown in the information banner just above player's hand.

In each turn, the player can perform up to two actions. Each action has a cost, though:

- draw a card from the deck: *1 action*;
- draw a non-wild card from the pile: *1 action*;
- draw a wild card from the pile: *2 actions*;
- draw a new destination: *2 actions*;
- claim a route: *2 actions*.

Therefore, while players can draw (up to) 2 cards in their turns, they cannot draw 1 card and then claim a route in the same turn, but they must wait for their next turn.

### Scoring Points
Claiming a route grants the player a number of points as shown in this conversion table:

- 1-long route: *1 point*;
- 2-long route: *2 points*;
- 3-long route: *4 points*;
- 4-long route: *7 points*;
- 5-long route: *10 points*;
- 6-long route: *15 points*.

Additionally, each completed destination grants the player a number of points as shown in the destination itself.

Points scored while claiming routes are always displayed to all players in the information banner, while points granted from completed destinations are hidden and only added to the player's total score during the endgame screen.

### Endgame
The final turns of a game start when a player is left with less than or equal to 2 wagons.<br>
Then, all the other players have their own last turn, and the player who started the "final turns chain" gets an additional turn, which will be the very last turn of the game.<br>

Once the last player completes the last turn, the endgame screen is displayed with a count of all players points (including the destinations'), showing who won.

Players then can close the endgame screen and go back to the lobby.


## Install

Clone the project and run `npm i` to install the dependencies.

Run `npm run postinstall` to bundle the source.

Then run `npm start` to start the server and open the browser at `http://localhost:3000` to play.


## Develop

Clone the project and run `npm i` to install all the dependencies.

Then just run `npm run dev` to start the webpack dev server and open the browser at `http://localhost:8080`.
