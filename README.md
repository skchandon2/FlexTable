# FlexTable
Just Another JQuery Grid

## Usage:
Requires jquery and bootstrap.

Then in your html page:

    <ul id="itemsList" data-getdataurl = "persons.php" data-sortbyserversideparam="sortby">
        
        <li data-jsonfieldname="name" data-sortby="name">Name</li>
        <li data-jsonfieldname="age" data-sortby="age">Age</li>
        <li data-jsonfieldname="address.street+address.province+address.country">Full Address</li>
        <li data-jsonfieldname="department" data-sortby="department">Department</li>
    </ul>

    <div id="dynamicTable"></div>
    <script type="text/javascript" src="../flextable.js"></script>
