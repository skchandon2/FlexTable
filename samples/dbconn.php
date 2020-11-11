<?php

	include("dbconfig.php");
	$conn = mysql_connect($hostname, $username, $password)
		or die("Unable to connect to MySQL");
	//print "Connected to MySQL Test Database<br>";
	mysql_select_db($schemaname, $conn);
?>