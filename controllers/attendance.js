angular.module('attendanceApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('attendanceController', function($scope, $http, $interval, $cookies) {
//promotions --> purchasse
//Coupon --> payments
//combo --> out

/*
    //Check if logged in
    if($cookies.get("zaitoonAdmin")){
      $scope.isLoggedIn = true;
    }
    else{
      $scope.isLoggedIn = false;
      window.location = "adminlogin.html";
    }
*/



        $('#new_referal_date').datetimepicker({  // Date
		    format: "dd-mm-yyyy",
		    weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 1
	    });


$scope.fetchFigures = function(){

    $scope.figure_total_referers = 0;
    $scope.figure_total_referees = 0;
    $scope.figure_converted_referees = 0;	

		      		var data = {};
		        	data.token = $cookies.get("zaitoonAdmin");

			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/fetchreferalfigures.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              
			              if(response.data.status){

						    $scope.figure_total_referers = response.data.figure_total_referers;
						    $scope.figure_total_referees = response.data.figure_total_referees;
						    $scope.figure_converted_referees = response.data.figure_converted_referees;	
			              
			              }
			         });    
}

$scope.fetchFigures();





    //Logout function
    $scope.logoutNow = function(){
      if($cookies.get("zaitoonAdmin")){
        $cookies.remove("zaitoonAdmin");
        window.location = "adminlogin.html";
      }
    }

     
    $scope.outletCode = localStorage.getItem("branch");

	 $scope.saveNewContent = function(){
		
				if($scope.addNewContent.name == ""){
		      		$scope.newContentSaveError = "Name can not be empty";
		      	}      
		      	else if(!(/^[0-9]+$/.test($scope.addNewContent.mobile))){
		      		$scope.newContentSaveError = "Invalid mobile number";
		      	}
		      	else{
		      		//Add to server
		      		$scope.newContentSaveError = "";
		      		
		      		$('#loading').show(); $("body").css("cursor", "progress");
		      				      		
		      		var data = {};
		        	data.token = $cookies.get("zaitoonAdmin");
		        	data.name = $scope.addNewContent.name;
		        	data.mobile = $scope.addNewContent.mobile;
		        	data.date = $scope.addNewContent.date;   
		        	date.list = $scope.referencesHoldList;
   
			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/newmarketingcontent.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              $('#loading').hide(); $("body").css("cursor", "default");
			              if(response.data.status){
			              	$scope.resetNewContent();
			              	$scope.fetchFigures();
			              
			              }
			              else{
			              	$scope.newContentSaveError = response.data.error;
			              }
			         });
		      	}	
	}
	
	$scope.resetNewContent = function(){
		$scope.referencesHoldList = [];

		$scope.addNewContent = {};
		$scope.addNewContent.mobile = "";
		$scope.addNewContent.name = "";

		  var today = new Date();

          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();

          if(dd<10) {
              dd = '0'+dd;
          } 

          if(mm<10) {
              mm = '0'+mm;
          } 

          today = dd + '-' + mm + '-' + yyyy;


		$scope.addNewContent.date = today;
		document.getElementById("new_referal_date").value = today;

		$scope.newContentSaveError = '';
	}

	$scope.resetNewContent();


	$scope.referencesHoldList = [];

	$scope.addNewReference = function(){
		var name = document.getElementById("new_reference_name").value;
		var mobile = document.getElementById("new_reference_mobile").value;

		if(!name || name == '' || !mobile || mobile == ''){
			return '';
		}
		else if(mobile.length != 10){
			return '';
		}


		if($scope.referencesHoldList.length > 0){
			var n = 0;
			while($scope.referencesHoldList[n]){
				if($scope.referencesHoldList[n].mobile == mobile){
					//Error
					return '';
				}
				n++;
			}

			$scope.referencesHoldList.push({"name": name, "mobile": mobile});
			document.getElementById("new_reference_name").value = '';
			document.getElementById("new_reference_mobile").value = '';
		}
		else{
			$scope.referencesHoldList.push({"name": name, "mobile": mobile});
			document.getElementById("new_reference_name").value = '';
			document.getElementById("new_reference_mobile").value = '';
		}

		console.log($scope.referencesHoldList)
	}

	$scope.removeNewReference = function(mobile){
		
		if($scope.referencesHoldList.length > 0){
			var n = 0;
			while($scope.referencesHoldList[n]){
				if($scope.referencesHoldList[n].mobile == mobile){
					$scope.referencesHoldList.splice(n,1);
					break;
				}
				n++;
			}

		}
		else{
			return '';
		}
	}



      //Seater Area
	
		$scope.seatPlan = "";
		$scope.freeingAllList = "";
		$scope.seatPlanError = "";
		$scope.fetchTime = 'now';

		$scope.dateFancy = '12th April';

		$scope.initAllStaff = function(){
		
			  $scope.seatPlanError = "";
		
		      var data = {};
		      data.token = data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOjC9w6ykxnp+crPz2zpkBrCaYzxn6BghxEkgugp1PxORCHlxMhUWzWUCZEwcXmLXYQ='; //$cookies.get("dashManager");
		      data.date = '20180412';

		      $http({
		        method  : 'POST',
		        url     : 'https://zaitoon.online/services/erpfetchpeoplewithattendance.php',
		        data    : data,
		        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		       })
		       .then(function(response) {
		         if(response.data.status){
		         	$scope.seatPlanError = '';

					$scope.attendanceData = response.data.response;
		         }
		         else{
		           	$scope.seatPlanError = response.data.error;
		         }
		        });
		}
	




      	$scope.holdList = []; //hold staff

		$scope.showEmployeeSelector = function(){
			$scope.holdList = [];
			$scope.initAllStaff();      	
			$('#attendancePlanModal').modal('show');
		}

      $scope.getMyClass = function(person){
      	if(person.attendance == 0){
      		return "btn-default";
      	}
      	else if(person.attendance == 1){
      		return "btn-success";
      	}
      	else if(person.attendance == 5){
      		return "btn-danger";
      	}
      }
      
      
      $scope.staffOptions = function(person){

      		//Invert Attendance code
      		if(person.attendance == 0){
      			person.attendance = 1;
      		}
      		else if(person.attendance == 1){
      			person.attendance = 5;
      		}
      		else if(person.attendance == 5){
      			person.attendance = 0;
      		}	
      }
      

      $scope.confirmAttendance = function(fullData){
      	console.log(fullData)
      }






	

         //Refresh Badge Counts
        var admin_data = {};
        admin_data.token = $cookies.get("zaitoonAdmin");
        $http({
          method  : 'POST',
          url     : 'https://zaitoon.online/services/fetchbadgecounts.php',
          data    : admin_data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         	if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
         });

        $scope.Timer = $interval(function () {
          $http({
            method  : 'POST',
            url     : 'https://zaitoon.online/services/fetchbadgecounts.php',
            data    : admin_data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
                if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
           });
        }, 20000);
  })
  ;
