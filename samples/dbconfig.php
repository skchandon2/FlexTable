<?php
date_default_timezone_set('America/New_York');

$username = "";
$password = "";
$hostname = "localhost";
$schemaname="pasternDB";

if( file_exists("secrets.php") && is_readable("secrets.php")) {
    include("secrets.php");
}
?>