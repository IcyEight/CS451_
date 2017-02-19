<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST') 
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
      if(isset($_POST['joinGame']))
      {
        /*Creating variables*/
        $code = $_POST["code"];
        $db_codes_query = "SELECT code FROM codetable"; 
        if($db_codes = mysqli_query($link, $db_codes_query)) 
        {
          while($temp1 = mysqli_fetch_array($db_codes, MYSQLI_NUM))
          {
            if($temp1[0] == $code)
            {
              $db_player_num_query = "SELECT TotalPlayer FROM codetable WHERE codetable.code = '$code'";
              $num = mysqli_query($link, $db_player_num_query);
              $temp2 = mysqli_fetch_array($num, MYSQLI_NUM);
              $num = $temp2[0];
              $num++;
              $db_player_query = "UPDATE codetable SET TotalPlayer = $num WHERE codetable.code = '$code'"; 
              echo $db_player_query;
              $temp3 = mysqli_query($link, $db_player_query);
              //var_dump($temp3);
              //echo $db_player_num_query . $db_player_query;
              // echo '<script type="text/javascript">
              //            window.location = "http://localhost:8888/CheckersGame/startGame.php"
              //       </script>';
              // // die(); ?
              // direct to some other html file
              // sdcdsac
              // sdv
            }
          }
        }
      }
      // object(mysqli_result)#3 (5) 
      // { ["current_field"]=> int(0) 
      // ["field_count"]=> int(1) 
      // ["lengths"]=> NULL 
      // ["num_rows"]=> int(1) 
      // ["type"]=> int(0) }
  }
?>

<!doctype html>
	<head>
		<html lang="en">
		<script type="text/javascript" src="js/webix.js"></script>
		<link rel="stylesheet" type="text/css" href="css/webix.css">
		<link rel="stylesheet" type="text/css" href="css/joinGame.css">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<script type="text/javascript" src="js/joinGame.js"></script>
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