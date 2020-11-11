<?php
    header('Content-Type: application/json');
    include 'dbconn.php';

    $sort = isset($_REQUEST['sort']) ? $_REQUEST['sort'] : 'pubilshyear';



    $result = array();


    $recordset = mysql_query("select * from scbooks order by $sort") or die (mysql_error());
    while($row = mysql_fetch_object($recordset)){
        array_push($result, $row);
    }

    echo json_encode($result);
    include 'dbclose.php';
?>