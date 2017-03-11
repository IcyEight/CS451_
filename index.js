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

var express = require('express');
var app = express();
app.use(express.static('client')); /* this makes client directory
available and server starts serving content of this directory 
right away. */
var serv = require('http').Server(app);
serv.listen(process.env.PORT); /* use 'PORT=<portNum> node index.js' on command line */
console.log("Server started.");

var SOCKET_LIST = {};
var io = require('socket.io')(serv,{});

var matchlist = {};

//Whenever someone connects this gets executed
io.sockets.on('connection',function(socket){
	SOCKET_LIST[socket.id] = socket;
	socket.on('turnEnd', function(data) {
		console.log("turn ended");
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
		console.log(kingStates);
		stateChange = true;
	});

	// newGame.js will send codeGenerated to server
	socket.on('newGame',function(codeGenerated){
		var temp = [socket.id, null];
		code = codeGenerated;
		matchlist[code] = temp;
	});
    socket.on('newGameDisconnect',function(){
      for(var i in matchlist)
      {
      	if(matchlist[i][0] == socket.id)
      	{
      		 delete matchlist[i];
      		 break;
      	}
      }
   });

	socket.on('joinGame',function(inputCode){ /* including myself can join? */
		//console.log(id);
		var found = false;
		console.log(matchlist);
		for(var i in matchlist)
		{
			console.log("here");
			if(i == inputCode)
			{
				if(matchlist[i][1] == null)
				{
					matchlist[i][1] = socket.id;
					//console.log("socket id = "+socket.id);
					//console.log("id = "+id);
					//socket.broadcast.to(id).emit('codeIsValid',true);
					socket.emit('codeIsValid',true);
					var player1Socket =  SOCKET_LIST[socket.id];
					player1Socket.emit('someoneJoined',true);
					found = true;
					break;
				}
			}
		}
		console.log(found);
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
