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
app.use(express.static('client'));
var serv = require('http').Server(app);
app.get('/',function(req,res){
   res.sendFile(__dirname+'/client/checkers.html');
});
app.use('/client',express.static(__dirname+'/client'));
serv.listen(7020);
console.log("Server started.");

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});

io.sockets.on('connection',function(socket){
   //socket.on('happy',function(data){
     //    console.log('happy because' + data.reason);
  // });
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
		/*
		stateChange = true;
	});
	/*
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
