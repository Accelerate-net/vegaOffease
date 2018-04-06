angular.module('vendorsApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('vendorsController', function($scope, $http, $interval, $cookies) {

    // //Check if logged in
    // if($cookies.get("zaitoonAdmin")){
    //   $scope.isLoggedIn = true;
    // }
    // else{
    //   $scope.isLoggedIn = false;
    //   window.location = "adminlogin.html";
    // }

    // //Logout function
    // $scope.logoutNow = function(){
    //   if($cookies.get("zaitoonAdmin")){
    //     $cookies.remove("zaitoonAdmin");
    //     window.location = "adminlogin.html";
    //   }
    // }

    $('.js-example-basic-single').select2();

    $scope.outletCode = localStorage.getItem("branch");



      //Search Key
      $scope.isSearched = false;
      $scope.searchID = '';
      $scope.isReservationsFound = false;
      $scope.resultMessage = '';
      $scope.filterTitle = 'Vendors List';

      //Default Results : Reservations of the Week
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      if(dd<10){ dd='0'+dd;}
      if(mm<10){ mm='0'+mm;}
      var today = dd+'-'+mm+'-'+yyyy;
      
      $scope.todayDate = today;


$scope.initVendors = function(){

      var data = {};
      data.token = $cookies.get("zaitoonAdmin");
      data.id = 0;
      data.key = today;
      $('#vegaPanelBodyLoader').show(); $("body").css("cursor", "progress");
      $http({
        method  : 'POST',
        url     : 'https://kopperkadai.online/services/fetchreservationsadmin.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
       $('#vegaPanelBodyLoader').hide(); $("body").css("cursor", "default");
         if(response.data.status){

           $scope.isReservationsFound = true;
           $scope.reservationsList = response.data.response;
           
           	     if($scope.reservationsList.length%10 == 0){
	                  $scope.isMoreLeft = true;
	             }else{
	                  $scope.isMoreLeft = false;
	             }
	             
         }
         else{
           $scope.isReservationsFound = false;
           $scope.resultMessage = "There are no vendors added!";
         }
        });
}
$scope.initVendors();

         
         $scope.showCancel = function(vendor){
         
       		$scope.cancelItemCode = vendorid;
       		$scope.cancelShowName = vendor.name;
       	
       		$('#cancelModal').modal('show');
         
         }
         
         $scope.confirmCancel = function(code){
	    	var data = {};
	    	data.id = code;
	        data.token = $cookies.get("zaitoonAdmin");
	        $http({
	          method  : 'POST',
	          url     : 'https://kopperkadai.online/services/cancelreservationsadmin.php',
	          data    : data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
	         	$('#cancelModal').modal('hide');
	         	if(response.data.status){	   
	         		$scope.initVendors();
	              	}
	              	else{
		              	alert(response.data.error);
	              	}
	         });         
         }
         
         
         
     //Add new reservation
     $scope.nullNewReservation = function(){
     	$scope.newVendor = {};
     	$scope.newVendor.mobile = "";
     	$scope.newVendor.email = "";
     	$scope.newVendor.name = "";
     	$scope.newVendor.count = 2;
     	$scope.newVendor.mode = "";
     	$scope.newVendor.date = "";
     	$scope.newVendor.time = "";
     	$scope.newVendor.comments = "";     
     }
     $scope.nullNewReservation();
     
     
     $scope.openNewReservation = function(){
     	$scope.nullNewReservation();
     	$('#reservationModal').modal('show');
     }
     
     $scope.showEdit = function(obj){
     	$scope.editVendor = obj;
     	$('#vendorEditModal').modal('show');
     }
     
	$scope.saveNewReservation = function(){

		console.log($scope.newVendor);
		
		$scope.newVendorError = "";
		
		if($scope.newVendor.name == "" || !(/^[a-zA-Z ]+$/.test($scope.newVendor.name))){
			$scope.newVendorError = "Invalid Name";
		}
		else if($scope.newVendor.mobile == "" || !(/^[789]\d{9}$/.test($scope.newVendor.mobile))){
			$scope.newVendorError = "Invalid Mobile Number";
		}
		else if($scope.newVendor.address == ""){
			$scope.newVendorError = "Invalid Address";
		}
		else if($scope.newVendor.modeOfPayment == ""){
			$scope.newVendorError = "Invalid Mode of Payment";
		}
		else if($scope.newVendor.providingBranches == ""){
			$scope.newVendorError = "Select the branches the vendor will be providing";
		}
		else if($scope.newVendor.inventoriesProvided == ""){
			$scope.newVendorError = "Select the stock items the vendor will be providing";
		}
		else{
			$scope.newVendorError = "";
			
			var data = {};
		    	data.details = $scope.newVendor;
		        data.token = $cookies.get("zaitoonAdmin");
		        $http({
		          method  : 'POST',
		          url     : 'https://kopperkadai.online/services/newreservationsadmin.php',
		          data    : data,
		          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		         })
		         .then(function(response) {
		         	$('#reservationModal').modal('hide');
		         	if(response.data.status){	   
		         		$scope.initVendors();
		              	}
		              	else{
			              	alert(response.data.error);
		              	}
		         });  
		}
	
	}
	
	
	
	$scope.saveEditReservation = function(){

		console.log($scope.editVendor);
		
		$scope.editReservationError = "";
		
		
		if($scope.editVendor.name == "" || !(/^[a-zA-Z ]+$/.test($scope.editVendor.name))){
			$scope.editVendorError = "Invalid Name";
		}
		else if($scope.editVendor.mobile == "" || !(/^[789]\d{9}$/.test($scope.editVendor.mobile))){
			$scope.editVendorError = "Invalid Mobile Number";
		}
		else if($scope.editVendor.address == ""){
			$scope.editVendorError = "Invalid Address";
		}
		else if($scope.editVendor.modeOfPayment == ""){
			$scope.editVendorError = "Invalid Mode of Payment";
		}
		else if($scope.editVendor.providingBranches == ""){
			$scope.editVendorError = "Select the branches the vendor will be providing";
		}
		else if($scope.editVendor.inventoriesProvided == ""){
			$scope.editVendorError = "Select the stock items the vendor will be providing";
		}
		else{
			$scope.editReservationError = "";
			
			var data = {};
		    	data.details = $scope.editVendor;
		        data.token = $cookies.get("zaitoonAdmin");
		        $http({
		          method  : 'POST',
		          url     : 'https://kopperkadai.online/services/editreservationsadmin.php',
		          data    : data,
		          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
		         })
		         .then(function(response) {
		         	$('#reservationEditModal').modal('hide');
		         	if(response.data.status){	   
		         		$scope.initVendors();
		              	}
		              	else{
			              	alert(response.data.error);
		              	}
		         });  
		}
	
	}
	

         

     //Refresh Badge Counts
        var admin_data = {};
        admin_data.token = $cookies.get("zaitoonAdmin");
        $http({
          method  : 'POST',
          url     : 'https://kopperkadai.online/services/fetchbadgecounts.php',
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
            url     : 'https://kopperkadai.online/services/fetchbadgecounts.php',
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
