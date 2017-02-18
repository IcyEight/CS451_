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
			{ view:"text", label:"Enter your code:", labelWidth:125, width:225},
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
	/*
		if code valid {
			directToGame();
		}
		else {
			window.alert("Code invalid.  Please enter a valid code.");
		}
	*/
};

function directToGame() {
	
};

function cancel() {
	window.location.href = "home.html";
};