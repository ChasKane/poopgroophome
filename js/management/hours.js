var url = "http://104.248.113.22/";


function loadHours(){
		$.ajax({
		url : url + "api/web/labhours/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			console.log(response);
			fillHoursTable(response);
		},
		error : function() {
			console.log("there be an error");
		}
	});

}

function updateHours(){


	var sunopen = document.getElementById("SunOpen").value;
	var sunclose = document.getElementById("SunClose").value ;
	var monopen = document.getElementById("MonOpen").value ;
	var monclose = document.getElementById("MonClose").value;
	var tueopen = document.getElementById("TueOpen").value ;
	var tueclose = document.getElementById("TueClose").value ;
	var wedopen = document.getElementById("WedOpen").value ;
	var wedclose  =  document.getElementById("WedClose").value ;
	var thuropen = document.getElementById("ThuOpen").value ;
	var thurclose = document.getElementById("ThuClose").value;
	var friopen = document.getElementById("FriOpen").value ;
	var friclose = document.getElementById("FriClose").value ;
	var satopen = document.getElementById("SatOpen").value ;
	var satclose = document.getElementById("SatClose").value ;
	

	var payload = {
		"sunday_open" : sunopen,
		"sunday_close" : sunclose,
		"monday_open" : monopen,
		"monday_close" : monclose,
		"tuesday_open" : tueopen,
		"tuesday_close" : tueclose,
		"wednesday_open" : wedopen,
		"wednesday_close" : wedclose,
		"thursday_open" : thuropen,
		"thursday_close" : thurclose,
		"friday_open" : friopen,
		"friday_close" : friclose,
		"saturday_open" : satopen,
		"saturday_close" : satclose

	};

		$.ajax({
		url : url + "api/web/labhours/update.php",
		type : "POST",
		data : JSON.stringify(payload),

		success : function(response, tStatus, responseCode) {
			retval = response;
			alert("Hours have been updated.");
			loadHours();
		},
		error : function (response, tStatus, responseCode) {
			//
		}
	});
		
}


function fillHoursTable(object){

	console.log(object)
	var elements = object.lab_hourss;
	document.getElementById("SunOpen").value = elements[0].sunday_open;
	document.getElementById("SunClose").value = elements[0].sunday_close;
	document.getElementById("MonOpen").value = elements[0].monday_open;
	document.getElementById("MonClose").value = elements[0].monday_close;
	document.getElementById("TueOpen").value = elements[0].tuesday_open;
	document.getElementById("TueClose").value = elements[0].tuesday_close;
	document.getElementById("WedOpen").value = elements[0].wednesday_open;
	document.getElementById("WedClose").value = elements[0].wednesday_close;
	document.getElementById("ThuOpen").value = elements[0].thursday_open;
	document.getElementById("ThuClose").value = elements[0].thursday_close;
	document.getElementById("FriOpen").value = elements[0].friday_open;
	document.getElementById("FriClose").value = elements[0].friday_close;
	document.getElementById("SatOpen").value = elements[0].saturday_open;
	document.getElementById("SatClose").value = elements[0].saturday_close;
	

}


