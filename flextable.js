    var row_count = 10;
    var cell_count = 4;
    var _getDataURL = "";
    $(document).ready(function () {  // calling ready function on document (the entire page); calling an anonymous function inside the ready function; calling two functions inside anonymous function
        

        _getDataURL = $("#itemsList").data("getdataurl");
        getData("#itemsList");
        
        
    });
    
    function getData(strTemplateElementID, paramSortBy="")
    {

        $.get(_getDataURL, {sortby:paramSortBy})
            .done(function(datax) {
            console.log(datax);
            createTable(datax, strTemplateElementID);
            
        });
    }  // end of function getData()

    function createTable(inputData, strTemplateElementID) {
        var $templateElement = $(strTemplateElementID);
        $("#dynamicTable").empty();
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


        $("#dynamicTable").append($tablex);
    }//(End Of Function createTable
        
    function populateHeaderCells($childElemsx, $hdrtrx)
    {
        $.each($childElemsx, function(keyx, valx){
            var $curTemplateElement = $(valx);
            var headerText = "";
            if($curTemplateElement.data("sortyby") != null)
            {
                headerText = $("<a></a>")
                    .attr("href", "#")
                    .html($curTemplateElement.html())
                    .click(headerSortHandler)
                    .data("sortby", $curTemplateElement.data("sortyby"));
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