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

// call this function when the submit button is pressed
function validateCode() {
	inputCode = $$("gameCode").getValue();
	// call post in php
    $.ajax({
        data: 'code=' + inputCode,
        url: 'joinGame.php',
        method: 'POST',
        success: function(msg) {
        	console.log(msg[0]);
        	if(msg[0] == "1")
        	{
        		directToGame();
        	}
        	else
        	{
        		window.alert("More than two players can not play same game.")
        	}
       
        }
    });
};

function directToGame() {
	window.location.href = "mainBoard.php";
};

function cancel() {
	window.location.href = "index.html";
};