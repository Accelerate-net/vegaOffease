angular.module('inventoryApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])



  .controller('inventoryController', function($scope, $http, $interval, $cookies) {
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
		$scope.paymentCat = 0;

		$('.js-example-basic-single').select2();

		$scope.fetchInventoryList = function(){
			var co_data = {};
	        co_data.token = $cookies.get("zaitoonAdmin");
	        $http({
	          method  : 'POST',
	          url     : 'https://zaitoon.online/services/erpFetchInventoryList.php',
	          data    : co_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(response.data.status){   
			      $scope.inventoryList = response.data.response;
			      console.log($scope.inventoryList);		    			       
			}
			else{	
				$scope.isContentFound = false;		
				$scope.newContentSet();	
				$scope.inventoryList = {};
			}
	         });	
		}
		$scope.fetchInventoryList();

		$scope.fetchVendorsList = function(){
			var co_data = {};
	        co_data.token = $cookies.get("zaitoonAdmin");
	        $http({
	          method  : 'POST',
	          url     : 'https://zaitoon.online/services/erpFetchVendors.php',
	          data    : co_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(response.data.status){   
			      $scope.vendorsList = response.data.response;
			      console.log($scope.vendorsList);		    			       
			}
			else{	
				$scope.isContentFound = false;		
				$scope.newContentSet();	
				$scope.vendorsList = {};
			}
	         });	
		}
		$scope.fetchVendorsList();

        $('#new_stockout_date').datetimepicker({  // Date
		    format: "dd-mm-yyyy",
		    weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 1
	    });




    //Logout function
    $scope.logoutNow = function(){
      if($cookies.get("zaitoonAdmin")){
        $cookies.remove("zaitoonAdmin");
        window.location = "adminlogin.html";
      }
    }

      $scope.outletCode = localStorage.getItem("branch");
      
      $scope.marketingType = 'out';
      $scope.figure_active_out = 0;
      $scope.figure_active_purchases = 0;
      $scope.figure_active_payments = 0;   
      
      $scope.deleteError = "";
      
      //Default Flags
      $scope.defaultFlagSet = function(){
	      $scope.newComboWindowFlag = false;
	      $scope.newPromoWindowFlag = false;
	      $scope.newCouponWindowFlag = false;

		  $scope.editComboWindowFlag = false;
	      $scope.editPromoWindowFlag = false;
	      $scope.editCouponWindowFlag = false;	

	      $scope.isPhotoAttached = false;
      }      
      $scope.defaultFlagSet();
      
      
      //Display Function
      $scope.currentDisplayPage = 1;
      $scope.totalDisplayPages = 1;
      $scope.isContentFound = false;
      
      $scope.initializeContent = function(type, req_pageid, option){
      		var pageid = req_pageid;
      		$scope.defaultFlagSet();	
      		
      		//Update Current page
       	  	$scope.currentDisplayPage = pageid;
       	  	
       	  	//Special Corner Cases (Adding New Page (10 entries to 11) and Deleting a Page (11 entries to 10))
		if(option != '') //Check if its a corner case
		{
			var current_entries = 0;
			switch(type){
			      	case 'purchases':{
			      		current_entries = $scope.figure_active_purchases;
			      		break;
			      	}
			      	case 'out':{
			      		current_entries = $scope.figure_active_out;
			      		break;
			      	}
			      	case 'payments':{
			      		current_entries = $scope.figure_active_payments;
			      		break;
			      	}
			} 	
			
			if(option == 'delete'){
				if((current_entries-1)%10 == 0){
					if($scope.currentDisplayPage == $scope.totalDisplayPages){ //I am on the last page
						$scope.currentDisplayPage--;
						pageid--;
					}					
				}
			}
			else if(option == 'save'){
				if((current_entries+1)%10 == 1){
					if($scope.currentDisplayPage == $scope.totalDisplayPages && $scope.currentDisplayPage != 1){ //I am on the last page
						$scope.currentDisplayPage++;
						pageid++;	
					}	
								
				}			
			}
		}	 
       	  
		//Fetch Active Content
	      	var co_data = {};
	      	co_data.type = type;
	      	co_data.page = pageid - 1;
	        co_data.token = $cookies.get("zaitoonAdmin");
	        $http({
	          method  : 'POST',
	          url     : 'https://zaitoon.online/services/fetchmarketingcontent.php',
	          data    : co_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(response.data.status){
			
			      $scope.isContentFound = true;
			      
			      $scope.active_content = response.data.response;
				
			      $scope.figure_active_out = response.data.totalOut;
			      $scope.figure_active_purchases = response.data.totalPurchases;
			      $scope.figure_active_payments = response.data.totalPayments;
			      
			      //Update Total Pages
			      switch(type){
			      	case 'purchases':{
			      		$scope.totalDisplayPages = Math.ceil($scope.figure_active_purchases/10);
			      		if($scope.figure_active_purchases == 0){$scope.isContentFound = false;}
			      		break;
			      	}
			      	case 'out':{
			      		$scope.totalDisplayPages = Math.ceil($scope.figure_active_out/10);
			      		if($scope.figure_active_out == 0){$scope.isContentFound = false;}
			      		break;
			      	}
			      	case 'payments':{
			      		$scope.totalDisplayPages = Math.ceil($scope.figure_active_payments/10);
			      		if($scope.figure_active_payments == 0){$scope.isContentFound = false;}
			      		break;
			      	}
			      }				            			       
			}
			else{	
				$scope.isContentFound = false;		
				$scope.newContentSet();	
				$scope.active_content = {};
			}
	    });	
	}
	
	$scope.initializeContent($scope.marketingType, 1);
	
      
      	    //Default Styling
        document.getElementById("combosTitle").style.color = "#FFF";
	    document.getElementById("combosIcon").style.color = "#FFF";
	    document.getElementById("combosTag").style.color = "#FFF";
	    document.getElementById("combosCount").style.color = "#FFF";
	    document.getElementById("combosTabButton").style.background="#2980b9";
	
	    document.getElementById("promotionsTitle").style.color = "#ABB2B9";
	    document.getElementById("promotionsIcon").style.color = "#ABB2B9";
	    document.getElementById("promotionsTag").style.color = "#ABB2B9";
	    document.getElementById("promotionsCount").style.color = "#ABB2B9";
	    document.getElementById("promotionsTabButton").style.background="#F1F1F1";
	    
	    document.getElementById("couponsTitle").style.color = "#ABB2B9";
	    document.getElementById("couponsIcon").style.color = "#ABB2B9";
	    document.getElementById("couponsTag").style.color = "#ABB2B9";
	    document.getElementById("couponsCount").style.color = "#ABB2B9";
	    document.getElementById("couponsTabButton").style.background="#F1F1F1";
	    
	$scope.openType = function (type){
		$scope.marketingType = type;
		$scope.initializeContent(type, 1);
		//Styling
		switch(type) {
		    case 'out':
		    {		    	
		            document.getElementById("combosTitle").style.color = "#FFF";
			    document.getElementById("combosIcon").style.color = "#FFF";
			    document.getElementById("combosTag").style.color = "#FFF";
			    document.getElementById("combosCount").style.color = "#FFF";
			    document.getElementById("combosTabButton").style.background="#2980b9";
			
			    document.getElementById("promotionsTitle").style.color = "#ABB2B9";
			    document.getElementById("promotionsIcon").style.color = "#ABB2B9";
			    document.getElementById("promotionsTag").style.color = "#ABB2B9";
			    document.getElementById("promotionsCount").style.color = "#ABB2B9";
			    document.getElementById("promotionsTabButton").style.background="#F1F1F1";
			    
			    document.getElementById("couponsTitle").style.color = "#ABB2B9";
			    document.getElementById("couponsIcon").style.color = "#ABB2B9";
			    document.getElementById("couponsTag").style.color = "#ABB2B9";
			    document.getElementById("couponsCount").style.color = "#ABB2B9";
			    document.getElementById("couponsTabButton").style.background="#F1F1F1";
		        
		            break;
		    }
		    case 'purchases':
		    {
		            document.getElementById("promotionsTitle").style.color = "#FFF";
			    document.getElementById("promotionsIcon").style.color = "#FFF";
			    document.getElementById("promotionsTag").style.color = "#FFF";
			    document.getElementById("promotionsCount").style.color = "#FFF";
			    document.getElementById("promotionsTabButton").style.background="#2980b9";
			
			    document.getElementById("combosTitle").style.color = "#ABB2B9";
			    document.getElementById("combosIcon").style.color = "#ABB2B9";
			    document.getElementById("combosTag").style.color = "#ABB2B9";
			    document.getElementById("combosCount").style.color = "#ABB2B9";
			    document.getElementById("combosTabButton").style.background="#F1F1F1";
			    
			    document.getElementById("couponsTitle").style.color = "#ABB2B9";
			    document.getElementById("couponsIcon").style.color = "#ABB2B9";
			    document.getElementById("couponsTag").style.color = "#ABB2B9";
			    document.getElementById("couponsCount").style.color = "#ABB2B9";
			    document.getElementById("couponsTabButton").style.background="#F1F1F1";
		        
		            break;
		    }
		    case 'payments':
		    {
		            document.getElementById("couponsTitle").style.color = "#FFF";
			    document.getElementById("couponsIcon").style.color = "#FFF";
			    document.getElementById("couponsTag").style.color = "#FFF";
			    document.getElementById("couponsCount").style.color = "#FFF";
			    document.getElementById("couponsTabButton").style.background="#2980b9";
			
			    document.getElementById("promotionsTitle").style.color = "#ABB2B9";
			    document.getElementById("promotionsIcon").style.color = "#ABB2B9";
			    document.getElementById("promotionsTag").style.color = "#ABB2B9";
			    document.getElementById("promotionsCount").style.color = "#ABB2B9";
			    document.getElementById("promotionsTabButton").style.background="#F1F1F1";
			    
			    document.getElementById("combosTitle").style.color = "#ABB2B9";
			    document.getElementById("combosIcon").style.color = "#ABB2B9";
			    document.getElementById("combosTag").style.color = "#ABB2B9";
			    document.getElementById("combosCount").style.color = "#ABB2B9";
			    document.getElementById("combosTabButton").style.background="#F1F1F1";
		        
		            break;
		    }
		} 
	}
	
	
	//New Creations
	$scope.showNewContentWindow = function(){
		switch($scope.marketingType){
			case 'out':{
				$scope.newComboWindowFlag  = true;
				$scope.newPromoWindowFlag  = false;
				$scope.newCouponWindowFlag  = false;
				$scope.editComboWindowFlag = false;
			    $scope.editPromoWindowFlag = false;
			    $scope.editCouponWindowFlag = false;

                       		
                       		break;
			}
			case 'purchases':{
				$scope.newComboWindowFlag  = false;
				$scope.newPromoWindowFlag  = true;
				$scope.newCouponWindowFlag  = false;
				$scope.editComboWindowFlag = false;
			    $scope.editPromoWindowFlag = false;
			      $scope.editCouponWindowFlag = false;
                       		
                       		break;			
			}
			case 'payments':{
				$scope.newComboWindowFlag  = false;
				$scope.newPromoWindowFlag  = false;
				$scope.newCouponWindowFlag  = true;
				$scope.editComboWindowFlag = false;
			    $scope.editPromoWindowFlag = false;
			    $scope.editCouponWindowFlag = false;
                       		
                       		break;			
			}
		
		}
	}

	$scope.editContentSaveError = "";

	$scope.showEditContentWindow = function(content){

		$scope.editContentSaveError = "";    
	    $scope.myEditContent = content;
	    console.log($scope.myEditContent);

		switch($scope.marketingType){
			case 'out':{
				$scope.newComboWindowFlag  = false;
				$scope.newPromoWindowFlag  = false;
				$scope.newCouponWindowFlag  = false;
				$scope.editComboWindowFlag = true;
			    $scope.editPromoWindowFlag = false;
			    $scope.editCouponWindowFlag = false;

                       		
                       		break;
			}
			case 'purchases':{
				$scope.newComboWindowFlag  = false;
				$scope.newPromoWindowFlag  = false;
				$scope.newCouponWindowFlag  = false;
				$scope.editComboWindowFlag = false;
			    $scope.editPromoWindowFlag = true;
			    $scope.editCouponWindowFlag = false;
                       		
                       		break;			
			}
			case 'payments':{
				$scope.newComboWindowFlag  = false;
				$scope.newPromoWindowFlag  = false;
				$scope.newCouponWindowFlag  = false;
				$scope.editComboWindowFlag = false;
			    $scope.editPromoWindowFlag = false;
			    $scope.editCouponWindowFlag = true;
                       		
                       		break;			
			}
		
		}
	}

	$scope.saveEditChanges = function(){

		if($scope.marketingType == 'out'){
			if($scope.myEditContent.id == ""){
				$scope.editContentSaveError = "Choose an inventory item";
			}
			else if($scope.myEditContent.quantity == ""){
				$scope.editContentSaveError = "Enter the quantity of the item";
			}
			else{
				//Add to server
		      		$scope.editContentSaveError = "";
		      		
		      		$('#loading').show(); $("body").css("cursor", "progress");		      		
		      		var data = {};
		        	data.token = $cookies.get("zaitoonAdmin");
		        	data.id = $scope.myEditContent.id;
		        	data.quantity = $scope.myEditContent.quantity;
		        	data.remarks = $scope.myEditContent.remarks;
		        	data.date = $scope.myEditContent.date;
   
			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/erpStockOutEntry.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              $('#loading').hide(); $("body").css("cursor", "default");
			              if(response.data.status){
			              	$scope.newContentSet();
			              	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage);
			              }
			              else{
			              	$scope.editContentSaveError = response.data.error;
			              }
			         });
			}
		}


		else if($scope.marketingType == 'purchases'){ 

			if($scope.myEditContent.vendorId == ""){
		      		$scope.editContentSaveError = "Choose a vendor";
		      	}      
		      	else if($scope.myEditContent.item == ""){
		      		$scope.editContentSaveError = "Choose an item";
		      	}
				else if($scope.myEditContent.units == ""){
		      		$scope.editContentSaveError = "Enter the units for the item";
		      	}
		      	else if($scope.myEditContent.paymentMode == ""){
		      		$scope.editContentSaveError = "Choose a payment Method";
		      	}
		      	else if($scope.myEditContent.totalAmount == ""){
		      		$scope.editContentSaveError = "Enter the amount on purchase";
		      	}
		      	else{
		      		//Add to server
		      		$scope.editContentSaveError = "";
		      		
		      		$('#loading').show(); $("body").css("cursor", "progress");
		      		
	
		      		var data = {};
		        	data.token = $cookies.get("zaitoonAdmin");
		        	data.vendorId = $scope.myEditContent.vendorId;
		        	data.item = $scope.myEditContent.item;
		        	data.units = $scope.myEditContent.units;
		        	data.paymentMode = $scope.myEditContent.paymentMode;
		        	data.remarks = $scope.myEditContent.remarks;   
   
			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/newmarketingcontent.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              $('#loading').hide(); $("body").css("cursor", "default");
			              if(response.data.status){
			              	$scope.newContentSet();
			              	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage);
			              }
			              else{
			              	$scope.editContentSaveError = response.data.error;
			              }
			         });
		      	}
		}		
		else if($scope.marketingType == 'payments'){ //2. Promos 

				if($scope.myEditContent.vendorId == "" && $scope.myEditContent.name == ""){
		      		$scope.editContentSaveError = "Choose a vendor/Enter the item Name";
		      	}
		      	else if($scope.myEditContent.totalAmount == ""){
		      		$scope.editContentSaveError = "Enter the payment amount";
		      	}
		      	else if($scope.myEditContent.paymentMode == ""){
		      		$scope.editContentSaveError = "Choose a payment mode";
		      	}
		      	else if($scope.myEditContent.paymentRef == ""){
		      		$scope.editContentSaveError = "Enter the payment reference";
		      	}
		      	else if($scope.myEditContent.paymentDate == ""){
		      		$scope.editContentSaveError = "Choose a payment date";
		      	}

		      	else{
		      		//Add to server
		      		$scope.editContentSaveError = "";
		      		
		      		$('#loading').show(); $("body").css("cursor", "progress");
	
		      		var data = {};
		        	data.token = $cookies.get("zaitoonAdmin");
		        	data.vendorId = $scope.myEditContent.vendorId;
		        	data.name = $scope.myEditContent.name;
		        	data.totalAmount = $scope.myEditContent.totalAmount;
		        	data.paymentMode = $scope.myEditContent.paymentMode;
		        	data.paymentRef = $scope.myEditContent.paymentRef;
		        	data.paymentDate = $scope.myEditContent.paymentDate;
		        	
		        	console.log(data)  	
			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/newmarketingcontent.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              $('#loading').hide(); $("body").css("cursor", "default");
			              if(response.data.status){
			              	$scope.newContentSet();
			              	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage);
			              }
			              else{
			              	$scope.editContentSaveError = response.data.error;
			              }
			         });
		      	}
		}

	}
	
	$scope.changeOfferType = function(){
		$scope.addNewContent.offer = !$scope.addNewContent.offer;
	}
	
	//Delete Confirmation
	$scope.confirmDeleteStockOut = function(content){
		$scope.deleteItemName = content.name;
		$scope.deleteItemQuantity = content.quantity;
		$scope.deleteItemDate = content.date;
		$scope.deleteItemId = content.id;
		$('#deleteStockOutModal').modal('show');
	}

	$scope.deleteStockOutContent = function(req_id){
		var co_data = {};
	      	co_data.id = req_id;
	        co_data.token = $cookies.get("zaitoonAdmin");

	        $http({
	          method  : 'POST',
	          url     : 'https://zaitoon.online/services/deletemarketingcontent.php',
	          data    : co_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(response.data.status){			      
			      	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage, 'delete'); 
			      	$('#deleteStockOutModal').modal('hide');
			}
			else{
				$scope.deleteError = response.data.error;
			}
	         });		         	         
	}

	$scope.confirmDeletePurchase = function(content){
		$scope.deleteItemId = content.id;
		$scope.deleteItemQuantity = content.quantity;
		$scope.deleteItemName = content.name;
		$scope.deleteItemVendor = content.vendorName;
		$scope.deleteItemDate = content.date;
		$('#deletePaymentModal').modal('show');
	}

	$scope.deletePurchaseContent = function(req_id){
		var co_data = {};
	      	co_data.id = req_id;
	        co_data.token = $cookies.get("zaitoonAdmin");

	        $http({
	          method  : 'POST',
	          url     : 'https://zaitoon.online/services/erpdeleteinventorypurchasehistory.php',
	          data    : co_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(response.data.status){			      
			      	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage, 'delete'); 
			      	$('#deletePaymentModal').modal('hide');
			}
			else{
				$scope.deleteError = response.data.error;
			}
	         });		         	         
	}

	$scope.confirmDeletePayment = function(content){
		$scope.deleteItemName = content.name;
		$scope.deleteItemAmount = content.amount;
		$scope.deleteItemVendor = content.vendorName;
		$scope.deleteItemDate = content.date;
		$scope.deleteItemId = content.id;
		$('#deletePurchaseModal').modal('show');
	}

	$scope.deletePaymentContent = function(req_id){
		var co_data = {};
	      	co_data.id = req_id;
	        co_data.token = $cookies.get("zaitoonAdmin");

	        $http({
	          method  : 'POST',
	          url     : 'https://zaitoon.online/services/erpdeleteinventorypaymenthistory.php',
	          data    : co_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(response.data.status){			      
			      	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage, 'delete'); 
			      	$('#deletePurchaseModal').modal('hide');
			}
			else{
				$scope.deleteError = response.data.error;
			}
	         });		         	         
	}

	//View Content
	$scope.viewMyContent = function(content){
		$scope.viewContent = content;
		$('#viewModal').modal('show');		
	}
	
	//New Content
	$scope.addNewContent = {};
	$scope.newContentSet = function(){
		$scope.addNewContent.id = "";
		$scope.addNewContent.branch = "";
		$scope.addNewContent.name = "";
		$scope.addNewContent.category = "";
		$scope.addNewContent.unit = "";
		$scope.addNewContent.minStockUnit = "";
		$scope.addNewContent.currentStock = "";

		$scope.addNewContent.unitsPurchased = "";
		$scope.addNewContent.vendorId = "";
		$scope.addNewContent.comments = "";
		$scope.addNewContent.paymentMode = "";
		$scope.addNewContent.totalAmount = "";
		
		$scope.isPhotoAttached = false;
		$scope.myPhotoURL = "";
		
		$scope.currentDisplayPage = 1;
	      	$scope.totalDisplayPages = 1;
	      	$scope.isContentFound = false;
	}
	$scope.newContentSet();

	 $scope.saveNewContent = function(type){
		if(type == 'out'){
			if($scope.addNewContent.id == ""){
				$scope.newContentSaveError = "Choose an inventory item";
			}
			else if($scope.addNewContent.quantity == ""){
				$scope.newContentSaveError = "Enter the quantity of the item";
			}
			else{
				//Add to server
		      		$scope.newContentSaveError = "";
		      		
		      		$('#loading').show(); $("body").css("cursor", "progress");		      		
		      		var data = {};
		        	data.token = $cookies.get("zaitoonAdmin");
		        	data.id = $scope.addNewContent.id;
		        	data.quantity = $scope.addNewContent.quantity;
		        	data.remarks = $scope.addNewContent.remarks;
		        	data.date = $scope.addNewContent.date;
   
			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/erpStockOutEntry.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              $('#loading').hide(); $("body").css("cursor", "default");
			              if(response.data.status){
			              	$scope.newContentSet();
			              	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage, 'save');
			              }
			              else{
			              	$scope.newContentSaveError = response.data.error;
			              }
			         });
			}
		}


		else if(type == 'purchases'){ 
			$scope.addNewContent.vendorId = '9043960876';
			$scope.addNewContent.item = 'Chicken';
			if($scope.addNewContent.vendorId == ""){
		      		$scope.newContentSaveError = "Choose a vendor";
		      	}      
		      	else if($scope.addNewContent.item == ""){
		      		$scope.newContentSaveError = "Choose an item";
		      	}
				else if($scope.addNewContent.units == ""){
		      		$scope.newContentSaveError = "Enter the units for the item";
		      	}
		      	else if($scope.addNewContent.paymentMode == ""){
		      		$scope.newContentSaveError = "Choose a payment Method";
		      	}
		      	else if($scope.addNewContent.totalAmount == ""){
		      		$scope.newContentSaveError = "Enter the amount on purchase";
		      	}
		      	else{
		      		//Add to server
		      		$scope.newContentSaveError = "";
		      		
		      		$('#loading').show(); $("body").css("cursor", "progress");
		      		
	
		      		var data = {};
		        	data.token = 'sHtArttc2ht+tMf9baAeQ9ukHnXtlsHfexmCWx5sJOgyQZMMeKUIflJfJvkCMRcAKqUwzMstLJzZceSsxZQrQg==';
		        	data.vendorId = $scope.addNewContent.vendorId;
		        	data.item = $scope.addNewContent.item;
		        	data.units = $scope.addNewContent.unitsPurchased;
		        	data.totalAmount = $scope.addNewContent.totalAmount;
		        	data.paymentMode = $scope.addNewContent.paymentMode;
		        	data.date = $scope.addNewContent.date;
		        	data.remarks = $scope.addNewContent.remarks;   
   					console.log(data)

			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/erpaddinventorypurchasehistory.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              $('#loading').hide(); $("body").css("cursor", "default");
			              if(response.data.status){
			              	$scope.newContentSet();
			              	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage, 'save');
			              }
			              else{
			              	$scope.newContentSaveError = response.data.error;
			              }
			         });
		      	}
		}		
		else if(type == 'payments'){ //2. Promos 

				if($scope.addNewContent.vendorId == "" && $scope.addNewContent.name == ""){
		      		$scope.newContentSaveError = "Choose a vendor/Enter the item Name";
		      	}
		      	else if($scope.addNewContent.totalAmount == ""){
		      		$scope.newContentSaveError = "Enter the payment amount";
		      	}
		      	else if($scope.addNewContent.paymentMode == ""){
		      		$scope.newContentSaveError = "Choose a payment mode";
		      	}
		      	else if($scope.addNewContent.paymentRef == ""){
		      		$scope.newContentSaveError = "Enter the payment reference";
		      	}
		      	else if($scope.addNewContent.paymentDate == ""){
		      		$scope.newContentSaveError = "Choose a payment date";
		      	}

		      	else{
		      		//Add to server
		      		$scope.newContentSaveError = "";
		      		
		      		$('#loading').show(); $("body").css("cursor", "progress");
	
		      		var data = {};
		        	data.token = $cookies.get("zaitoonAdmin");
		        	data.vendorId = $scope.addNewContent.vendorId;
		        	data.name = $scope.addNewContent.name;
		        	data.totalAmount = $scope.addNewContent.totalAmount;
		        	data.paymentMode = $scope.addNewContent.paymentMode;
		        	data.paymentRef = $scope.addNewContent.paymentRef;
		        	data.paymentDate = $scope.addNewContent.paymentDate;
		        	
		        	console.log(data)  	
			        $http({
			          method  : 'POST',
			          url     : 'https://zaitoon.online/services/erpaddinventorypaymentshistory.php',
			          data    : data,
			          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			         })
			         .then(function(response) {
			              $('#loading').hide(); $("body").css("cursor", "default");
			              if(response.data.status){
			              	$scope.newContentSet();
			              	$scope.initializeContent($scope.marketingType, $scope.currentDisplayPage, 'save');
			              }
			              else{
			              	$scope.newContentSaveError = response.data.error;
			              }
			         });
		      	}
		}
		
	
	}
	
	$scope.hideNewContent = function(){
		$scope.newContentSet();
		$scope.defaultFlagSet();
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
