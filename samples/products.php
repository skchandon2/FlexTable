<?php
    header('Content-Type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
try{
    include 'dbconn.php';

    $sort = 'price';    
    $pagesizeStr = '5';
    $curpageNumberStr = '1';

    $filterbyProduct = '';
    $filterbyStore = '';
    if(isset($_REQUEST['filterbyProduct'])  )
    {
        if ($_REQUEST['filterbyProduct'] != "") 
        {
            $filterbyProduct = $_REQUEST['filterbyProduct'];
        }
        
    }
    if(isset($_REQUEST['filterbyStore']))
    {
        if($_REQUEST['filterbyStore'] != "")
        {
            $filterbyStore = $_REQUEST['filterbyStore'];
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

    $pagesizeInt = intval($pagesizeStr);
    $curpageNumberInt = intval($curpageNumberStr);

    $recordStartIndex = ($curpageNumberInt - 1) * $pagesizeInt;

    $whereclause = "";
    if($filterbyProduct!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }

        $whereclause .= "product_name like '%$filterbyProduct%'";
    }
    if($filterbyStore !='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }
        else
        {
            $whereclause .= " and ";
        }
        $whereclause .= "store_name like '%$filterbyStore%'";
    }

    $rs = mysql_query("select count(*) from fatima_products $whereclause");
    $totalCountsRow = mysql_fetch_row($rs);
    $totalCountVal = $totalCountsRow[0];
    //echo $totalCountVal;

    //$finalResult = array();
  
    $result = array();
    
    $recordset = mysql_query("select * from fatima_products $whereclause order by $sort limit $recordStartIndex, $pagesizeInt") or die ("{ error: " . mysql_error() . "}");
    while($row = mysql_fetch_object($recordset)){
        array_push($result, $row);
    }

    $finalResult = new stdClass();
    $finalResult->Records = $result;
    //$finalResult->Records->Details = $result;
    $finalResult->TotalRowCount = $totalCountVal;
    echo json_encode($finalResult);
    include 'dbclose.php';
}
catch(Exception $ex)
{
    echo "{Error: ", $ex->getMessage(), "}";
}
?>