$(window).load(function() {
	webix.ui({
		view:"button",
		container:"home",
		id:"home", 
		value:"Home", 
		width:100,
		click:returnHome
	});
	$$("home").attachEvent("onBeforeLoad", function(){
	  $$("home").$view.getElementsByTagName("button")[0].style.background = "#3498db";
	  $$("home").$view.getElementsByTagName("button")[0].style.borderColor = "#3498db";  
	  
	});
});

function returnHome() {
	window.location.href = "index.html";
};