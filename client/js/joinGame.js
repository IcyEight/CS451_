var inputCode;
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
var socket  = io();
// call this function when the submit button is pressed
function validateCode() {
	inputCode = $$("gameCode").getValue();
	socket.emit('joinGame', inputCode);
	socket.on('codeIsValid',function(codeIsValid)
	{
		if(codeIsValid)
		{
			console.log("socket id from joinGame client = "+socket.id)
			directToGame();
		}
		else 
		 	joinGameFailure();
	});
};

function directToGame() {
	window.location.href = "checkers.html?playerNo=2&inputCode="+inputCode;
};

function joinGameFailure() {
	window.alert("Unable to join game.");
};

function cancel() {
	/* no need to send socket.emit to server as newGame cancel() 
	in newGame.js does as we do not need to change value in 
	matchlist if someone are not willing to join  */
	window.location.href = "index.html";
};