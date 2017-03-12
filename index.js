var player1Pieces;
var player2Pieces;
var kingStates;
var playerTurn = 1;
var numP1;
var numP2;
var p1Bool;
var p2Bool;
var gameWinner;
var stateChange = false;

var express = require('express');;
var app = express();
 /* this makes client directory available and 
 server starts serving content of this directory 
right away. */
app.use(express.static('client'));
var serv = require('http').Server(app);
serv.listen(process.env.PORT); /* use 'PORT=<portNum> node index.js' on command line */
console.log("Server started.");

var SOCKET_LIST = {};
var io = require('socket.io')(serv,{});

var matchlist = {};
/*
matchlist = 
{
	code1 : [newGameSocket1, joinGameSocket2, checkersBoardSocket1, checkersBoardSocket2 ]
	code2 : [...]
	code3 : [...]
	...
}
*/

var count=0;
//Whenever someone connects this gets executed
io.sockets.on('connection',function(socket){
	console.log(++count);
	//console.log(socket.id);
	SOCKET_LIST[socket.id] = socket;


	//socket.on();

	socket.on('checkers',function(inputCode){
		//console.log("i am here");
		var disconnect = true;
		for(var i in matchlist)
		{
			// console.log("i = "+i);
			// console.log("inputCode = "+inputCode);

			if(i == inputCode)
			{
				// console.log("matchlist");
				// console.log(matchlist[i][0]);
				// console.log(socket.id);
				// console.log(matchlist[i][1]);
				if(matchlist[i][0] != null &&  
					matchlist[i][1] != null) /* always pass..? */
				{/* both checkers screens are opening at the same time
					so we can not assume the first one will be 3rd 
					and the second one will be 4th element as done 
					below. need to improve this as following will 
					generate error; when closing socket we may close
					2nd player's one while meant for 1st one. Nonetheless
					there needs to have setinterval or alternative way 
					to clean up socket that's been left alone after other
					party refreshed the browser, disconnected */
					if(matchlist[i][3] == null)
					{
						matchlist[i][3] = socket.id;
						disconnect = false;
					}
					else if(matchlist[i][4] == null)
					{
						matchlist[i][4] = socket.id;
						disconnect = false;
					}
				}
			}
		}
		console.log("disconnect value = "+disconnect);
		if(disconnect)
		{
			//console.log("before disconnect = "+socket.id);
			socket.disconnect();
			//console.log("after disconnect = "+socket.id);
		}
	});

	socket.on('turnEnd', function(data) {
		//console.log("turn ended");
		// update all global variables
		data = data[0];
		player1Pieces = data['p1'];
		player2Pieces = data['p2'];
		kingStates = data['king'];
		playerTurn = data['turn'];
		numP1 = data['nP1'];
		numP2 = data['nP2'];
		p1Bool = data['p1Bool'];
		p2Bool = data['p2Bool'];
		gameWinner = data['w'];
		//console.log(kingStates);
		stateChange = true;
	});

	// newGame.js will send codeGenerated to server
	socket.on('newGame',function(codeGenerated){
		// console.log(socket.id+ " from new game server");
		var temp = [socket.id, null, null, null];
		code = codeGenerated;
		matchlist[code] = temp;
	});
	// socket.on('pNumberFromJoinToServer',function(pNumber){
	// 	// console.log(socket.id+" from pNumberToServer server");
	// 	console.log("pNumberToServer "+pNumber);
	// 	socket.emit('pNumberFromServer',pNumber);
	// });
    socket.on('newGameDisconnect',function(){
      //console.log("i am here as well");
      for(var i in matchlist)
      {
      	if(matchlist[i][0] == socket.id)
      	{
      		 delete matchlist[i];
      		 break;
      	}
      }
   });

    socket.on('disconnect', function(){
    	//console.log("before");
    	//console.log(SOCKET_LIST[socket.id]);
    	delete SOCKET_LIST[socket.id];
    	//console.log("after");
    	//console.log(SOCKET_LIST[socket.id]);
    });

    //console.log(SOCKET_LIST[socket.id]);

	socket.on('joinGame',function(inputCode){ /* including myself can join? */
		//console.log(id);
		var found = false;
		//console.log(matchlist);
		for(var i in matchlist)
		{
			//console.log("here");
			if(i == inputCode)
			{
				if(matchlist[i][1] == null)
				{
					matchlist[i][1] = socket.id;
					//console.log("socket id = "+socket.id);
					//console.log("id = "+id);
					//socket.broadcast.to(id).emit('codeIsValid',true);
					socket.emit('codeIsValid',true);
					var player1Socket =  SOCKET_LIST[matchlist[i][0]];
					//console.log("socket id = "+socket.id);
					//console.log("player1 socket = "+player1Socket.id);
					socket.to(player1Socket.id).emit('someoneJoined',true);
					found = true;
					break;
				}
			}
		}
		//console.log(found);
		if(!found)
		{ 
			//console.log("code has been used");
			//socket.broadcast.to(id).emit('codeIsValid',false);
			socket.emit('codeIsValid',false);
		}
	});
		/*
		socket.emit('turnSwap', {
			p1:player1Pieces,
			p2:player2Pieces,
			k:kingStates,
			t:playerTurn,
			n1:numP1,
			n2:numP2,
			p1B:p1Bool,
			p2B:p2Bool
		});
		
		stateChange = true;
	});
	
	setInterval(function() {
		if (stateChange == true) {
                	socket.emit('turnSwap', {
                        	p1:player1Pieces,
                        	p2:player2Pieces,
                        	k:kingStates,
                        	t:playerTurn,
                        	n1:numP1,
                       		n2:numP2,
                        	p1B:p1Bool,
                        	p2B:p2Bool
                });
                stateChange = false;
                console.log("swapped");
       		}
	},1000/25);
	*/
});


/*
matchlist = 
{
	code1 : [newGameSocket1, joinGameSocket2, checkersBoardSocket1, checkersBoardSocket2 ]
	code2 : [...]
	code3 : [...]
	...
}
*/


/*
wanted to clean up socket and matchlist so the inactive codes 
does not hang around on matchlist after SOCKET_LIST deleted them.
But so far commented out because it seems to delete the original
sockets for the two checkers instance as well!
*/
// do not erase this
/*
setInterval(function() {
	var temp1;
	var temp2;
	for(var i in matchlist)
 	{ 
		if(matchlist[i][0] != null && matchlist[i][1] != null)
		{
			temp1 = matchlist[i][3];
			temp2 = matchlist[i][4];
			if([SOCKET_LIST[temp1] == undefined || 
				SOCKET_LIST[temp2] == undefined])
			{
				delete matchlist[i];
			}
		}
	}
},400);
*/

setInterval(function() {
	if (stateChange == true) {
		for(var i in SOCKET_LIST) {
			var socket = SOCKET_LIST[i];
			socket.emit('turnSwap', {
				p1:player1Pieces,
				p2:player2Pieces,
				k:kingStates,
				t:playerTurn,
				n1:numP1,
				n2:numP2,
				p1B:p1Bool,
				p2B:p2Bool,
				winning:gameWinner
			});
		}
		stateChange = false;
	}
},1/100);
