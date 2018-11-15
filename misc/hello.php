<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
<?php
// Open Connection
$con = @mysqli_connect('localhost', 'root', 'Ihateucf7551with*passion', 'ti_innovation_lab');

if (!$con) {
    echo "Error: " . mysqli_connect_error();
	exit();
}

// Some Query
$sql 	= 'SELECT * FROM Student';
$query 	= mysqli_query($con, $sql);
while ($row = mysqli_fetch_array($query))
{
	echo $row['first_name'];
}

// Close connection
mysqli_close ($con);

?>


 
 </body>
</html>
