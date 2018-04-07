angular.module('peopleApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


.controller('peopleController', function($scope, $http, $interval, $cookies) {
//1. Check if the user is logged in?

//2. If the logged in user has the previliage to view?

//3.Otther data to be displayed on the screeen ('badges', 'messages', 'notificaitons')

/*
      //Check if logged in
      if($cookies.get("dashManager")){
        $scope.isLoggedIn = true;
      }
      else{
        $scope.isLoggedIn = false;
        window.location = "adminlogin.html";
      }
      
*/

      //Logout function
      $scope.logoutNow = function(){
        if($cookies.get("dashManager")){
          $cookies.remove("dashManager");
          window.location = "adminlogin.html";
        }
      }
      
      //Schools basic info
      $scope.schoolCode = localStorage.getItem("schoolCode");
      $scope.schoolFancyName = localStorage.getItem("schoolCity");

      $scope.isSearched = false;
      $scope.isFound = false;
      $scope.singleStudent = false;
      $scope.studentData = "";
      $scope.newStudent = [];
      $scope.newStudent.fName = "";
      $scope.newStudent.lName = "";
      $scope.newStudent.height = "";
      $scope.newStudent.weight = "";
      $scope.newStudent.dob = "";
      $scope.newStudent.doj = "";
      $scope.newStudent.class = "";
      $scope.newStudent.division = "";
      $scope.newStudent.stream = "";
      $scope.newStudent.section = "";
      $scope.newStudent.gender = "";
      $scope.newStudent.bloodGroup = "";
      $scope.newStudent.contactAddress = "";
      $scope.newStudent.contactPhone = "";
      $scope.newStudent.religion = "";
      $scope.newStudent.caste = "";
      $scope.newStudent.location = "";
      $scope.newStudent.city = "";
      $scope.newStudent.pincode = "";
      $scope.newStudent.father = {};
      $scope.newStudent.father.name = "";
      $scope.newStudent.father.mobile = "";
      $scope.newStudent.father.email = "";
      $scope.newStudent.father.occupation = "";
      $scope.newStudent.father.income = "";
      $scope.newStudent.father.location = "";
      $scope.newStudent.mother = {};
      $scope.newStudent.mother.name = "";
      $scope.newStudent.mother.mobile = "";
      $scope.newStudent.mother.email = "";
      $scope.newStudent.mother.occupation = "";
      $scope.newStudent.mother.income = "";
      $scope.newStudent.mother.location = "";


      $scope.searchKey = "";
      $scope.errorMessage = "";
      $scope.divisions = {};

      $scope.search = function(search_key){

            var data = {};
            data.token = $cookies.get("dashManager");
            data.key = search_key;
            console.log("Goes to server");
            console.log(data);

            $http({
              method  : 'POST',
              url     : 'http://www.schooldash.xyz/services/fetchstudents.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                console.log("Comes from server");
                console.log(response);

            if(response.data.status){
              $scope.isSearched = true;
              $scope.isFound = true;
              $scope.studentData = response.data.response;

              if($scope.studentData.length == 1){
                $scope.singleStudent = true;
                $scope.studentData = $scope.studentData[0];
                console.log($scope.studentData);
              }

              else{
                $scope.singleStudent = false;
              }
            }
            
            else{
              $scope.isSearched = true;
              $scope.isFound = false;
              $scope.studentData = {};
            }

            });
              
      }

      $scope.createStudent = function(){

            $scope.newStudent.dob = document.getElementById('dob1').value;
            console.log($scope.dob);

            if($scope.newStudent.gender === ''){
              $scope.errorMessage = 'Mention the gender of the student';
            }
            else if($scope.newStudent.fName === ''){
              $scope.errorMessage = 'Mention the first name of the student';
            }
            else if($scope.newStudent.lName === ''){
              $scope.errorMessage = 'Mention the last name of the student';
            }
            else if($scope.newStudent.class === ''){
              $scope.errorMessage = 'Mention the class of the student';
            }
            else if($scope.newStudent.division === ''){
              $scope.errorMessage = 'Mention the division of the student';
            }
            else if($scope.newStudent.height === ''){
              $scope.errorMessage = 'Mention the height of the student';
            }
            else if($scope.newStudent.weight === ''){
              $scope.errorMessage = 'Mention the weight of the student';
            }
            else if($scope.newStudent.religion === ''){
              $scope.errorMessage = "Mention the student's religion";
            }
            else if($scope.newStudent.caste === ''){
              $scope.errorMessage = "Mention the student's caste";
            }
            else if($scope.newStudent.bloodGroup === ''){
              $scope.errorMessage = "Mention the student's Blood Group";
            }
            else if($scope.newStudent.contactAddress === ''){
              $scope.errorMessage = "Mention the student's Address";
            }
            else if($scope.newStudent.pincode === ''){
              $scope.errorMessage = "Mention the student's location Pin Code";
            }
            else if($scope.newStudent.contactPhone === ''){
              $scope.errorMessage = "Mention the student's Telephone Number";
            }
            else if($scope.newStudent.class > 10){
              if($scope.newStudent.stream === ''){
                $scope.errorMessage = 'Mention the date of birth of the student';
              }
            }
            else if($scope.newStudent.father.name === ''){
              $scope.errorMessage = "Mention the father's name";
            }
            else if($scope.newStudent.father.mobile === ''){
              $scope.errorMessage = "Mention the father's mobile number";
            }
            else if($scope.newStudent.father.email === ''){
              $scope.errorMessage = "Mention the father's email";
            }
            else if($scope.newStudent.father.occupation === ''){
              $scope.errorMessage = "Mention the father's occupation";
            }
            else if($scope.newStudent.father.income === ''){
              $scope.errorMessage = "Mention the father's income";
            }
            else if($scope.newStudent.father.location === ''){
              $scope.errorMessage = "Mention the father's office address";
            }
            else if($scope.newStudent.mother.name === ''){
              $scope.errorMessage = "Mention the mother's name";
            }
            else if($scope.newStudent.mother.occupation === ''){
              $scope.errorMessage = "Mention the mother's occupation";
            }
            else if($scope.newStudent.mother.income === ''){
              $scope.errorMessage = "Mention the mother's income";
            }
            else if($scope.newStudent.mother.location === ''){
              $scope.errorMessage = "Mention the mother's office address";
            }
            else if($scope.newStudent.dob === ''){
              $scope.errorMessage = 'Mention the Date of Birth of the student';
            }
            else if($scope.newStudent.location === ''){
              $scope.errorMessage = 'Mention the Area name and/or Landmark';
            }
            else if($scope.newStudent.city === ''){
              $scope.errorMessage = "Mention the student's city name";
            }

            else{
            
                        var data = {};
                        data.token = $cookies.get("dashManager");
                        data.fName = $scope.newStudent.fName;
                        data.lName = $scope.newStudent.lName;
                        data.gender = $scope.newStudent.gender;
                        data.dob = $scope.newStudent.dob;
                        data.height = $scope.newStudent.height;
                        data.weight = $scope.newStudent.weight;
                        data.religion = $scope.newStudent.religion;
                        data.bloodGroup = $scope.newStudent.bloodGroup;
                        data.contactAddress = $scope.newStudent.contactAddress;
                        data.location = $scope.newStudent.location;
                        data.city = $scope.newStudent.city;
                        data.pincode = $scope.newStudent.pincode;
                        data.caste = $scope.newStudent.caste;
                        data.class = $scope.newStudent.class;
                        data.division = $scope.newStudent.division.divisions;
                        data.stream = $scope.newStudent.stream;
                        data.fatherName = $scope.newStudent.father.name;
                        data.fatherMobile = $scope.newStudent.father.mobile;
                        data.fatherEmail = $scope.newStudent.father.email;
                        data.fatherOccupation = $scope.newStudent.father.occupation;
                        data.fatherIncome = $scope.newStudent.father.income;
                        data.fatherAddress = $scope.newStudent.father.location;
                        data.motherName = $scope.newStudent.mother.name;
                        data.motherMobile = $scope.newStudent.mother.mobile;
                        data.motherEmail = $scope.newStudent.mother.email;
                        data.motherOccupation = $scope.newStudent.mother.occupation;
                        data.motherIncome = $scope.newStudent.mother.income;
                        data.motherAddress = $scope.newStudent.mother.location;
            
            
                        console.log("Goes to server");
                        console.log(data);
            
                        $http({
                          method  : 'POST',
                          url     : 'http://www.schooldash.xyz/services/createstudent.php',
                          data    : data,
                          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                         })
                         .then(function(response) {
                            console.log("Comes from server");
                            console.log(response);
            
                        if(response.data.status){
                          $scope.cancelCreateView();
                          $scope.newStudent = []; 
                          $scope.errorMessage = "";
                        }
            
                        else{
                          $scope.errorMessage = response.data.error;
                        }
                    });
                }
      }

      $scope.updateDivList = function(){

            var data = {};

            if($scope.newStudent.class < 11){
              $scope.newStudent.stream = "";
            }

            data.token = $cookies.get("dashManager");
            data.class = $scope.newStudent.class;
            data.stream = $scope.newStudent.stream;

            console.log("Goes to server");
            console.log(data);

            $http({
              method  : 'POST',
              url     : 'http://www.schooldash.xyz/services/fetchdivisionlist.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                console.log("Comes from server");
                console.log(response);

            if(response.data.status){
              $scope.divisions = response.data.response;

              console.log($scope.divisions);
            }

            else{
              $scope.divisions = {};
            }
        });
      }

      $scope.goToStudentProfile = function(search_key){
            
            var data = {};
            data.token = $cookies.get("dashManager");
            data.key = search_key;
            console.log("Goes to server");
            console.log(data);

            $http({
              method  : 'POST',
              url     : 'http://www.schooldash.xyz/services/fetchstudents.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                console.log("Comes from server");
                console.log(response);

            if(response.data.status){
              $scope.singleStudent = true;
              $scope.isSearched = true;
              $scope.isFound = true;

              $scope.studentData = response.data.response[0];   
            }

            else{
              $scope.isSearched = true;
              $scope.isFound = false;
              $scope.studentData = {}
            }
      });
    }


      //Edit Student Info

         setTimeout(function(){
        $('#dob').datetimepicker({  
            format: "dd-mm-yyyy",
            weekStart: 1,
              todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
        })  
      }, 200);

      setTimeout(function(){
        $('#dob1').datetimepicker({  
            format: "dd-mm-yyyy",
            weekStart: 1,
              todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
        })  
      }, 200);
      
      $scope.createStudentView = function() {
    	$scope.createView = true;
  }
  
        $scope.cancelCreateView = function() {
    	$scope.createView = false;
  }

  $scope.studentEditInfo = $scope.studentData;
      console.log($scope.studentData)
        console.log($scope.studentEditInfo);

      $scope.saveEditChanges = function(){

      }

});