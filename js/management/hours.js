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
		"sunday_open" : encodetoMilitary(sunopen),
		"sunday_close" : encodetoMilitary(sunclose),
		"monday_open" : encodetoMilitary(monopen),
		"monday_close" : encodetoMilitary(monclose),
		"tuesday_open" : encodetoMilitary(tueopen),
		"tuesday_close" : encodetoMilitary(tueclose),
		"wednesday_open" : encodetoMilitary(wedopen),
		"wednesday_close" : encodetoMilitary(wedclose),
		"thursday_open" : encodetoMilitary(thuropen),
		"thursday_close" : encodetoMilitary(thurclose),
		"friday_open" : encodetoMilitary(friopen),
		"friday_close" : encodetoMilitary(friclose),
		"saturday_open" : encodetoMilitary(satopen),
		"saturday_close" : encodetoMilitary(satclose)

	};

		$.ajax({
		url : url + "api/web/labhours/update.php",
		type : "POST",
		data : JSON.stringify(payload),

		success : function(response, tStatus, responseCode) {
			retval = response;
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
	document.getElementById("SunOpen").value = decodefromMilitary(elements[0].sunday_open);
	document.getElementById("SunClose").value = decodefromMilitary(elements[0].sunday_close);
	document.getElementById("MonOpen").value = decodefromMilitary(elements[0].monday_open);
	document.getElementById("MonClose").value = decodefromMilitary(elements[0].monday_close);
	document.getElementById("TueOpen").value = decodefromMilitary(elements[0].tuesday_open);
	document.getElementById("TueClose").value = decodefromMilitary(elements[0].tuesday_close);
	document.getElementById("WedOpen").value = decodefromMilitary(elements[0].wednesday_open);
	document.getElementById("WedClose").value = decodefromMilitary(elements[0].wednesday_close);
	document.getElementById("ThuOpen").value = decodefromMilitary(elements[0].thursday_open);
	document.getElementById("ThuClose").value = decodefromMilitary(elements[0].thursday_close);
	document.getElementById("FriOpen").value = decodefromMilitary(elements[0].friday_open);
	document.getElementById("FriClose").value = decodefromMilitary(elements[0].friday_close);
	document.getElementById("SatOpen").value = decodefromMilitary(elements[0].saturday_open);
	document.getElementById("SatClose").value = decodefromMilitary(elements[0].saturday_close);
	

}



function decodefromMilitary(time){
    //var time = "12:23:39";
    var timeValue = "";
    var time = time.split(':');
    var hours = time[0];
    var hourstemp = 0;
    var minutes = time[1];
    var seconds = time[2];
    
    if (hours > 12)
    {
      hourstemp =  hours - 12;
      if( hourstemp <10 && hourstemp >0)
        timeValue = "0" + hourstemp;
 
      else if(hourstemp == 0)
        timeValue =  "00"; 
 
      else
      	timeValue = hourstemp;
    }

    else 
      timeValue = hours; 

    timeValue += ":" + minutes;

    if(hours>= 12)
      timeValue += " P.M.";

    else 
      timeValue += " A.M.";

    return timeValue;
}

function encodetoMilitary(time)
{
	timeString = "";
    if (time.substring(6, 9) == "P.M")
    {
    hours = Number(time.substring(0, 2) ) + 12;
    timeString += hours;
    }
    else
	{
    hours = time.substring(0, 2) 
    timeString += hours;
    }
    
    timeString += time.substring(2, 5) 
    timeString += ":00"
    
    return timeString;

}