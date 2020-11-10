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