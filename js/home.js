var newGame;
var rules;
var joinGame;

$(window).load(function() {
	newGame = document.getElementById('btn1');
	rules = document.getElementById('btn2');
	joinGame = document.getElementById('btn3');
	webix.ui({
		container:"welcome",
		body:{
			template:"<span style='font-size:24px;></span>"
		},
		rows:[
			{ type:"header", template:"Welcome to Checkers!" }
		]
	});
	webix.ui({
		view:"button",
		container:"btn1",
		id:"newGame", 
		value:"New Game", 
		width:100,
		click:toNewGame
	});
	webix.ui({
		view:"button",
		container:"btn2",
		id:"rules", 
		value:"Rules", 
		width:100,
		click:toRules
	});
	webix.ui({
		view:"button",
		container:"btn3",
		id:"joinGame", 
		value:"Join Game", 
		width:100,
		click:toJoinGame
	});
});

function toNewGame() {
	window.location.href = "newGame.html";
};

function toRules() {
	window.location.href = "rules.html";
};

function toJoinGame() {
	window.location.href = "joinGame.html";
};