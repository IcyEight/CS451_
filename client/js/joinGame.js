var inputCode;
var socket = io();
$(window).load(function() {
	webix.ui({
		container:"joinGame",
		body:{
			template:"<span style='font-size:24px;></span>"
		},
		rows:[
			{ type:"header", template:"Join Game" }
		]
	});
	webix.ui({
		view:"form", 
		id:"inputForm",
		container:"inputForm",
		width:250,
		elements:[
			{ view:"text", id:"gameCode", label:"Enter your code:", labelWidth:125, width:225},
			{ view:"button", value:"Submit", width:100, click:validateCode}
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
});

// call this function when the submit button is pressed
function validateCode() {
	inputCode = $$("gameCode").getValue();
	//console.log(socket.id);
	socket.emit('joinGame', inputCode);
	socket.on('codeIsValid',function(codeIsValid)
	{
		//console.log(socket.id);
		//console.log("codeIsValid = "+codeIsValid);
		//window.alert(codeIsValid);
		if(codeIsValid)
			directToGame();
		else 
		 	joinGameFailure();
	});
};

function directToGame() {
	window.location.href = "checkers.html";
};

function joinGameFailure() {
	//console.log("unable to join game");
	window.alert("Unable to join game.");
};

function cancel() {
	window.location.href = "index.html";
};