var codeGen;
var waiting;

$(window).load(function() {
	webix.ui({
		container:"newGame",
		body:{
			template:"<span style='font-size:24px;></span>"
		},
		rows:[
			{ type:"header", template:"New Game" }
		]
	});
	webix.ui({
		view:"button",
		container:"cancel",
		id:"cancel", 
		value:"Cancel", 
		width:100,
		click:cancel
	});
	codeGen = document.getElementById('codeGen');
	waiting = document.getElementById('waiting');
	generateCode();
});

function generateCode() {
	// ajax call here
	codeGenSuccess();
};

function codeGenSuccess() {
	// parse returned data from generateCode to get code to display
	var code;
	// update HTML content
	codeGen.innerHTML = "Your code is " + code;
	waiting.innerHTML = "Waiting for another player to join.";
};

function codeGenFailure() {
	// update HTML content
	codeGen.innerHTML = "Unable to generate a code at this time.  Please try again later."
};

function cancel() {
	// return to home screen if cancel is pressed
	window.location.href = "home.html";
};

// once another player has joined using the code, call this function to direct to the game
function directToGame() {
	/*
	if code used {
		go to game screen
	}
	*/
};