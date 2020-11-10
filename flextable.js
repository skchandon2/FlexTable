    var row_count = 10;
    var cell_count = 4;
    var _getDataURL = "";
    $(document).ready(function () {  // calling ready function on document (the entire page); calling an anonymous function inside the ready function; calling two functions inside anonymous function
        

        _getDataURL = $("#itemsList").data("getdataurl");
        getData("#itemsList");
        
        
    });

    function createTable(inputData, strTemplateElementID) {  // function for creating our table; we have to pass in our json data and our template id (list id)
        var $templateElement = $(strTemplateElementID);  // store the id for the unordered list in this variable
        $("#dynamicTable").empty(); // empty the contents of dynamic table before creating a new table
        $templateElement.hide();
        //console.log($templateElement.find("li"));
        var $childElems = $templateElement.find("li");  // this will be an array of list items in our template element, i.e. our unordered list
       var $tablex = $("<table/>").addClass("table table-striped table-bordered table-hover");
       var $thead = $("<thead/>");
       var $tbody = $("<tbody/>");
       $tablex.append($thead);
       $tablex.append($tbody);
      // console.log(inputData);
       row_count = inputData.length;  // number of rows will depend on the length of the array inputData
       
      var $hdrtr =  $("<tr/>");  // variable for header row
      $thead.append($hdrtr);

      /*
      var $thcell1 = $("<th/>").html("Department");
      var $thcell2 = $("<th/>").html("Name");
      var $thcell3 = $("<th/>").html("Age");
      var $thcell4 = $("<th/>").html("Province")
      $hdrtr
          .append($thcell1)
          .append($thcell2)
          .append($thcell3)
          .append($thcell4)
          ;


      /* $.each(inputData[0], function(keyx, fieldx) 
          {  
                  var $thx = $("<th/>").html(makeCamelCase(keyx)); 
                  $hdrtr.append($thx);
          }//(End Of) function inside $.each
      ); //(End Of) $.each */

     populateHeaderCells($childElems, $hdrtr);
     

       for (var r = 0; r < row_count; r++) {  // for loop for creating rows for the table body
           var currentInputLine = inputData[r];  // get the current element of the array inputData (current line of json data)
           // var $trx = $("<tr/>");
           var $trx = $("<tr/>").data("row_id", currentInputLine.id).click(function(e){ // create a row; create a data field for the row, and a click handler
              e.preventDefault(); // do not perform any default actions previously specified; only perform this on
              var $trc = $(e.target).parent();  // get the parent of the clicked cell
              console.log($(e.target));
              alert($trc.data("row_id"))  // display an alert box with the id of the row that was clicked
              });

          $tbody.append($trx);

          createAndPopulateBodyCells($childElems, currentInputLine, $trx);

          /*    
           $tbody.append($trx);
           var $cell1 = $("<td/>").html(currentInputLine.name);
           var $cell2 = $("<td/>").html(currentInputLine.age);
           var $cell3 = $("<td/>").html(currentInputLine.department);
           var $cell4 = $("<td/>").html(currentInputLine.address["street"] + ", " + currentInputLine.address["province"] + ", " + currentInputLine.address["Country"])  // cell 4 will show the values of all the keys in 'address' array in this way 
           $trx
            .append($cell3)
            .append($cell1)
            .append($cell2)
            .append($cell4)
            ;
            */

       }//(End Of) for (var r=0; r<5; r++)...
       


       $("#dynamicTable").append($tablex);
   }//(End Of Function createTable)
    
    function getData(strTemplateElementID, paramSortBy="")
    {

        $.get(_getDataURL, {sortby:paramSortBy})
            .done(function(datax) {
            console.log(datax);// this will show the info it in firebug console
            createTable(datax, strTemplateElementID);
            
        });
        
    }//(End Of) getData()
