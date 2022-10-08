
<?php
if (isset($_FILES['file'])) {
  if (move_uploaded_file($_FILES['file']['tmp_name'], 'pools/' . $_FILES['file']['name'])) {
    echo '<p class="center">File uploaded successfully.</p>';
    header("refresh:2;url=upload.php");
  }
  else {
    echo '<p class="center">File not uploaded.</p>';
    header("refresh:2;url=upload.php");
  }
}
else if (isset($_GET['delete'])) {
  if (unlink('pools/' . $_GET['delete'])) {
    echo '<p class="center">File deleted.</p>';
    header("refresh:2;url=upload.php");
  }
  else {
    echo '<p class="center">File not deleted.</p>';
    header("refresh:2;url=upload.php");
  }
}
?>
<html>
<head>

	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins&amp;display=swap">
<style>
body {
	font-family: 'Poppins';
  background: #1a1a1a;
  overflow-y: hidden;
  overflow-x: hidden;
}
.center {
  text-align: center;
  color:white;
  font-size:32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top:45vh;
  height: 1%;
}
.center2 {
  text-align: center;
  color:white;
  font-size:32px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1%;
}
</style>
</head>
<body>
</body>
</html>