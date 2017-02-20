<?php
	if($_SERVER['REQUEST_METHOD'] == 'GET') 
	{
		$user = 'root';
	    $password = 'root';
	    $db = 'testcheckers';
	    $host = 'localhost';
	    $port = 8889;
	    $link = mysqli_init();
	    $success = mysqli_real_connect(
	       $link, 
	       $host, 
	       $user, 
	       $password, 
	       $db,
	       $port
	    );
	    if(!$success)
	    {
	    	die('error connecting to database');
	    }
	    //echo "you have connected successfully.\n";
		// if(isset($_GET['newGame'])) 
		// {
			$charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			for($i=0; $i<6; $i++) 
	           $codeGen .= $charset[(mt_rand(0,(strlen($charset)-1)))]; 
	       	// echo "give this code to someone 
	       	// to join with you : $codeGen";
	       	$query_code_insert = "INSERT INTO codetable (Code, TotalPlayer) VALUES ('$codeGen',1)";
	       	//echo $query_code_insert;
	       	if(!mysqli_query($link, $query_code_insert))
	       	{
	       		//echo "error saving to database";
	       		$status = "Error generating code";
	       	}
	       	else
	       	{
	       		$status = "Code generated successfully. Please provide
	       		this code to someone to join with you : $codeGen";
	       	}
		//}
    }
?>

<!doctype html>
	<head>
		<html lang="en">
		<script type="text/javascript" src="js/webix.js"></script>
		<link rel="stylesheet" type="text/css" href="css/webix.css">
		<link rel="stylesheet" type="text/css" href="css/newGame.css">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<script type="text/javascript" src="js/newGame.js"></script>
		<meta charset="utf-8">
		<title>New Game</title>
	</head>

	<body>
		</br>
		</br>
		</br>
		<center>
			<div id="newGame"></div>
			</br>
			</br>
			</br>
			<div id="codeGen"><?php echo $status ?></div>
			</br>
			</br>
			<!-- <div id="waiting"></div> -->
			</br>
			<div id="cancel"></div>
			</br>
		</center>
	</body>
</html>