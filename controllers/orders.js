angular.module('stocksApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('stocksController', function($scope, $http, $interval, $cookies) {

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
      $scope.filterTitle = 'Stocks List';

      //Default Results : Reservations of the Week
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      if(dd<10){ dd='0'+dd;}
      if(mm<10){ mm='0'+mm;}
      var today = dd+'-'+mm+'-'+yyyy;
      
      $scope.todayDate = today;


$scope.initStocks = function(){

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
           $scope.resultMessage = "There are no stocks added!";
         }
        });
}
$scope.initStocks();

         
         $scope.showCancel = function(stock){
         
          $scope.cancelItemCode = stockid;
          $scope.cancelShowName = stock.name;
        
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
              $scope.initStocks();
                  }
                  else{
                    alert(response.data.error);
                  }
           });         
         }
         
         
         
     //Add new reservation
     $scope.nullNewReservation = function(){
      $scope.newStock = {};
      $scope.newStock.mobile = "";
      $scope.newStock.email = "";
      $scope.newStock.name = "";
      $scope.newStock.count = 2;
      $scope.newStock.mode = "";
      $scope.newStock.date = "";
      $scope.newStock.time = "";
      $scope.newStock.comments = "";     
     }
     $scope.nullNewReservation();
     
     
     $scope.openNewReservation = function(){
      $scope.nullNewReservation();
      $('#reservationModal').modal('show');
     }
     
     $scope.showEdit = function(obj){
      $scope.editStock = obj;
      $('#stockEditModal').modal('show');
     }
     
  $scope.saveNewReservation = function(){

    console.log($scope.newStock);
    
    $scope.newStockError = "";
    
    if($scope.newStock.name == "" || !(/^[a-zA-Z ]+$/.test($scope.newStock.name))){
      $scope.newStockError = "Invalid Name";
    }
    else if($scope.newStock.mobile == "" || !(/^[789]\d{9}$/.test($scope.newStock.mobile))){
      $scope.newStockError = "Invalid Mobile Number";
    }
    else if($scope.newStock.address == ""){
      $scope.newStockError = "Invalid Address";
    }
    else if($scope.newStock.modeOfPayment == ""){
      $scope.newStockError = "Invalid Mode of Payment";
    }
    else if($scope.newStock.providingBranches == ""){
      $scope.newStockError = "Select the branches the stock will be providing";
    }
    else if($scope.newStock.inventoriesProvided == ""){
      $scope.newStockError = "Select the stock items the stock will be providing";
    }
    else{
      $scope.newStockError = "";
      
      var data = {};
          data.details = $scope.newStock;
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
                $scope.initStocks();
                    }
                    else{
                      alert(response.data.error);
                    }
             });  
    }
  
  }
  
  
  
  $scope.saveEditReservation = function(){

    console.log($scope.editStock);
    
    $scope.editReservationError = "";
    
    
    if($scope.editStock.name == "" || !(/^[a-zA-Z ]+$/.test($scope.editStock.name))){
      $scope.editStockError = "Invalid Name";
    }
    else if($scope.editStock.mobile == "" || !(/^[789]\d{9}$/.test($scope.editStock.mobile))){
      $scope.editStockError = "Invalid Mobile Number";
    }
    else if($scope.editStock.address == ""){
      $scope.editStockError = "Invalid Address";
    }
    else if($scope.editStock.modeOfPayment == ""){
      $scope.editStockError = "Invalid Mode of Payment";
    }
    else if($scope.editStock.providingBranches == ""){
      $scope.editStockError = "Select the branches the stock will be providing";
    }
    else if($scope.editStock.inventoriesProvided == ""){
      $scope.editStockError = "Select the stock items the stock will be providing";
    }
    else{
      $scope.editReservationError = "";
      
      var data = {};
          data.details = $scope.editStock;
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
                $scope.initStocks();
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
