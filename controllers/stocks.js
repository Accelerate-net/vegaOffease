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
      $scope.filterTitle = 'Inventory Stocks List';

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
      data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOhJxfKghGchZ5AsN8IjcE2stC7q98wzcQdKf5pr0jnYyEo9KLFkWlsXE5iCUCsj2Nk=';//$cookies.get("zaitoonAdmin");
      
      $('#vegaPanelBodyLoader').show(); $("body").css("cursor", "progress");
      $http({
        method  : 'POST',
        url     : 'https://zaitoon.online/services/erpfetchinventorylist.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
       $('#vegaPanelBodyLoader').hide(); $("body").css("cursor", "default");
         if(response.data.status){

           $scope.isReservationsFound = true;
           $scope.stockList = response.data.response;
           
                 if($scope.stockList.length%10 == 0){
                    $scope.isMoreLeft = true;
               }else{
                    $scope.isMoreLeft = false;
               }
               
         }
         else{
           $scope.isReservationsFound = false;
           $scope.resultMessage = "There are no Inventory added yet.";
         }
        });
}
$scope.initStocks();



         
         $scope.showCancel = function(stock){
         
          $scope.cancelItemCode = stock.id;
          $scope.cancelShowName = stock.name;
        
          $('#cancelModal').modal('show');
         
         }
         
         $scope.confirmCancel = function(code){
              var data = {};
              data.id = code;
              data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOhJxfKghGchZ5AsN8IjcE2stC7q98wzcQdKf5pr0jnYyEo9KLFkWlsXE5iCUCsj2Nk=';//$cookies.get("zaitoonAdmin");
      
              $http({
                method  : 'POST',
                url     : 'https://zaitoon.online/services/erpdeleteinventorylist.php',
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
     $scope.nullNewInventory = function(){
      $scope.newStock = {};
      $scope.newStock.name = "";
      $scope.newStock.category = "";
      $scope.newStock.minStockUnit = "";
      $scope.newStock.currentStock = "";
      $scope.newStock.unit = "";
      $scope.newStock.vendorList = '';
     }
     $scope.nullNewInventory();
     
     $scope.metaVendorsList = [];
     $scope.metaCategoryList = [];

     
     $scope.openNewInventory = function(){
      $scope.nullNewInventory();

            var data = {}; 
            data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOhJxfKghGchZ5AsN8IjcE2stC7q98wzcQdKf5pr0jnYyEo9KLFkWlsXE5iCUCsj2Nk=';//$cookies.get("zaitoonAdmin");
      
            //fetch categories list, vendors list etc.
            $http({
              method  : 'POST',
              url     : 'https://zaitoon.online/services/erpnewinventorymetadata.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                    if(response.data.status){
                      $scope.metaVendorsList = response.data.vendors;
                      $scope.metaCategoryList = response.data.categories;

                      var n = 0;
                      var listing = '';
                      while($scope.metaVendorsList[n]){
                        listing = listing + '<option value="'+$scope.metaVendorsList[n].code+'">'+$scope.metaVendorsList[n].name+'</option>';
                        

                        if(n == $scope.metaVendorsList.length - 1){
                          document.getElementById("dropProvidingVendors").innerHTML = ' <option value="" disabled=""> Select an option </option> '+ listing;
                          $('#newInventoryModal').modal('show');
                        }

                        n++;
                      }

                    }
             });  


      
     }




     
     $scope.showEdit = function(obj){
      $scope.editStock = obj;
      $scope.editDisplayName = $scope.editStock.name;

      var tempVendorsList = [];

      if(($scope.editStock.vendorsList).length > 0){
        var j = 0;
        while($scope.editStock.vendorsList[j]){
          tempVendorsList.push($scope.editStock.vendorsList[j].id)
          j++;
        }  
      }
      
            var data = {}; 
            data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOhJxfKghGchZ5AsN8IjcE2stC7q98wzcQdKf5pr0jnYyEo9KLFkWlsXE5iCUCsj2Nk=';//$cookies.get("zaitoonAdmin");
      
            //fetch categories list, vendors list etc.
            $http({
              method  : 'POST',
              url     : 'https://zaitoon.online/services/erpnewinventorymetadata.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                    if(response.data.status){
                      $scope.metaVendorsList = response.data.vendors;
                      $scope.metaCategoryList = response.data.categories;

                      var n = 0;
                      var listing = '';
                      while($scope.metaVendorsList[n]){
                        listing = listing + '<option value="'+$scope.metaVendorsList[n].code+'">'+$scope.metaVendorsList[n].name+'</option>';
                        

                        if(n == $scope.metaVendorsList.length - 1){
                          document.getElementById("dropProvidingVendorsEdit").innerHTML = ' <option value="" disabled=""> Select an option </option> '+ listing;
                          $('#stockEditModal').modal('show');

                          //Prefill vendors list
                          $('#dropProvidingVendorsEdit').select2({}).select2('val', tempVendorsList);

                        }

                        n++;
                      }

                    }
             });  

     }


     
  $scope.saveNewInventory = function(){

    var tempVendors = $("#dropProvidingVendors").val();
    
    $scope.newStockError = "";
    
    if($scope.newStock.name == "" || !(/^[a-zA-Z ]+$/.test($scope.newStock.name))){
      $scope.newStockError = "Invalid Name";
    }
    else if($scope.newStock.category == ""){
      $scope.newStockError = "Select the Category";
    }
    else if($scope.newStock.unit == ""){
      $scope.newStockError = "Invalid Unit";
    }
    else if($scope.newStock.minStockUnit == ""){
      $scope.newStockError = "Invalid Minimum Stock";
    }
    else if($scope.newStock.currentStock == ""){
      $scope.newStockError = "Invalid Current Stock";
    }    
    else{
      $scope.newStockError = "";
      
      var data = {};
            data.details = $scope.newStock;

            if(tempVendors && tempVendors.length > 0){
              data.vendorsList = tempVendors;
            }

            data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOhJxfKghGchZ5AsN8IjcE2stC7q98wzcQdKf5pr0jnYyEo9KLFkWlsXE5iCUCsj2Nk=';//$cookies.get("zaitoonAdmin");
      
            $http({
              method  : 'POST',
              url     : 'https://zaitoon.online/services/erpaddinventorylist.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                    $('#newInventoryModal').modal('hide');
                    if(response.data.status){    
                      $scope.initStocks();
                    }
                    else{
                      console.log(response.data.error);
                    }
             });  
    }
  
  }
  
 
  
  $scope.saveEditInventory = function(){

    var tempVendors = $("#dropProvidingVendorsEdit").val();
    
    $scope.editStockError = "";
    
    if($scope.editStock.name == "" || !(/^[a-zA-Z ]+$/.test($scope.editStock.name))){
      $scope.editStockError = "Invalid Name";
    }
    else if($scope.editStock.category == ""){
      $scope.editStockError = "Select the Category";
    }
    else if($scope.editStock.unit == ""){
      $scope.editStockError = "Invalid Unit";
    }
    else if($scope.editStock.minStockUnit == ""){
      $scope.editStockError = "Invalid Minimum Stock";
    }
    else if($scope.editStock.currentStock == ""){
      $scope.editStockError = "Invalid Current Stock";
    }   
    else{
      $scope.editStockError = "";
      
            var data = {};
            data.details = $scope.editStock;
            data.id = $scope.editStock.id;
            data.vendorsList = tempVendors;

            data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOhJxfKghGchZ5AsN8IjcE2stC7q98wzcQdKf5pr0jnYyEo9KLFkWlsXE5iCUCsj2Nk=';//$cookies.get("zaitoonAdmin");

            $http({
              method  : 'POST',
              url     : 'https://zaitoon.online/services/erpeditinventorylist.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
                    $('#stockEditModal').modal('hide');
                    if(response.data.status){    
                      $scope.initStocks();
                    }
                    else{
                      console.log(response.data.error);
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
