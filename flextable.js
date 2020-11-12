    var row_count = 10;
    var cell_count = 4;
    //var _getDataURL = "";
    $(document).ready(function () {  // calling ready function on document (the entire page); calling an anonymous function inside the ready function; calling two functions inside anonymous function
        
        var arrFlextableTemplates = $(".flextable");
        $.each(arrFlextableTemplates, function(i, templatex){
            
            //console.log($(templatex).attr("id"));
            getData($(templatex).attr("id"));
        });
        //_getDataURL = $("#itemsList").data("getdataurl");
        //getData("#itemsList");
        
        
    });
    
    function getData(strTemplateElementID, paramSortBy="")
    {
        
        var templateElementId = "#" + strTemplateElementID;

        var $templateElementObj = $(templateElementId);
        var sortByServerSideParamName = $templateElementObj.data("sortbyserversideparam");
        var curUrl = $templateElementObj.data("getdataurl");
        var getDataParams = {[sortByServerSideParamName+""]: paramSortBy}; 
        //console.log(getDataParams)
        $.get(curUrl, getDataParams)
            .done(function(datax) {
            //console.log(datax);
            createTable(datax, templateElementId);            
            })
            .fail(function(xhr, status, error) {
                //Ajax request failed.
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + error);
            })
            ;
    }  // end of function getData()

    function createTable(inputData, strTemplateElementID) {
        var $templateElement = $(strTemplateElementID);
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
    //console.log(curSortBy);
    getData(curTemplateId, curSortBy);

}//(End Of) headerSortHandler