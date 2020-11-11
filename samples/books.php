<?php
    header('Content-Type: application/json');
    include 'dbconn.php';

    $sort = isset($_REQUEST['sort']) ? $_REQUEST['sort'] : 'pubilshyear';



    $result = array();


    $rs = mysql_query("select * from scbooks order by $sort") or die (mysql_error());
    

    echo json_encode($result);
    include 'dbclose.php';
?>