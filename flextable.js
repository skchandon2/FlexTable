    var row_count = 10;
    var cell_count = 4;
    //var _getDataURL = "";
    $(document).ready(function () {  // calling ready function on document (the entire page); calling an anonymous function inside the ready function; calling two functions inside anonymous function
        
        var arrFlextableTemplates = $(".flextable");
        $.each(arrFlextableTemplates, function(i, templatex){
            var $templateRootObj = $(templatex);
            var templateRootId = $templateRootObj.attr("id");
            var currentPageNumber = 1;
            $templateRootObj.data("currentpagenumber", currentPageNumber);

            var curTemplateData = GetDataFromTemplateRoot($templateRootObj);

            var pageSize = curTemplateData.PageSize ;//$templateRootObj.data("pagesize");
            var pageSizeServerSideParam = curTemplateData.PageSizeServerSideParam;//$templateRootObj.data("pagesizeserversideparam");
            var curPageServerSideParam = curTemplateData.CurPageServerSideParam;//$templateRootObj.data("currentpageserversideparam");
            var defaultSortByField = curTemplateData.DefaultSortByField;//$templateRootObj.data("defaultsortbyfield");

            //console.log($(templatex).attr("id"));
            getData(templateRootId, defaultSortByField, pageSize, currentPageNumber, pageSizeServerSideParam, curPageServerSideParam);
            $templateRootObj.data("currentsortbyfield", defaultSortByField);
        });
        //_getDataURL = $("#itemsList").data("getdataurl");
        //getData("#itemsList");
        
        
    });
    
    function getData(strTemplateElementID, paramSortBy="", paramPageSize=5, paramCurPage=1, paramPageSizeServerSideVar="", paramCurPageServerSideVar="")
    {
        
        var templateElementId = "#" + strTemplateElementID;

        var $templateElementObj = $(templateElementId);
        var sortByServerSideParamName = $templateElementObj.data("sortbyserversideparam");
        var curUrl = $templateElementObj.data("getdataurl");
        var curPagesize = paramPageSize;
        var getDataParams = {[sortByServerSideParamName+""]: paramSortBy}; 
        if(paramPageSizeServerSideVar!="")
        {
            getDataParams[paramPageSizeServerSideVar] = curPagesize;
        }
        if(paramCurPageServerSideVar!="")
        {
            getDataParams[paramCurPageServerSideVar] = paramCurPage;
        }
        console.log(getDataParams)
        $.get(curUrl, getDataParams)
            .done(function(datax) {
            //console.log(datax);
            createTable(datax, strTemplateElementID);            
            })
            .fail(function(xhr, status, error) {
                //Ajax request failed.
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + error);
            })
            ;
    }  // end of function getData()

    function createTable(inputData, strTemplateElementID) {
        var $templateElement = $("#" + strTemplateElementID);
        //console.log($templateElement);
        var targetElemId = $templateElement.data("targetid");
        var $targetElemObj = $("#" + targetElemId);
        //console.log(targetElemId);
        $targetElemObj.empty();
        $templateElement.hide();
        var $childElems = $templateElement.find("li");
        
        var $tablex = $("<table/>").addClass("table table-striped table-bordered table-hover");
        var $thead = $("<thead/>");
        var $tbody = $("<tbody/>");
        $tablex.append($thead);
        $tablex.append($tbody);
        row_count = inputData.length;
        
        var $hdrtr =  $("<tr/>");
        $thead.append($hdrtr);
        
        populateHeaderCells($childElems, $hdrtr);


        for (var r = 0; r < row_count; r++) {
            var currentInputLine = inputData[r];
            createAndPopulateOneLine($tbody, $childElems, currentInputLine);
            

        }//(End Of) for (var r=0; r<5; r++)...


        $targetElemObj.append($tablex);

        //create a row of pagination buttons
        createPaginationButtons(targetElemId, strTemplateElementID);
    }//(End Of Function createTable
        
    function populateHeaderCells($childElemsx, $hdrtrx)
    {
        $.each($childElemsx, function(keyx, valx){
            var $curTemplateElement = $(valx);
            var headerText = "";
            if($curTemplateElement.data("sortby") != null)
            {
                headerText = $("<a></a>")
                    .attr("href", "#")
                    .html($curTemplateElement.html())
                    .click(headerSortHandler)
                    .data({"sortbyfield": $curTemplateElement.data("sortby"), "templateid": $childElemsx.parent().attr("id")});
                    ;
            }
            else
            {
                headerText = $curTemplateElement.html();
            }

            var $thcell1 = $("<th/>").html(headerText).addClass("text-primary");
            $hdrtrx.append($thcell1);
        });//(End Of) $.each
    }//(End Of) populateHeaderCells
    
    function createAndPopulateOneLine($tbody, $childElems, currentInputLine)
    {
        var $trx = $("<tr/>").data("rowid", currentInputLine.id).click(function(e){
                e.preventDefault(); 
                var $trc = $(e.target).parent();
                //console.log($(e.target));
                alert($trc.data("rowid"))
                });

            $tbody.append($trx);
            $.each($childElems, function(keyx, valx){
                var curfieldname = $(valx).data("jsonfieldname");

                jsonobj = getJsonValWithPossibleConcat(curfieldname, currentInputLine);
                var $thcell1x = $("<td/>").html(jsonobj);
                $trx.append($thcell1x);
            });//(End Of) $.each

    }//(End Of) function createAndPopulateOneLine()

    function getJsonValWithPossibleConcat(curfieldnameWithPossiblePlus, currentJsonInputLine)
    {
        //check if the current field name has + (this would indicate concat request)
        var curfieldnameSplitByPlusSign = curfieldnameWithPossiblePlus.split("+");
        
        var jsonobj = null;
        
        if(curfieldnameSplitByPlusSign.length>1)
        {

            var concatres = "";
            for(p=0;p<curfieldnameSplitByPlusSign.length; p++)
            {
                if(p>0)
                {
                    concatres +=", ";
                }

                concatres += getJsonVal(curfieldnameSplitByPlusSign[p], currentJsonInputLine);
            }
            jsonobj = concatres;

        }
        else
        {
            jsonobj = getJsonVal(curfieldnameWithPossiblePlus, currentJsonInputLine);
        }
        return jsonobj;
    }//(End Of) getJsonValWithConcat()
    function getJsonVal(curfieldname, currentInputLine)
    {
        var jsonobj = null;
        //check if the current field name has a dot. if so that means there are nested fields
        var curfieldnameSplitByDot = curfieldname.split(".");
        if(curfieldnameSplitByDot.length>1) //if spllitting by dot, we have more than one element, that means there WAS a dot.
        {
            
            for(j=0; j<curfieldnameSplitByDot.length; j++)
            {
                var splitFieldName = curfieldnameSplitByDot[j];
                //console.log(jsonobj)
                if(jsonobj == null)
                {
                    jsonobj = currentInputLine[splitFieldName];
                }
                else
                {
                    jsonobj = jsonobj[splitFieldName];
                }
            }
        }
        else
        {
            jsonobj =  currentInputLine[curfieldname];
        }
        return jsonobj;
    }//(End Of) Function

function headerSortHandler(e)
{
    e.preventDefault(); 
    var curSortBy = $(this).data("sortbyfield");
    var curTemplateId = $(this).data("templateid");
    var $templateRootObj = $("#" + curTemplateId);
    var curTemplateData = GetDataFromTemplateRoot($templateRootObj);
    var pageSize = curTemplateData.PageSize; //$templateRootObj.data("pagesize");
    var pageSizeServerSideParam = curTemplateData.PageSizeServerSideParam; //$templateRootObj.data("pagesizeserversideparam");
    var curPageServerSideParam = curTemplateData.CurPageServerSideParam; //$templateRootObj.data("currentpageserversideparam");
    var curPageNumber = curTemplateData.CurPageNumber; //$templateRootObj.data("currentpagenumber");
    console.log(pageSizeServerSideParam);    
    getData(curTemplateId, curSortBy, pageSize, curPageNumber, pageSizeServerSideParam, curPageServerSideParam);
    $templateRootObj.data("currentsortbyfield", curSortBy);
}//(End Of) Function headerSortHandler

function createPaginationButtons(paramTargetElemId, paramTemplateElementId)
{
    var $templateElement = $("#" + paramTargetElemId);
    var $btnPrev = $("<button/>").html("<").addClass("btn btn-primary").data({"type":"prev", "templateid": paramTemplateElementId}).click(ChangePage);
    var $btnNext = $("<button/>").html(">").addClass("btn btn-primary").data({"type":"next", "templateid": paramTemplateElementId}).click(ChangePage);
    var $btnRow = $("<div/>").addClass("row");
    var $btnCell1 = $("<div/>").addClass("col-sm-6").append($btnPrev);
    var $btnCell2 = $("<div/>").addClass("col-sm-6").append($btnNext).css("text-align", "right");
    $btnRow.append($btnCell1).append($btnCell2);
    $templateElement.append($btnRow);
}//(End Of) Function createPaginationButtons

function ChangePage(e)
{
    e.preventDefault();
    var $curBtn = $(e.target);
    //console.log($curBtn.data())
    var changeType = $curBtn.data("type");
    var templateIdWithNoHash = $curBtn.data("templateid");
    var $templateRootObj = $("#" + templateIdWithNoHash);
    var curTemplateData = GetDataFromTemplateRoot($templateRootObj);
    //console.log($templateRootObj.data("currentpagenumber"))
    var intCurrentPageNumber = parseInt(curTemplateData.CurPageNumber);//parseInt($templateRootObj.data("currentpagenumber"));
    
    console.log(intCurrentPageNumber)
    if(changeType=="prev")
    {
        intCurrentPageNumber--;
    }
    else
    {
        intCurrentPageNumber ++;
    }

    if(intCurrentPageNumber<= 0)
    {
        intCurrentPageNumber = 1;
    }
    else
    {
        var pageSize = curTemplateData.PageSize; //$templateRootObj.data("pagesize");
        var pageSizeServerSideParam = curTemplateData.PageSizeServerSideParam; //$templateRootObj.data("pagesizeserversideparam");
        var curPageServerSideParam = curTemplateData.CurPageServerSideParam; //$templateRootObj.data("currentpageserversideparam");
        //var curPageNumber = $templateRootObj.data("currentpagenumber");
        var curSortBy = curTemplateData.curSortBy; //$templateRootObj.data("currentsortbyfield");//whatever the current value of default is
        //console.log("Changing page: ");    
        getData(templateIdWithNoHash, curSortBy, pageSize, intCurrentPageNumber, pageSizeServerSideParam, curPageServerSideParam);
        $templateRootObj.data("currentpagenumber", intCurrentPageNumber);
    
    }



}//(End Of) Function ChangePage

function GetDataFromTemplateRoot($paramTemplateRootObject)
{
    var pageSize = $paramTemplateRootObject.data("pagesize");
    var pageSizeServerSideParam = $paramTemplateRootObject.data("pagesizeserversideparam");
    var curPageServerSideParam = $paramTemplateRootObject.data("currentpageserversideparam");
    var defaultSortByField = $paramTemplateRootObject.data("defaultsortbyfield");
    var curSortByField = $paramTemplateRootObject.data("currentsortbyfield")
    var curPageNumber = $paramTemplateRootObject.data("currentpagenumber")
    return {
        PageSize: pageSize, 
        PageSizeServerSideParam: pageSizeServerSideParam, 
        CurPageServerSideParam: curPageServerSideParam, 
        DefaultSortByField: defaultSortByField,
        CurSortByField: curSortByField,
        CurPageNumber: curPageNumber
    }

}//(End Of) Function GetDataFromTemplateRoot