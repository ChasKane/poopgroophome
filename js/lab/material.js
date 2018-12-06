// {material_name: "", initial_amount: NaN, date_purchased: "", num_semesters: NaN}
//var url = "http://104.248.113.22/gavin/";
var url = "http://104.248.113.22/";
 function getmaterials() {
 	$.ajax({
 		url : url + "api/web/material/read.php",
 		type : "POST",
 		success : function(response, tStatus, responseCode) {
 			loadmaterials(response);
      
 		},
 		error : function(response, tStatus, responseCode) {
 			return responseCode.status;
 		}
 	});
 }

 function addmaterial() {
 	var payload = {
 		"material_name" : document.getElementById("material_name").value,
 		"initial_amount" : parseFloat(document.getElementById("initial_amount").value),
 		"date_purchased" : String(document.getElementById("date_purchased").value),
 		"num_semesters" : parseInt(document.getElementById("num_semesters").value)
	}
 	console.log(payload);
 	
   $.ajax({
 		url : url + "api/web/material/create.php",
 		type : "POST",
 		data : JSON.stringify(payload),
 		success : function(response, tStatus, responseCode) {
 			
 		},
 		error : function(response, tStatus, responseCode) {
 			return responseCode.status;
 		}
 	});
 }

 function printmaterials(object) {
 	console.log(object);
 	var element = document.getElementsByTagName("p")[0];
 	element.innerHTML = JSON.stringify(object);
 }
 
 function loadmaterials(object)
 {
   var stuff = JSON.stringify(object);
   var data = object.threedmaterials;
   var dropdown = document.getElementById('selectmaterial');
   for (var i in data){
          option = document.createElement('option');
      	  option.text = data[i].material_name;  
          option.id= data[i].material_name;  
          option.value = data[i].material_name;
      	  dropdown.add(option);
    	}    
 }

 function showtable()
 {
    $.ajax({
    url : url + "api/web/material/read.php",
    type : "POST",
    success : function(response, tStatus, responseCode) {
      
    },
    error : function(response, tStatus, responseCode) {
      
    }
    });
                                    
                                    
 }