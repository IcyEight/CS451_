I have modified joinGame.html, joinGame.js, newGame.js, newGame.html, index.js (for server, not index.html's one).
It showed that I have modified checkers.js but I don't recall changing it.


new game’s screen should also update to show new screen. Needs to be implemented.

Bugs:
click join Game button twice, shows windows alert two times. 
click it 3 times, shows alert message three times. Possible error can
	be in socket.emit or socket.on is getting multiple socket request?
sometimes the will be infinite loop. Needed to be fixed.

Cancelling new game screen should also cancel join game screen. Needs to be implemented!!

