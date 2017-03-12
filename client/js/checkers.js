// for CSS styling and formatting
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var screenSpace = screenWidth - 480;
var leftOffset = screenSpace / 2;

// for reflecting moves on board
var pieceMoved = "";
var newLocation = "";
var board1;

// default board and piece positions
// red tiles are 0's and black tiles are 1's
var gameBoard = [ 
	[  0,  1,  0,  1,  0,  1,  0,  1 ],
	[  1,  0,  1,  0,  1,  0,  1,  0 ],
	[  0,  1,  0,  1,  0,  1,  0,  1 ],
	[  1,  0,  1,  0,  1,  0,  1,  0 ],
	[  0,  1,  0,  1,  0,  1,  0,  1 ],
	[  1,  0,  1,  0,  1,  0,  1,  0 ],
	[  0,  1,  0,  1,  0,  1,  0,  1 ],
	[  1,  0,  1,  0,  1,  0,  1,  0 ]
];
// p1 pieces are 2's and p2 pieces are 3's.  Empty tiles are represented by 0's and 1's
var piecesLocations = [ 
	[  0,  3,  0,  3,  0,  3,  0,  3 ],
	[  3,  0,  3,  0,  3,  0,  3,  0 ],
	[  0,  3,  0,  3,  0,  3,  0,  3 ],
	[  1,  0,  1,  0,  1,  0,  1,  0 ],
	[  0,  1,  0,  1,  0,  1,  0,  1 ],
	[  2,  0,  2,  0,  2,  0,  2,  0 ],
	[  0,  2,  0,  2,  0,  2,  0,  2 ],
	[  2,  0,  2,  0,  2,  0,  2,  0 ]
];
var allPieces = [];
var p1Pieces = new Array();
var p2Pieces = new Array();
var kingState = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
var numP1Pieces = 12;
var numP2Pieces = 12;

// initial player turn state
var p1Turn = true;
var p2Turn = false;
var swapTurns = true;
var playerTurn = 1;

// for forcing the user to make a multiple jump instead of any other move when a multiple jump is available
var forceJump = false;

// for representing the player of each individual machine (either player1 or player2)
var playerNo = 1;

// representing winner of the game
var winner;

// for linking the game between two machines
var socket = io();

$(document).ready(function() {
	// initialize new board
	board1 = Board.getInstance();

	p1Pieces[0] = [0, 0];
	p1Pieces[1] = [2, 0];
	p1Pieces[2] = [4, 0];
	p1Pieces[3] = [6, 0];
	p1Pieces[4] = [1, 1];
	p1Pieces[5] = [3, 1];
	p1Pieces[6] = [5, 1];
	p1Pieces[7] = [7, 1];
	p1Pieces[8] = [0, 2];
	p1Pieces[9] = [2, 2];
	p1Pieces[10] = [4, 2];
	p1Pieces[11] = [6, 2];	
	
	p2Pieces[0] = [1, 5];
	p2Pieces[1] = [3, 5];
	p2Pieces[2] = [5, 5];
	p2Pieces[3] = [7, 5];
	p2Pieces[4] = [0, 6];
	p2Pieces[5] = [2, 6];
	p2Pieces[6] = [4, 6];
	p2Pieces[7] = [6, 6];
	p2Pieces[8] = [1, 7];
	p2Pieces[9] = [3, 7];
	p2Pieces[10] = [5, 7];
	p2Pieces[11] = [7, 7];
	
	//playerNo = localStorage.getItem("pNumber");
	loadBoard();
	updateTurnDiv();
});

setInterval(function() {
	socket.on('turnSwap', function(data) {
		checkPlayerChange = data['t'];
		if ((checkPlayerChange != playerTurn) && (data['p1'] !== undefined)) {
			p1Pieces = new Array();
			p1Pieces = data['p1'];
			p2Pieces = new Array();
			p2Pieces = data['p2'];
			kingState = new Array();
			kingState = data['k'];
			playerTurn = checkPlayerChange;
			numP1Pieces = data['n1'];
			numP2Pieces = data['n2'];
			p1Turn = data['p1B'];
			p2Turn = data['p2B'];
			winner = data['winning'];
			if (winner === undefined) {	
				loadBoard();
				updateTurnDiv();
			}
			else {
				if (winner == playerNo) {
					window.location.href = "win.html";	
				}
				else {
					window.location.href = "lose.html";
				}
			}
		}
	});
},1/100);

function updateTurnDiv() {
	var content = document.getElementById("playTurn");
	content.innerHTML = "";
	var text = "Player " + playerTurn.toString() + "'s Turn";
	var turnTracker = new webix.ui({
		container:"playTurn",
		body:{
			template:"<span style='font-size:24px;'></span>"
		},
		rows:[
			{type:"header", template:text, width:140}
		]
	});
}

function loadBoard() {
	// draw board
	whosTurn();
	board1.outputBoard();
	
	// add checkers pieces to game board
	for (i = 0; i < p1Pieces.length; i++) {
		var coordinates = p1Pieces[i];
		allPieces[i] = new Piece(coordinates[0], coordinates[1], 'red', i, kingState[i]);
		allPieces[i].addPiece();
	}
	for (i = 0; i < p2Pieces.length; i++) {
		var coordinates = p2Pieces[i];
		allPieces[i + p2Pieces.length] = new Piece(coordinates[0], coordinates[1], 'black', i + p2Pieces.length, kingState[i + p2Pieces.length]);
		allPieces[i + p2Pieces.length].addPiece();
	}
	
	orientBoard();
}

function orientBoard() {
	if (playerNo == 2) {
		// allow for spacing on rotate
		document.getElementById("forRotate").innerHTML = "</br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>";
		document.getElementById("checkersBoard").className = "rotateBoard";
	}
}

Board = function() {
	// Initial Board
	var boardheight = 8;
	var boardwidth = 8;

	this.outputBoard = function() {
	// i corresponds to the row in the grid
	for (var i = 0; i < boardheight; i++) {
	    // j corresponds to the column in the grid
		for (var j = 0; j < boardwidth; j++) {
			var tileCode = gameBoard[j][i];
			var pieceCode = piecesLocations[j][i];
			var id = i.toString() + j.toString();
			if (playerNo == 1) {
				if (tileCode == 0) {
					if (pieceCode == 2 || pieceCode == 3) {
						// no drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" style="background: #ff0000; left: ' + (leftOffset + (i * 60)) + 'px; top: ' + (480 - (j * 60)) + 'px"></div>');
					}
					else {
						// drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" ondrop="drop(event)" ondragover="allowDrop(event)" style="background: #ff0000; left: ' + (leftOffset + (i * 60)) + 'px; top: ' + (480 - (j * 60)) + 'px"></div>');
					}
				}
				else if (tileCode == 1) {
					if (pieceCode == 2 || pieceCode == 3) {
						// no drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" style="background: #000000; left: ' + (leftOffset + (i * 60)) + 'px; top: ' + (480 - (j * 60)) + 'px"></div>');
					}
					else if ((j == 3 || j == 4) && (tileCode == 1 && pieceCode == 1)) {
						// no drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" style="background: #000000; left: ' + (leftOffset + (i * 60)) + 'px; top: ' + (480 - (j * 60)) + 'px"></div>');
					}
					else {
						// drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" ondrop="drop(event)" ondragover="allowDrop(event)" style="background: #000000; left: ' + (leftOffset + (i * 60)) + 'px; top: ' + (480 - (j * 60)) + 'px"></div>');
					}
				}
			}
			else if (playerNo == 2) {
				if (tileCode == 0) {
					if (pieceCode == 2 || pieceCode == 3) {
						// no drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" style="background: #ff0000; left: ' + ((leftOffset - 25) + (i * 60)) + 'px; top: ' + (510 - (j * 60)) + 'px"></div>');
					}
					else {
						// drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" ondrop="drop(event)" ondragover="allowDrop(event)" style="background: #ff0000; left: ' + ((leftOffset - 25) + (i * 60)) + 'px; top: ' + (510 - (j * 60)) + 'px"></div>');
					}
				}
				else if (tileCode == 1) {
					if (pieceCode == 2 || pieceCode == 3) {
						// no drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" style="background: #000000; left: ' + ((leftOffset - 25) + (i * 60)) + 'px; top: ' + (510 - (j * 60)) + 'px"></div>');
					}
					else if ((j == 3 || j == 4) && (tileCode == 1 && pieceCode == 1)) {
						// no drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" style="background: #000000; left: ' + ((leftOffset - 25) + (i * 60)) + 'px; top: ' + (510 - (j * 60)) + 'px"></div>');
					}
					else {
						// drop ability
						$('#checkersBoard').append('<div class="tile" id="' + id + '" ondrop="drop(event)" ondragover="allowDrop(event)" style="background: #000000; left: ' + ((leftOffset - 25) + (i * 60)) + 'px; top: ' + (510 - (j * 60)) + 'px"></div>');
					}
				}
			}
		}
	}	
	}
}

Board.getInstance = function() {
	if (!this.instance) {
		this.instance = new this();
	}
	return this.instance;
};

function Piece(i, j, color, id, isKing, isPlayerTurn) { 
	this.x_coord = i;	
	this.y_coord = j;	
	this.pieceColor = color;	
	this.id = this.pieceColor + id;	
	this.king = isKing;
	
	this.addPiece = function() {
		if (i === null || j === null) {
			// skip b/c these pieces were jumped and removed from game play
		}
		else {		
			if (this.king == true) {
				if (playerNo == 1) {
					if (playerNo == 1 && this.pieceColor == "red") {
						$('#checkersBoard').append('<div class="piece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + (leftOffset + (this.x_coord * 60) + 5) + 'px; top: ' + (480 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"><img id="' + this.id + '" height="100%" src="kingy.png"/></div>');
					}
					else if (playerNo == 2 && this.pieceColor == "black") {
						$('#checkersBoard').append('<div class="piece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + (leftOffset + (this.x_coord * 60) + 5) + 'px; top: ' + (480 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"><img id="' + this.id + '" height="100%" src="kingy.png"/></div>');
					}
					else {
						$('#checkersBoard').append('<div class="piece" id="' + this.id + '" style="left: ' + (leftOffset + (this.x_coord * 60) + 5) + 'px; top: ' + (480 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"><img id="' + this.id + '" height="100%" src="kingy.png"/></div>');
					}
				}
				else if (playerNo == 2) {
					if (playerNo == 1 && this.pieceColor == "red") {
						$('#checkersBoard').append('<div class="p2KingPiece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + ((leftOffset - 25) + (this.x_coord * 60) + 5) + 'px; top: ' + (510 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"><img id="' + this.id + '" height="100%" src="kingy.png"/></div>');
					}
					else if (playerNo == 2 && this.pieceColor == "black") {
						$('#checkersBoard').append('<div class="p2KingPiece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + ((leftOffset - 25) + (this.x_coord * 60) + 5) + 'px; top: ' + (510 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"><img id="' + this.id + '" height="100%" src="kingy.png"/></div>');
					}
					else {
						$('#checkersBoard').append('<div class="p2KingPiece" id="' + this.id + '" style="left: ' + ((leftOffset - 25) + (this.x_coord * 60) + 5) + 'px; top: ' + (510 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"><img id="' + this.id + '" height="100%" src="kingy.png"/></div>');
					}
				}
			}
			else {
				if (playerNo == 1) {
					if (playerNo == 1 && this.pieceColor == "red") {
						$('#checkersBoard').append('<div class="piece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + (leftOffset + (this.x_coord * 60) + 5) + 'px; top: ' + (480 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"></div>');
					}
					else if (playerNo == 2 && this.pieceColor == "black") {
						$('#checkersBoard').append('<div class="piece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + (leftOffset + (this.x_coord * 60) + 5) + 'px; top: ' + (480 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"></div>');
					}
					else {
						$('#checkersBoard').append('<div class="piece" id="' + this.id + '" style="left: ' + (leftOffset + (this.x_coord * 60) + 5) + 'px; top: ' + (480 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"></div>');
					}
				}
				else if (playerNo == 2) {
					if (playerNo == 1 && this.pieceColor == "red") {
						$('#checkersBoard').append('<div class="piece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + ((leftOffset - 25) + (this.x_coord * 60) + 5) + 'px; top: ' + (510 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"></div>');
					}
					else if (playerNo == 2 && this.pieceColor == "black") {
						$('#checkersBoard').append('<div class="piece" draggable="true" ondragstart="drag(event)" id="' + this.id + '" style="left: ' + ((leftOffset - 25) + (this.x_coord * 60) + 5) + 'px; top: ' + (510 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"></div>');
					}
					else {
						$('#checkersBoard').append('<div class="piece" id="' + this.id + '" style="left: ' + ((leftOffset - 25) + (this.x_coord * 60) + 5) + 'px; top: ' + (510 - ((this.y_coord * 60) - 5)) + 'px; background: ' + this.pieceColor + '"></div>');
					}
				}
			}
		}
	};
}

// for drag and drop
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
	pieceMoved = ev.currentTarget.id;
}

function drop(ev) {
    ev.preventDefault();
	newLocation = ev.currentTarget.id;
	movePiece(newLocation, pieceMoved);
}

function movePiece(newLocation, pieceMoved) {
	// remove from previous location
	var index;
	var color;
	var coordinates = newLocation.split("");
	var i = parseInt(coordinates[0]);
	var j = parseInt(coordinates[1]);
	var isValid;
	var isKing;
	var newKing;
	if (pieceMoved.includes("red")) {
		index = parseInt(pieceMoved.substr(3));
		color = "red";
		var oldLocation = p1Pieces[index];
		var oldi = oldLocation[0];
		var oldj = oldLocation[1];
		isKing = kingState[index];
		isValid = validateMove(oldi, oldj, i, j, color, isKing);
		if (isValid == true) {
			newKing = checkNewKing(j, color);
			if (newKing == true) {
				// mark piece as a king
				kingState[index] = true;
			}
			p1Pieces[index] = [i,j];
		}
	}
	else {
		index = parseInt(pieceMoved.substr(5));	
		color = "black";
		var oldLocation = p2Pieces[index-12];
		var oldi = oldLocation[0];
		var oldj = oldLocation[1];
		isKing = kingState[index];
		isValid = validateMove(oldi, oldj, i, j, color, isKing);
		if (isValid == true) {
			newKing = checkNewKing(j, color);
			if (newKing == true) {
				// mark piece as a king
				kingState[index] = true;
			}
			p2Pieces[index-12] = [i,j];
		}
	}
	// reload board after moving piece
	var gameOver = isComplete();
	if (isValid == true && gameOver == false) {	
		// swap player turns before reloading board
		if (swapTurns == true) {
			if (p1Turn == true) {
				p1Turn = false;
				p2Turn = true;
				playerTurn = 2;
			}
			else if (p2Turn == true) {
				p1Turn = true;
				p2Turn = false;
				playerTurn = 1;
			}
			forceJump = false;	// reset global variable for movement control
		}
		// SOCKET IO
		var pack = [];
		pack.push({
			nP1:numP1Pieces,
			nP2:numP2Pieces,
			king:kingState,
			p1:p1Pieces,
			p2:p2Pieces,
			turn:playerTurn,
			p1Bool:p1Turn,
			p2Bool:p2Turn,
			w:winner
		});
		socket.emit('turnEnd', pack);
		loadBoard();
		updateTurnDiv();
		swapTurns = true;	// reset global variable for turn control
	}
	else if (gameOver == true) {
		// still need a socket connection to inform other player of game termination
		var pack = [];
		pack.push({
			nP1:numP1Pieces,
			nP2:numP2Pieces,
			king:kingState,
			p1:p1Pieces,
			p2:p2Pieces,
			turn:playerTurn,
			p1Bool:p1Turn,
			p2Bool:p2Turn,
			w:winner
		});
		socket.emit('turnEnd', pack);
		// redirect to win/ lose screens
		if (winner == playerNo) {
			window.location.href = "win.html";
		}
		else {
			window.location.href = "lose.html";
		}
	}
}

function validateMove(oldI, oldJ, newI, newJ, color, isKing) {
	var fullValid = false;
	var normalMoveValid = false;
	var validJump = false;
	
	// check correct player is making move, if not, return false from this function
	if ((p1Turn == true && color == "red") || (p2Turn == true && color == "black")) {
		// normal move --> validates movement in the correct direction (skip for king)
		if (isKing == false) {
			if (color == "red") {
				if ((newJ > oldJ) && (Math.abs(newJ - oldJ) == 1) && (Math.abs(newI - oldI) == 1)) {
					if (forceJump == true) {
						window.alert("Invalid move.  Must jump opponent's piece when multiple jumps are available.");
					}
					else {
						normalMoveValid = true;
					}
				}
				else {
					// invalid move, provide error message
					if (newJ <= oldJ) {
						window.alert("Invalid move.  Piece cannot be moved backwards.");
						return false;
					}
					else if (Math.abs(newJ - oldJ) == Math.abs(newI - oldI)) {
						// check for jump, if no jump, throw error
						validJump = possibleJump(oldI, oldJ, newI, newJ, color, isKing);
						if (validJump == false) {
							window.alert("Invalid move.  Piece can only be moved forwards 1 tile.");
							return false;
						}
					}
					else if ((Math.abs(newI - oldI) != 1) || (Math.abs(newJ - oldJ) != 1)) {
						window.alert("Invalid move.  Piece must be moved along the diagonal.");
						return false;
					}
				}
			}
			else if (color == "black") {
				if ((oldJ > newJ) && (Math.abs(newJ - oldJ) == 1) && (Math.abs(newI - oldI) == 1)) {
					if (forceJump == true) {
						window.alert("Invalid move.  Must jump opponent's piece when multiple jumps are available.");
					}
					else {
						normalMoveValid = true;
					}
				}
				else {
					// invalid move, provide error message
					if (newJ >= oldJ) {
						window.alert("Invalid move.  Piece cannot be moved backwards");
						return false;
					}
					else if (Math.abs(newJ - oldJ) == Math.abs(newI - oldI)) {
						// check for jump, if no jump, throw error
						validJump = possibleJump(oldI, oldJ, newI, newJ, color, isKing);
						if (validJump == false) {
							window.alert("Invalid move.  Piece can only be moved forwards 1 tile.");
							return false;
						}
					}
					else if ((Math.abs(newI - oldI) != 1) || (Math.abs(newJ - oldJ) != 1)) {
						window.alert("Invalid move.  Piece must be moved along the diagonal.");
						return false;
					}
				}
			}
		}
		else {
			// validation for kinged pieces (check for diagonal and jumps)
			if ((Math.abs(newJ - oldJ) == 1) && (Math.abs(newI - oldI) == 1)) {
				if (forceJump == true) {
					window.alert("Invalid move.  Must jump opponent's piece when multiple jumps are available.");
				}
				else {
					normalMoveValid = true;
				}
			}
			else {
					if (Math.abs(newJ - oldJ) == Math.abs(newI - oldI)) {
						// check for jump, if no jump, throw error
						validJump = possibleJump(oldI, oldJ, newI, newJ, color, isKing);
						if (validJump == false) {
							window.alert("Invalid move.  A kinged piece can only be moved 1 tile.");
							return false;
						}
					}
					else if ((Math.abs(newI - oldI) != 1) || (Math.abs(newJ - oldJ) != 1)) {
						window.alert("Invalid move.  Piece must be moved along the diagonal.");
						return false;
					}
			}
		}
		
		if (normalMoveValid == true || validJump == true) {
			return true;
		}
	}
	else {
		window.alert("Invalid move.  Cannot move other player's piece.");
		return false;
	}
}

// checks if a valid jump exists for desired move
function possibleJump(oldI, oldJ, newI, newJ, color, isKing) {
	var validJump = false;
	var jumpSelf = false;
	var indexToRemove;
	// get coordinates of the piece that would have been jumped
	var jumpedI = Math.min(oldI, newI) + 1;
	var jumpedJ = Math.min(oldJ, newJ) + 1;

	if ((Math.abs(newI - oldI) != 2) || (Math.abs(newJ - oldJ)) != 2) {
		// invalid jump - > jumped more than one space
		validJump = false;
		return validJump;
	}
	
	// search opponent's pieces for those coordinates
	var searchOpponent = searchPieces(color, true, jumpedI, jumpedJ, validJump, jumpSelf, indexToRemove);
	validJump = searchOpponent[0];
	jumpSelf = searchOpponent[1];
	indexToRemove = searchOpponent[2];
	
	// if not in opponent's pieces, search one's own pieces (return error if here)
	if (validJump == false) {
		var searchSelf = searchPieces(color, false, jumpedI, jumpedJ, validJump, jumpSelf, indexToRemove);
		validJump = searchSelf[0];
		jumpSelf = searchSelf[1];
		indexToRemove = searchSelf[2];
	}
	
	if (jumpSelf == true) {
		window.alert("Invalid move.  Cannot jump over your own piece.");
	}

	if (validJump == true) {
		// remove piece
		if (color == "red") {
			// account for offset in removing opponent's piece
			allPieces[indexToRemove+12] = [null, null];
			p2Pieces[indexToRemove] = [null, null];
			numP2Pieces = numP2Pieces - 1;
		}
		else if (color == "black") {
			allPieces[indexToRemove] = [null, null];
			p1Pieces[indexToRemove] = [null, null];
			numP1Pieces = numP1Pieces - 1;
		}
		
		// check for multiple jumps (also don't swap turns until additional jump has been made)
		var additionalJumps = multipleJumps(newI, newJ, isKing, color);
		if (additionalJumps == true) {
			window.alert("Additional Jump Detected :)");
			swapTurns = false;
			forceJump = true;
		}
		return true;
	}
	else {
		return false;
	}
}

// searches for a piece being jumped to determine if that piece belongs to the player making the jump or the opponent
function searchPieces(color, searchOpponent, jumpedI, jumpedJ, vJump, jSelf, iRemove) {
	var validJump = vJump;
	var jumpSelf = jSelf;
	var indexToRemove = iRemove;
	var currentCoordinates;
	for (i = 0; i < 12; i++) {
		if (searchOpponent == true) {
			if (color == "red") {
				currentCoordinates = p2Pieces[i];
			}
			else if (color == "black") {
				currentCoordinates = p1Pieces[i];
			}
			var currI = currentCoordinates[0];
			var currJ = currentCoordinates[1];
			if ((currI == jumpedI) && (currJ == jumpedJ)) {
				indexToRemove = i;
				validJump = true;
				break;
			}
		}
		else {
			if (color == "red") {
				currentCoordinates = p1Pieces[i];
			}
			else if (color == "black") {
				currentCoordinates = p2Pieces[i];
			}
			var currI = currentCoordinates[0];
			var currJ = currentCoordinates[1];
			if ((currI == jumpedI) && (currJ == jumpedJ)) {
				jumpSelf = true;
				break;
			}
		}
	}
	return [validJump, jumpSelf, indexToRemove];
}

// checks to see if an additional jump could be made after one SUCCESSFUL JUMP before swapping player turns
function multipleJumps(i, j, isKing, color) {
	var foundMJ = false;
	var isTileOpen;
	
	if (isKing == true) {
		if (color == "red") {
			// search P2Pieces
			var checkI1 = i + 1;
			var checkI2 = i - 1;
			var checkJ1 = j + 1;
			var checkJ2 = j - 1;
			if ((checkI1 >= 0 && checkI1 <= 7) && (checkJ1 >= 0 && checkJ1 <= 7)) {
				for (k = 0; k < p2Pieces.length; k++) {
					var coordinates = p2Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI1) && (pieceJ == checkJ1)) {
						var primeI = checkI1 + 1;
						var primeJ = checkJ1 + 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI2 >= 0 && checkI2 <= 7) && (checkJ1 >= 0 && checkJ1 <= 7)) && foundMJ == false) {
				for (k = 0; k < p2Pieces.length; k++) {
					var coordinates = p2Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI2) && (pieceJ == checkJ1)) {					
						var primeI = checkI2 - 1;
						var primeJ = checkJ1 + 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI1 >= 0 && checkI1 <= 7) && (checkJ2 >= 0 && checkJ2 <= 7)) && foundMJ == false) {
				for (k = 0; k < p2Pieces.length; k++) {
					var coordinates = p2Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI1) && (pieceJ == checkJ2)) {					
						var primeI = checkI1 + 1;
						var primeJ = checkJ2 - 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI2 >= 0 && checkI2 <= 7) && (checkJ2 >= 0 && checkJ2 <= 7)) && foundMJ == false) {
				for (k = 0; k < p2Pieces.length; k++) {
					var coordinates = p2Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI2) && (pieceJ == checkJ2)) {					
						var primeI = checkI2 - 1;
						var primeJ = checkJ2 - 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
		}
		else if (color == "black") {
			// search P1Pieces
			var checkI1 = i + 1;
			var checkI2 = i - 1;
			var checkJ1 = j + 1;
			var checkJ2 = j - 1;
			if ((checkI1 >= 0 && checkI1 <= 7) && (checkJ1 >= 0 && checkJ1 <= 7)) {
				for (k = 0; k < p1Pieces.length; k++) {
					var coordinates = p1Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI1) && (pieceJ == checkJ1)) {
						var primeI = checkI1 + 1;
						var primeJ = checkJ1 + 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI2 >= 0 && checkI2 <= 7) && (checkJ1 >= 0 && checkJ1 <= 7)) && foundMJ == false) {
				for (k = 0; k < p1Pieces.length; k++) {
					var coordinates = p1Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI2) && (pieceJ == checkJ1)) {
						var primeI = checkI2 - 1;
						var primeJ = checkJ1 + 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI1 >= 0 && checkI1 <= 7) && (checkJ2 >= 0 && checkJ2 <= 7)) && foundMJ == false) {
				for (k = 0; k < p1Pieces.length; k++) {
					var coordinates = p1Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI1) && (pieceJ == checkJ2)) {
						var primeI = checkI1 + 1;
						var primeJ = checkJ2 - 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI2 >= 0 && checkI2 <= 7) && (checkJ2 >= 0 && checkJ2 <= 7)) && foundMJ == false) {
				for (k = 0; k < p1Pieces.length; k++) {
					var coordinates = p1Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI2) && (pieceJ == checkJ2)) {
						var primeI = checkI2 - 1;
						var primeJ = checkJ2 - 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
		}
	}
	else {
		// look up one j and left and right one i for opponent's piece
		if (color == "red") {
			// search P2Pieces
			var checkI1 = i + 1;
			var checkI2 = i - 1;
			var checkJ = j + 1;
			if ((checkI1 >= 0 && checkI1 <= 7) && (checkJ >= 0 && checkJ <= 7)) {
				for (k = 0; k < p2Pieces.length; k++) {
					var coordinates = p2Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI1) && (pieceJ == checkJ)) {
						var primeI = checkI1 + 1;
						var primeJ = checkJ + 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI2 >= 0 && checkI2 <= 7) && (checkJ >= 0 && checkJ <= 7)) && foundMJ == false) {
				for (k = 0; k < p2Pieces.length; k++) {
					var coordinates = p2Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI2) && (pieceJ == checkJ)) {					
						var primeI = checkI2 - 1;
						var primeJ = checkJ + 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
		}
		else if (color == "black") {
			// search P1 pieces
			var checkI1 = i + 1;
			var checkI2 = i - 1;
			var checkJ = j - 1;		// moving other direction normally
			if ((checkI1 >= 0 && checkI1 <= 7) && (checkJ >= 0 && checkJ <= 7)) {
				for (k = 0; k < p1Pieces.length; k++) {
					var coordinates = p1Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI1) && (pieceJ == checkJ)) {
						var primeI = checkI1 + 1;
						var primeJ = checkJ - 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
			if (((checkI2 >= 0 && checkI2 <= 7) && (checkJ >= 0 && checkJ <= 7)) && foundMJ == false) {
				for (k = 0; k < p1Pieces.length; k++) {
					var coordinates = p1Pieces[k];
					var pieceI = coordinates[0];
					var pieceJ = coordinates[1];
					if ((pieceI == checkI2) && (pieceJ == checkJ)) {
						var primeI = checkI2 - 1;
						var primeJ = checkJ - 1;
						if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
						
							isTileOpen = tileOpen(primeI, primeJ);
							
							if (isTileOpen == true) {
								foundMJ = true;
							}
						}
					}
				}
			}
		}
	}
		
	// return condition
	if (foundMJ == true && isTileOpen == true) {
		return true; 	// additional jump possible
	}
	else {
		return false;	// no additional jump possible
	}
}

function tileOpen(primeI, primeJ) {
	var tOpen = true;
	if ((primeI >= 0 && primeI <= 7) && (primeJ >= 0 && primeJ <= 7)) {
		for (l = 0; l < 12; l++) {
			var redCoordinates = p2Pieces[l];
			var blackCoordinates = p1Pieces[l];
			if ((redCoordinates[0] == primeI) && (redCoordinates[1] == primeJ)) {
				// found another piece so tile is not open
				tOpen = false;
			}
			else if ((blackCoordinates[0] == primeI) && (blackCoordinates[1] == primeJ)) {
				tOpen = false;
			}
		}
	}
	return tOpen;
}

function checkNewKing(j, color) {
	var newKing = false;
	if (color == "red") {
		if (j == 7) {
			newKing = true;
		}
	}
	else if (color == "black") {
		if (j == 0) {
			newKing = true;
		}
	}
	return newKing;
}

function whosTurn() {
	if (p1Turn == true) {
		console.log("P1 turn");
	}
	else if (p2Turn == true) {
		console.log("P2 turn");
	}
	console.log("P1 pieces: " + numP1Pieces + "      P2 pieces: " + numP2Pieces);
}

function isComplete() {
	if (numP1Pieces == 0) {
		winner = 2;
		return true;
	}
	else if (numP2Pieces == 0) {
		winner = 1;
		return true;
	}
	else {
		return false;
	}
}

// constant function to check for game completion after game has terminated on other client
setInterval(function() {
	var gameOver = isComplete();
	if (gameOver == true) {
		if (winner == playerNo) {
			window.location.href = "win.html";	
		}
		else {
			window.location.href = "lose.html";
		}
	}
},1/100);
