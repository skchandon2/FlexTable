<?php
    header('Content-Type: application/json');
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
try{
    include 'dbconn.php';

    $sort = 'pubilshyear'; 
    $sortbydirection = '';
    $pagesizeStr = '5';
    $curpageNumberStr = '1';

    $filterbyauthor = '';
    $filterbypublisher = '';
    $filterbyyear = 0;
    if(isset($_REQUEST['filterbyauthor'])  )
    {
        if ($_REQUEST['filterbyauthor'] != "") 
        {
            $filterbyauthor = $_REQUEST['filterbyauthor'];
        }
        
    }

    if(isset($_REQUEST['filterbypublisher'])  )
    {
        if ($_REQUEST['filterbypublisher'] != "") 
        {
            $filterbypublisher = $_REQUEST['filterbypublisher'];
        }
        
    }

    if(isset($_REQUEST['filterbyyear'])  )
    {
        if ($_REQUEST['filterbyyear'] != "") 
        {
            $filterbyyear = $_REQUEST['filterbyyear'];
        }
        
    }

    if(isset($_REQUEST['sort'])  )
    {
        if ($_REQUEST['sort'] != "") 
        {
            $sort = $_REQUEST['sort'];
            
            if(isset($_REQUEST['sortbydirection'])  )
            {
                if ($_REQUEST['sortbydirection'] != "") 
                {
                    $sortbydirection = $_REQUEST['sortbydirection'];
                    if($sortbydirection=="asc")
                    {
                        $sort .= " asc";
                    }
                    else if($sortbydirection=="desc")
                    {
                        $sort .= " desc";
                    }
                }
                
            }
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
    if($filterbyauthor!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }

        $whereclause .= "authorname like '%$filterbyauthor%'";
    }
    if($filterbypublisher!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }
        else
        {
            $whereclause .= " and ";
        }

        $whereclause .= "publishername like '%$filterbypublisher%'";
    }

    if($filterbyyear!='')
    {
        if($whereclause=="")
        {
            $whereclause .= " where ";
        }
        else
        {
            $whereclause .= " and ";
        }
        $opexists_gt = strpos($filterbyyear, '>');
        $opexists_lt = strpos($filterbyyear, '<');
        
        if($opexists_gt !== FALSE)
        {
            $whereclause .= "pubilshyear $filterbyyear";
        }
        else if($opexists_lt !== FALSE)
        {
            $whereclause .= "pubilshyear $filterbyyear";
        }
        else
        {
            $whereclause .= "pubilshyear = $filterbyyear";
        }
        
    }

    $strSql = "select count(*) from scbooks $whereclause";
    //print $strSql;
    $rs = mysql_query($strSql);
    $totalCountsRow = mysql_fetch_row($rs);
    $totalCountVal = $totalCountsRow[0];
    //echo $totalCountVal;

    //$finalResult = array();
    $result = array();
    $strSql2 = "select * from scbooks $whereclause order by $sort limit $recordStartIndex, $pagesizeInt";
    //print $strSql2;
    $recordset = mysql_query($strSql2) or die ("{ error: " . mysql_error() . "}");
    while($row = mysql_fetch_object($recordset)){
        array_push($result, $row);
    }
    $finalResult = new stdClass();
    $finalResult->Records = new stdClass();
    $finalResult->Records->Details = $result;
    $finalResult->TotalRowCount = $totalCountVal;
    echo json_encode($finalResult);
    include 'dbclose.php';
}
catch(Exception $ex)
{
    echo "{Error: ", $ex->getMessage(), "}";
}
?>