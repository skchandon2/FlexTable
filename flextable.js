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
            console.log(datax);// this will show the info it in firebug console
            
        });
        
    }//(End Of) getData()
