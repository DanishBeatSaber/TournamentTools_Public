<html>
  <head>
    <title>Upload File - Supports both .json and .bplist</title>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins&amp;display=swap">
	<link rel="stylesheet" href="./assets/css/main.css">
  </head>
  <body class="center">	<br>
  <p>Supports both .json and .bplist playlists</p><br>
    <form action="func.php" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" style="min-width: 600px;">
      <input type="submit" value="Upload" />
    </form>
    <!-- Show contents from ./pools/ allowing to delete them -->
    <p>Current playlists in ./pools/</p>
    <?php
      $files = scandir('./pools/');
      foreach($files as $file) {
        if($file != '.' && $file != '..') {
          echo '<a href="./pools/'.$file.'">'.$file.'</a> | <a style="color:red;" href="func.php?delete='.$file.'">Delete</a><br />';
        }
      }
    ?>
  </body>
</html>