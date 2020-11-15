<?php
    header('Content-Type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
try{
    include 'dbconn.php';

    $sort = 'pubilshyear';    
    $pagesizeStr = '5';
    $curpageNumberStr = '1';


    if(isset($_REQUEST['sort'])  )
    {
        if ($_REQUEST['sort'] != "") 
        {
            $sort = $_REQUEST['sort'];
        }
        
    }
    
    $pagesizeStr = $_REQUEST["pagesize"];
    $curpageNumberStr = $_REQUEST["curpage"];

    $pagesizeInt = intval($pagesizeStr);
    $curpageNumberInt = intval($curpageNumberStr);

    $recordStartIndex = ($curpageNumberInt - 1) * $pagesizeInt;
    

    $result = array();
    
    $recordset = mysql_query("select * from scbooks order by $sort limit $recordStartIndex, $pagesizeInt") or die ("{ error: " . mysql_error() . "}");
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