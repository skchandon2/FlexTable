<?php
    header('Content-Type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
try{
    include 'dbconn.php';

    $sort = 'name';
    $pagesizeStr = '5';
    $curpageNumberStr = '1';

    $filterbynationality = '';
    $filterbyposition = '';
    $filterbyage = 0;
    if(isset($_REQUEST['filterbynationality'])  )
    {
        if ($_REQUEST['filterbynationality'] != "") 
        {
            $filterbynationality = $_REQUEST['filterbynationality'];
        }
        
    }

    if(isset($_REQUEST['filterbyposition'])  )
    {
        if ($_REQUEST['filterbyposition'] != "") 
        {
            $filterbyposition = $_REQUEST['filterbyposition'];
        }
        
    }

    if(isset($_REQUEST['filterbyage'])  )
    {
        if ($_REQUEST['filterbyage'] != "") 
        {
            $filterbyage = $_REQUEST['filterbyage'];
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
    if($filterbynationality!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }

        $whereclause .= "nationality like '%$filterbynationality%'";
    }
    if($filterbyposition!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }
        else
        {
            $whereclause .= " and ";
        }

        $whereclause .= "position like '%$filterbyposition%'";
    }
    
    if($filterbyage!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }
        else
        {
            $whereclause .= " and ";
        }

        $whereclause .= "age = $filterbyage";
    }
    
    $rs = mysql_query("select count(*) from mr_chelsea_players $whereclause");
    $totalCountsRow = mysql_fetch_row($rs);
    $totalCountVal = $totalCountsRow[0];

    $result = array();
    
    $recordset = mysql_query("select * from mr_chelsea_players $whereclause order by $sort limit $recordStartIndex, $pagesizeInt") or die ("{ error: " . mysql_error() . "}");
    while($row = mysql_fetch_object($recordset)){
        array_push($result, $row);
    }

    $finalResult = new stdClass();
    $finalResult->Records = $result;
    $finalResult->TotalRowCount = $totalCountVal;

    echo json_encode($finalResult);
    include 'dbclose.php';
}
catch(Exception $ex)
{
    echo "{Error: ", $ex->getMessage(), "}";
}
?>