// {material_name: "", initial_amount: NaN, date_purchased: "", num_semesters: NaN}
var url = "http://104.248.113.22/gavin";

function getmaterials() {
	$.ajax({
		url : url + "api/web/material/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			printmaterials(response);
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
			printmaterials(response);
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