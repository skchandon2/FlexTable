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
            $templateRootObj.data("currentsearchfilter", []);

            var curTemplateData = GetDataFromTemplateRoot($templateRootObj);

            var pageSize = curTemplateData.PageSize ;//$templateRootObj.data("pagesize");
            var pageSizeServerSideParam = curTemplateData.PageSizeServerSideParam;//$templateRootObj.data("pagesizeserversideparam");
            var curPageServerSideParam = curTemplateData.CurPageServerSideParam;//$templateRootObj.data("currentpageserversideparam");
            var defaultSortByField = curTemplateData.DefaultSortByField;//$templateRootObj.data("defaultsortbyfield");
            var defaultSortByDir = curTemplateData.DefaultSortByDir;//$templateRootObj.data("defaultsortbyfield");
            //console.log(defaultSortByDir)
            //console.log($(templatex).attr("id"));
            getData(templateRootId, defaultSortByField, defaultSortByDir,  pageSize, currentPageNumber, pageSizeServerSideParam, curPageServerSideParam);
            $templateRootObj.data("currentsortbyfield", defaultSortByField);
            $templateRootObj.data("currentsortbydir", defaultSortByDir);
        });
        //_getDataURL = $("#itemsList").data("getdataurl");
        //getData("#itemsList");
        
        
    });
    
    function getData(strTemplateElementID, paramSortBy="", paramSortByDir="", paramPageSize=5, paramCurPage=1, paramPageSizeServerSideVar="", paramCurPageServerSideVar="", paramFilterObj=null)
    {
        
        var templateElementId = "#" + strTemplateElementID;

        var $templateElementObj = $(templateElementId);
        var curTemplateData = GetDataFromTemplateRoot($templateElementObj);
        var sortByServerSideParamName = curTemplateData.SortByServerSideParam;
        var sortByDirServerSideParamName = curTemplateData.SortByDirServerSideParam;
        var curUrl = curTemplateData.GetDataUrl;
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
        if(paramSortByDir != "")
        {
            getDataParams[sortByDirServerSideParamName] = paramSortByDir;
        }
        console.log(paramFilterObj);
        if(paramFilterObj!=null)
        {            
            $.each(paramFilterObj, function(i, arrayElemex){
                $.each(arrayElemex, function(keyx, filterx){
                    getDataParams[keyx] = filterx;
                });

            });//(End of) $.each(paramFilterObj)...
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

    function createTable(paramInputJSONObject, paramStrTemplateRootId) {
        var $templateElement = $("#" + paramStrTemplateRootId);
        //console.log($templateElement);
        var curTemplateData = GetDataFromTemplateRoot($templateElement);
        var targetElemId = curTemplateData.TargetElementId;
        var $targetElemObj = $("#" + targetElemId);
        //console.log(targetElemId);
        $targetElemObj.empty();
        $templateElement.hide();
        var $childElems = curTemplateData.ArrChildElements; //$templateElement.find("li");
        
        var $tablex = $("<table/>").addClass("table table-striped table-bordered table-hover");
        var $thead = $("<thead/>");
        var $tbody = $("<tbody/>");
        $tablex.append($thead);
        $tablex.append($tbody);
        var curInputData = {};
        var totalRowCountVal = {};
        var getDataNodePath = curTemplateData.GetDataNodePath;
        var getTotalRowCountPath = curTemplateData.GetDataTotalPath;
        console.log(paramInputJSONObject);
        if(getDataNodePath==null || getDataNodePath=="root")
        {
            curInputData = paramInputJSONObject;
        }
        else
        {
            curInputData = getJsonVal(getDataNodePath, paramInputJSONObject, 1);
        }

        if(getTotalRowCountPath==null)
        {
            totalRowCountVal = -1;
        }
        else
        {
            totalRowCountVal = getJsonVal(getTotalRowCountPath, paramInputJSONObject, 1);
        }
        //console.log(totalRowCountVal)
        $templateElement.data("totalrowcount", totalRowCountVal);

        row_count = curInputData.length;
        
        var $hdrtr =  $("<tr/>");
        $thead.append($hdrtr);
        
        populateHeaderCells($childElems, $hdrtr);


        for (var r = 0; r < row_count; r++) {
            var currentInputLine = curInputData[r];
            createAndPopulateOneLine($tbody, $childElems, currentInputLine);
            

        }//(End Of) for (var r=0; r<5; r++)...
        var $divRow = $("<div/>").addClass("row");
        var $divColm = $("<div/>").addClass("col-sm-12");
        $divColm.append($tablex);
        $divRow.append($divColm);
        

        $targetElemObj.append($divRow);

        //create a row of pagination buttons
        createPaginationButtons(targetElemId, paramStrTemplateRootId);
    }//(End Of Function createTable
        
    function populateHeaderCells($childElemsx, $hdrtrx)
    {
        $.each($childElemsx, function(keyx, valx){
            var $curTemplateChildElement = $(valx);
            var $headerText = null;
            var $filterInputBox = null;
            var $filterBtn = null;
            var $curTemplateRootObj = $childElemsx.parent();
            var curTemplateData = GetDataFromTemplateRoot($curTemplateRootObj);
            if($curTemplateChildElement.data("sortby") != null)
            {
                var $curSortDirSymbol = null;
                if(curTemplateData.CurSortByField == $curTemplateChildElement.data("sortby"))
                {
                    if(curTemplateData.CurSortByDir != null)
                    {
                        console.log(curTemplateData.CurSortByDir)
                        if(curTemplateData.CurSortByDir!=curTemplateData.SortByAscKeyword)
                        {
                            $curSortDirSymbol = $("<i></i>").html("&darr;").css({"margin-left":"3px"});
                        }
                        else if (curTemplateData.CurSortByDir!=curTemplateData.SortByDescKeyword)
                        {
                            $curSortDirSymbol = $("<i></i>").html("&uarr;").css({"margin-left":"3px"});
                        }
                    }
                }
                $headerText = $("<a></a>")
                    .attr("href", "#")
                    .html($curTemplateChildElement.html())
                    .click(headerSortHandler)
                    .data({"sortbyfield": $curTemplateChildElement.data("sortby"), "templateid": $curTemplateRootObj.attr("id")})
                    .append($curSortDirSymbol)
                    ;
            }
            else
            {
                $headerText = $curTemplateChildElement.html();
            }
            if($curTemplateChildElement.data("filterbyserverparam") != null)
            {
                var $templateRootElement = $childElemsx.parent();

                $filterInputBox = $("<input/>").attr("type","text")
                .data(
                        {"filterbyserversideparam":$curTemplateChildElement.data("filterbyserverparam"),
                        "templateid": $templateRootElement.attr("id")
                        }
                    )
                .keydown(filterBtnClickHandler)
                .css({"margin-left": "10px"})
                    ;
                
                //$filterBtn = $("<button/>").addClass("btn btn-primary").text("Search")
                //.data("relatedinput",$filterInputBox)
                //.click(filterBtnClickHandler);

                //Iterate through all the filters currently attached to the root element.
                //  Then check if the current child element's filterbyserverside param is the same.
                //  If same, then retain the value that was typed by the end-user in the input box.
                var curTemplateData = GetDataFromTemplateRoot($templateRootElement);
                var curFiltersArray = curTemplateData.CurSearchFilter;
                $.each(curFiltersArray, function(i, singleFilter){
                    $.each(singleFilter, function(keyx, filterInputValx){
                        if(keyx == $curTemplateChildElement.data("filterbyserverparam"))
                        {
                            $filterInputBox.val(filterInputValx);
                        }
                    });
                });

            }

            var $thcell1 = $("<th/>").append($headerText).addClass("text-primary");
            $thcell1.append($filterInputBox);
            //$thcell1.append($filterBtn);
            $hdrtrx.append($thcell1);
        });//(End Of) $.each (filterInputValx ..
    }//(End Of) populateHeaderCells

    function filterBtnClickHandler(e)
    {
        if ( e.which == 13 ) {
            e.preventDefault();
        }
        else
        {
            return;
        }
        //e.preventDefault();
        //var $curBtn = $(this);
        //var $relatedFilterInput = $($curBtn.data("relatedinput"));
        var $relatedFilterInput = $(this);
        var inputFilterServerSideParam = $relatedFilterInput.data("filterbyserversideparam");        
        var inputFilterText = $relatedFilterInput.val();
        var filterObj = {[inputFilterServerSideParam+""]: inputFilterText};
        
        var templateRootId = $relatedFilterInput.data("templateid");
        var $templateRootObj = $("#" + templateRootId);
        var curTemplateData = GetDataFromTemplateRoot($templateRootObj);
        //we want to start searching at page 1
        var intCurrentPageNumber = 1;//parseInt(curTemplateData.CurPageNumber);
        $templateRootObj.data("currentpagenumber", 1);
        var pageSize = curTemplateData.PageSize; //$templateRootObj.data("pagesize");
        var pageSizeServerSideParam = curTemplateData.PageSizeServerSideParam; //$templateRootObj.data("pagesizeserversideparam");
        var curPageServerSideParam = curTemplateData.CurPageServerSideParam; //$templateRootObj.data("currentpageserversideparam");
        var curSortBy = curTemplateData.CurSortByField;
        var curSortByDir = curTemplateData.CurSortByDir;
        
        var arrFilters = [];
        arrFilters = curTemplateData.CurSearchFilter;

        arrFilters.push(filterObj);


        getData(
                templateRootId,
                curSortBy,
                curSortByDir,   
                pageSize, 
                intCurrentPageNumber, 
                pageSizeServerSideParam, 
                curPageServerSideParam, 
                arrFilters);
        $templateRootObj.data("currentsearchfilter", arrFilters);

    }
    
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
    function getJsonVal(curfieldname, currentInputLine, startIndex=0)
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
    var newSortBy = $(this).data("sortbyfield");
    var curTemplateId = $(this).data("templateid");
    var $templateRootObj = $("#" + curTemplateId);
    var curTemplateData = GetDataFromTemplateRoot($templateRootObj);
    var curFilter = curTemplateData.CurSearchFilter;
    var pageSize = curTemplateData.PageSize; //$templateRootObj.data("pagesize");
    var pageSizeServerSideParam = curTemplateData.PageSizeServerSideParam; //$templateRootObj.data("pagesizeserversideparam");
    var curPageServerSideParam = curTemplateData.CurPageServerSideParam; //$templateRootObj.data("currentpageserversideparam");
    var curPageNumber = curTemplateData.CurPageNumber; //$templateRootObj.data("currentpagenumber");

    var CurSortBy = curTemplateData.CurSortByField;
    
    var curSortByDir = curTemplateData.CurSortByDir;
    var newSortByDir = curSortByDir;
    if(newSortBy == CurSortBy)
    {
        if(curSortByDir == curTemplateData.SortByDescKeyword)
        {
            newSortByDir = curTemplateData.SortByAscKeyword;
        }
        else
        {
            newSortByDir = curTemplateData.SortByDescKeyword;
        }
    }


    getData(
            curTemplateId, 
            newSortBy,
            newSortByDir, 
            pageSize, 
            curPageNumber, 
            pageSizeServerSideParam, 
            curPageServerSideParam, curFilter);
    $templateRootObj.data("currentsortbyfield", newSortBy);
    $templateRootObj.data("currentsortbydir", newSortByDir);
}//(End Of) Function headerSortHandler

function createPaginationButtons(paramTargetElemId, paramTemplateElementId)
{
    var $btnTargetElementDivObj = $("#" + paramTargetElemId);
    
    var $btnPrev = $("<button/>").html("<").addClass("btn btn-primary").data({"type":"prev", "templateid": paramTemplateElementId}).click(ChangePage).css({"margin-top":"-22px"});
    var $btnNext = $("<button/>").html(">").addClass("btn btn-primary").data({"type":"next", "templateid": paramTemplateElementId}).click(ChangePage).css({"margin-left": "5px", "margin-top":"-22px"});
    var $btnRow = $("<div/>").addClass("row").css({"margin-bottom":"15px"});
    //var $btnCell1 = $("<div/>").addClass("col-sm-6");
    
    var curTemplateData = GetDataFromTemplateRoot($("#" + paramTemplateElementId));
    var curPageSize = curTemplateData.PageSize;
    var curTotalRowCount = curTemplateData.TotalRowCount;
    
    var pageBtnCount = Math.ceil(curTotalRowCount/curPageSize);
    
    var $pageBtnGroup = $("<div/>").addClass("col-sm-12 form-inline");

    if (curTemplateData.CurPageNumber > 1)
    {
        $pageBtnGroup.append($btnPrev);
    }
    
    
    var $pageBtnScrollGroup = $("<div/>").css({"display":"block", "overflow-x":"scroll", "overflow-y":"none", "max-width":"300px", "height":"60px"});
    var $pageBtnScrollGroupInner = $("<div/>").addClass("btn-group");
    for(p=0; p<pageBtnCount; p++)
    {
        
        var $pageBtnx = $("<button/>")
            .css({"margin-left": "5px", "display": "inline"})
            .html(p+1);
        if(curTemplateData.CurPageNumber == (p+1))
        {
            $pageBtnx.addClass("btn btn-danger");

        }
        else
        {
            $pageBtnx.addClass("btn btn-primary");
        }
        $pageBtnx.data({"type":"exactPage", "templateid": paramTemplateElementId, "pagenum":(p+1)}).click(ChangePage);
        $pageBtnScrollGroupInner.append($pageBtnx);
    }
    $pageBtnScrollGroup.append($pageBtnScrollGroupInner);
    $pageBtnGroup.append($pageBtnScrollGroup);
    if (curTemplateData.CurPageNumber < pageBtnCount)
    {
        $pageBtnGroup.append($btnNext).css({"text-align": "right"});
    }
    
    $btnRow
        //.append($btnCell1)
        .append($pageBtnGroup);
    $btnTargetElementDivObj.append($btnRow);
}//(End Of) Function createPaginationButtons

function ChangePage(e)
{
    e.preventDefault();
    var $curBtn = $(e.target);
    //console.log($curBtn.data())
    var changeType = $curBtn.data("type");
    var templateIdWithNoHash = $curBtn.data("templateid");
    var curPageNumberIfAny = $curBtn.data("pagenum");
    var $templateRootObj = $("#" + templateIdWithNoHash);
    var curTemplateData = GetDataFromTemplateRoot($templateRootObj);
    var curFilter = curTemplateData.CurSearchFilter;
    //console.log($templateRootObj.data("currentpagenumber"))
    var intCurrentPageNumber = parseInt(curTemplateData.CurPageNumber);//parseInt($templateRootObj.data("currentpagenumber"));
    
    console.log(intCurrentPageNumber)
    if(changeType=="prev")
    {
        intCurrentPageNumber--;
    }
    else if(changeType=="next")
    {
        intCurrentPageNumber ++;
    }
    else if(curPageNumberIfAny!=null)
    {
        intCurrentPageNumber = curPageNumberIfAny;
    }
    else
    {
        return;
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
        var curSortBy = curTemplateData.CurSortByField; //$templateRootObj.data("currentsortbyfield");//whatever the current value of default is
        var curSortByDir = curTemplateData.CurSortByDir;
        
        //console.log("Changing page: ");    
        getData(templateIdWithNoHash, curSortBy,curSortByDir, pageSize, intCurrentPageNumber, pageSizeServerSideParam, curPageServerSideParam,curFilter);
        $templateRootObj.data("currentpagenumber", intCurrentPageNumber);
    
    }



}//(End Of) Function ChangePage

function GetDataFromTemplateRoot($paramTemplateRootObject)
{
    var pageSize = $paramTemplateRootObject.data("pagesize");
    var pageSizeServerSideParam = $paramTemplateRootObject.data("pagesizeserversideparam");
    var curPageServerSideParam = $paramTemplateRootObject.data("currentpageserversideparam");
    var defaultSortByField = $paramTemplateRootObject.data("defaultsortbyfield");
    var sortByDescKeyword = $paramTemplateRootObject.data("sortbydesckeyword");
    var sortByAscKeyword = $paramTemplateRootObject.data("sortbyasckeyword");
    var defaultSortByDir = $paramTemplateRootObject.data("defaultsortbydir");        
    var curSortByField = $paramTemplateRootObject.data("currentsortbyfield")
    var curSortByDir = $paramTemplateRootObject.data("currentsortbydir")
    var curPageNumber = $paramTemplateRootObject.data("currentpagenumber")
    var sortByServerSideParam = $paramTemplateRootObject.data("sortbyserversideparam")
    var sortByDirServerSideParam = $paramTemplateRootObject.data("sortbydirserversideparam")
    var getDataUrl = $paramTemplateRootObject.data("getdataurl")
    var getDataNode = $paramTemplateRootObject.data("nodepath");
    var getDataTotal = $paramTemplateRootObject.data("totalrowcountpath");
    var targetElementId = $paramTemplateRootObject.data("targetid");
    var totalRowCount = $paramTemplateRootObject.data("totalrowcount");
    var arrChildElements = $paramTemplateRootObject.find("li");
    var curSearchFilter = $paramTemplateRootObject.data("currentsearchfilter");
    
    

    return {
        PageSize: pageSize, 
        PageSizeServerSideParam: pageSizeServerSideParam, 
        CurPageServerSideParam: curPageServerSideParam, 
        DefaultSortByField: defaultSortByField,  
        SortByDescKeyword: sortByDescKeyword,
        SortByAscKeyword: sortByAscKeyword,
        DefaultSortByDir: defaultSortByDir,
        CurSortByField: curSortByField,
        CurSortByDir: curSortByDir,
        CurPageNumber: curPageNumber,
        SortByServerSideParam: sortByServerSideParam,
        SortByDirServerSideParam: sortByDirServerSideParam,
        GetDataUrl: getDataUrl,
        GetDataNodePath: getDataNode,
        GetDataTotalPath: getDataTotal,
        TargetElementId: targetElementId,
        TotalRowCount: totalRowCount, 
        ArrChildElements: arrChildElements,
        CurSearchFilter: curSearchFilter
    }

}//(End Of) Function GetDataFromTemplateRoot


