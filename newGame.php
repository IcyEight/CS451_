<?php
	if($_SERVER['REQUEST_METHOD'] == 'GET') 
	{
		$user = 'root';
	    $password = 'password';
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

		if(isset($_GET['newGame'])) 
		{
			$charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			for($i=0; $i<6; $i++) 
	           $codeGen .= $charset[(mt_rand(0,(strlen($charset)-1)))]; 
	       	echo "give this code to someone 
	       	to join with you : $codeGen";

	       	$query_code_insert = "INSERT INTO codetable (code) VALUES ('$codeGen')";
	       	//echo $query_code_insert;
	       	if(!mysqli_query($link, $query_code_insert))
	       	{
	       		echo "error saving to database";
	       	}
		}
    }
?>

<!DOCTYPE html>
<html>
<head>
	<title>Sudo Server Talk</title>
</head>
<body>
<form method="get">
	<input type="submit" name="newGame" value="New Game">
</form>
</body>
</html>