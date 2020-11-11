<?php
    header('Content-Type: application/json');
    include 'dbconn.php';

    $sort = isset($_POST['sort']) ? strval($_POST['sort']) : 'pubilshyear';



    $result = array();


    $rs = mysql_query("select * from scbooks order by $sort") or die (mysql_error());
    $items = array();
    while($row = mysql_fetch_object($rs)){
        array_push($items, $row);
    }
    $result["rows"] = $items;

    echo json_encode($result);
    include 'dbclose.php';
?>