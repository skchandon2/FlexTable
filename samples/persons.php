<?php
    header('Content-Type: application/json');

    $sortby = isset($_REQUEST["sortby"])? $_REQUEST["sortby"] : "age";
    //echo json_encode($_REQUEST);
    //return;
    class person
    {
        public $name = "";
        public $age = 10;
        public $department = "";
        public $address = null;

        public function __construct() {
            $this->address = new address();
        }
    }

    class address
    {
        public $street = "";
        public $province = "";
        public $country = "";
    }

    $arr = array();
    
    $obj1 = new person;
    $obj1->name = "Acott";
    $obj1->age = 20;
    $obj1->department = "IT";
    $obj1->address->street = "444 pastern";
    $obj1->address->province = "ON";
    $obj1->address->country = "Canada";

    $arr[0] = $obj1;

    $obj2 = new person;
    $obj2->name = "aiger";
    $obj2->age = 23;
    $obj2->department = "HR";
    $obj2->address->street = "222 pastern";
    $obj2->address->province = "ON";
    $obj2->address->country = "Canada";

    $arr[1] = $obj2;

    $obj3 = new person;
    $obj3->name = "Jane";
    $obj3->age = 25;
    $obj3->department = "FINANCE";
    $obj3->address->street = "333 pastern";
    $obj3->address->province = "ON";
    $obj3->address->country = "Canada";

    $arr[2] = $obj3;    

    function compareNames($a, $b) {
        return strcmp($a->name, $b->name);
    }

    function compareAges($a, $b) {
        return ($a->age> $b->age);
    }
    
    function compareDepartments($a, $b) {
        return strcmp($a->name, $b->name);
    }
    
    if($sortby == "name")
    {
        usort($arr, "compareNames");
    }
    else if($sortby == "age")
    {
        usort($arr, "compareAges");
    }
    else if($sortby == "department")
    {
        usort($arr, "compareDepartments");
    }


    echo json_encode($arr);
?>