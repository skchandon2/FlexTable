<?php
    header('Content-Type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
try{
    include 'dbconn.php';

    $sort = 'itemname'; 
    $pagesizeStr = '5';
    $curpageNumberStr = '1';   

    $taskfilter = '';
    $itemfilter = '';
    if(isset($_REQUEST['taskfilter'])  )
    {
        if ($_REQUEST['taskfilter'] != "") 
        {
            $taskfilter = $_REQUEST['taskfilter'];
        }
        
    }

    if(isset($_REQUEST['itemfilter'])  )
    {
        if ($_REQUEST['itemfilter'] != "") 
        {
            $itemfilter = $_REQUEST['itemfilter'];
        }
        
    }

    if(isset($_REQUEST['sort'])  )
    {
        if ($_REQUEST['sort'] != "") 
        {
            $sort = $_REQUEST['sort'];
        }
        
    }

    if(isset($_REQUEST["pagesize"]))
    {
        $pagesizeStr = $_REQUEST["pagesize"];
    }

    if(isset($_REQUEST["curpage"]))
    {
        $curpageNumberStr = $_REQUEST["curpage"];
    }

    //$pagesizeStr = $_REQUEST["pagesize"];
    //$curpageNumberStr = $_REQUEST["curpage"];

    $pagesizeInt = intval($pagesizeStr);
    $curpageNumberInt = intval($curpageNumberStr);
    
    $recordStartIndex = ($curpageNumberInt - 1) * $pagesizeInt;

    $whereclause = "";
    if($taskfilter!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }

        $whereclause .= "taskname like '%$taskfilter%'";
    }
    if($itemfilter!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }
        else
        {
            $whereclause .= " and ";
        }

        $whereclause .= "itemname like '%$itemfilter%'";
    }
    $rs = mysql_query("select count(*) from nn_list $whereclause");
    $totalCountsRow = mysql_fetch_row($rs);
    $totalCountVal = $totalCountsRow[0];
    //echo $totalCountVal;

    //$finalResult = array();
    $result = array();
    
    
    $recordset = mysql_query("select * from nn_list $whereclause order by $sort limit $recordStartIndex, $pagesizeInt") or die ("{ error: " . mysql_error() . "}");
    while($row = mysql_fetch_object($recordset)){
        array_push($result, $row);
    }
    $finalResult = new stdClass();
    $finalResult->Records = $result;
    $finalResult->TotalRowCount = $totalCountVal;
    echo json_encode($finalResult);
    include 'dbclose.php';

    //echo json_encode($result);
    //include 'dbclose.php';
}
catch(Exception $ex)
{
    echo "{Error: ", $ex->getMessage(), "}";
}
?>