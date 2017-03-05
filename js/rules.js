$(window).load(function() {
	webix.ui({
		container:"about",
		body:{
			template:"<span style='font-size:24px;></span>"
		},
		rows:[
			{ type:"header", template:"About Checkers" }
		]
	});
	webix.ui({
		view:"button",
		container:"backBtn",
		id:"backBtn", 
		value:"Back", 
		width:100,
		click:returnHome
	});
});

function returnHome() {
	window.location.href = "index.html";
};