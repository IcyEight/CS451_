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
      echo "you have connected successfully.\n";

        /*Creating variables*/
        $code = $_POST["code"];

        $db_codes_query = "SELECT code FROM codetable"; 
        if ($db_codes = mysqli_query($link, $db_codes_query)) 
        {
          while($temp = mysqli_fetch_array($db_codes, MYSQLI_NUM))
          {
            if($temp[0] == $code)
            {
              echo 'found a match';
            }
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
<h1> Game Starting in a few seconds! </h1>
</body>
</html>