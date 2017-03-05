<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST') 
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
      // if(isset($_POST['joinGame']))
      // {
        /*Creating variables*/
        $code = $_POST["code"];
        $db_codes_query = "SELECT Code FROM codetable"; 
        if($db_codes = mysqli_query($link, $db_codes_query)) 
        {
          while($temp1 = mysqli_fetch_array($db_codes, MYSQLI_NUM))
          {
            if($temp1[0] == $code)
            {
              $db_player_num_query = "SELECT TotalPlayer FROM codetable WHERE codetable.Code = '$code'";
              $num = mysqli_query($link, $db_player_num_query);
              $temp2 = mysqli_fetch_array($num, MYSQLI_NUM);
              $num = $temp2[0];
              $num++; // 2nd player joins
              if($num <= 2)
              {
                 $db_player_query = "UPDATE codetable SET TotalPlayer = $num WHERE codetable.Code = '$code'";
                 if($temp3 = mysqli_query($link, $db_player_query))
                 {
                   // Successly added 2nd player. direct to Main Game screen.
                  $joinStatus = 1;
                  //echo 'Successfully added 2nd player';
                  echo $joinStatus;
                 } 
              }
              else
              {
                $joinStatus = 0; 
                //echo 'More than 2 players can not play same game. ';
                echo $joinStatus;
              }
            }
          }
        }
      //}
  }
?>

<!doctype html>
	<head>
		<html lang="en">
		<script type="text/javascript" src="../js/webix.js"></script>
		<link rel="stylesheet" type="text/css" href="../css/webix.css">
		<link rel="stylesheet" type="text/css" href="../css/joinGame.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<script type="text/javascript" src="../js/joinGame.js"></script>
		<meta charset="utf-8">
		<title>Join Game</title>
	</head>

	<body>
		<center>
			<div id="joinGame"></div>
			</br>
			</br>
			</br>
			</br>
			</br>
			<div id="inputForm"></div>
			</br>
			</br>
			</br>
			<div id="cancel"></div>
		</center>
	</body>
</html>