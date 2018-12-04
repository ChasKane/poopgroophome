var url = "http://104.248.113.22/";


function loadHours(){
		$.ajax({
		url : url + "api/web/labhours/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			console.log(response);
			fillHoursTable(respose);
		},
		error : function() {
			console.log("there be an error");
		}
	});

}


function fillHoursTable(object){

	console.log(object)
	var elements = object.lab_hourss;
	document.getElementById("SunOpen").innerHTML = elements[0].sunday_open;
	document.getElementById("SunClose").innerHTML = elements[0].sunday_close;
	document.getElementById("MonOpen").innerHTML = elements[0].monday_open;
	document.getElementById("MonClose").innerHTML = elements[0].monday_close;
	document.getElementById("TueOpen").innerHTML = elements[0].tuesday_open;
	document.getElementById("TueClose").innerHTML = elements[0].tuesday.close;
	document.getElementById("WedOpen").innerHTML = elements[0].wednesday_open;
	document.getElementById("WedClose").innerHTML = elements[0].wednesday_close;
	document.getElementById("ThuOpen").innerHTML = elements[0].thursday_open;
	document.getElementById("ThuClose").innerHTML = elements[0].thursday_close;
	document.getElementById("FriOpen").innerHTML = elements[0].friday_open;
	document.getElementById("FriClose").innerHTML = elements[0].friday_close;
	document.getElementById("SatOpen").innerHTML = elements[0].saturday_open;
	document.getElementById("SatClose").innerHTML = elements[0].saturday_close;
	

}


