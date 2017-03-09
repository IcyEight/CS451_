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
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "../cgi-bin/addCode.py", 
		success: codeGenSuccess(data),
		error: codeGenFailure
    });
};

function codeGenSuccess(data) {
	// update HTML content
	console.log(data);
	codeGen.innerHTML = data;
	waiting.innerHTML = "Waiting for another player to join.";
};

function codeGenFailure() {
	// update HTML content
	codeGen.innerHTML = "Unable to generate a code at this time.  Please try again later."
};

function cancel() {
	// return to home screen if cancel is pressed
	window.location.href = "index.html";
};

// once another player has joined using the code, call this function to direct to the game
function directToGame() {
	/*
	if code used {
		go to game screen
	}
	*/
};