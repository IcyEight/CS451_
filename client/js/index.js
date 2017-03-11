$(window).load(function() {
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
		id:"about", 
		value:"About", 
		width:160,
		click:toAbout
	});
	webix.ui({
		view:"button",
		container:"btn2",
		id:"howTo", 
		value:"How to Play Checkers", 
		width:160,
		click:toRules
	});
	webix.ui({
		view:"button",
		container:"btn3",
		id:"newGame", 
		value:"New Game", 
		width:160,
		click:toNewGame
	});
	webix.ui({
		view:"button",
		container:"btn4",
		id:"joinGame", 
		value:"Join Game", 
		width:160,
		click:toJoinGame
	});
});

function toAbout() {
	window.location.href = "about.html";
};

function toNewGame() {
	// var pNo = 1;
	// localStorage.setItem("pNumber", pNo);  // not compatiable when two players are not from
	// 								// same laptop, same internet browser 
	// window.location.href = "checkers.html";
	window.location.href = "newGame.html";
};

function toRules() {
	window.location.href = "rules.html";
};

function toJoinGame() {
	// var pNo = 2;
	// localStorage.setItem("pNumber", pNo);
	// window.location.href = "checkers.html";
	window.location.href = "joinGame.html";
};
