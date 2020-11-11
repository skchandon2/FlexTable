<?php
    header('Content-Type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    include 'dbconn.php';

    $sort = 'pubilshyear';    

    if(isset($_REQUEST['sort'])  )
    {
        if ($_REQUEST['sort'] != "") 
        {
            $sort = $_REQUEST['sort'];
        }
        
    }
    

    $result = array();
    
    $recordset = mysql_query("select * from scbooks order by $sort") or die (mysql_error());
    while($row = mysql_fetch_object($recordset)){
        array_push($result, $row);
    }

    echo json_encode($result);
    include 'dbclose.php';
?>