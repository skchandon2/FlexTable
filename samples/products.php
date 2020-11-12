<?php
    header('Content-Type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
try{
    include 'dbconn.php';

    $sort = 'price';    

    if(isset($_REQUEST['sort'])  )
    {
        if ($_REQUEST['sort'] != "") 
        {
            $sort = $_REQUEST['sort'];
        }
        
    }
    

    $result = array();
    
    $recordset = mysql_query("select * from fatima_products order by $sort") or die ("{ error: " . mysql_error() . "}");
    while($row = mysql_fetch_object($recordset)){
        array_push($result, $row);
    }

    echo json_encode($result);
    include 'dbclose.php';
}
catch(Exception $ex)
{
    echo "{Error: ", $ex->getMessage(), "}";
}
?>