
<html>
	<head>
  	<title>PHP Test</title>
 	</head>
 	<body>
		<?php
		// Open connection
		try 
		{
			$pdo = new PDO('mysql:host=localhost;dbname=ti_innovation_lab', 'root', 'Ihateucf7551with*passion');

		}
		catch (PDOException $e) 
		{
    			echo 'Error: ' . $e->getMessage();
    			exit();
		}

		// Run Query
		$sql 	= 'SELECT * FROM Student';
		$stmt 	= $pdo->prepare($sql); // Prevent MySQl injection. $stmt means statement
		$stmt->execute();
		while ($row = $stmt->fetch())
		{
			echo $row['first_name'];
		}

		// Close connection
		$pdo = null;
		?>
	</body>
</html>
