// common functions that many pages will use, will be imported by all for the url below
var url = "http://104.248.113.22/gavin/";

function swapDisplay(div_name) {
	console.log(div_name)
	var x = document.getElementById(div_name);
	var display = x.getAttribute("vis");
    if (display == "" || display == "none") {
    	x.setAttribute("vis", "block")
        x.style.display = "block";
    } else {
        x.style.display = "none";
        x.setAttribute("vis", "none")
    }
}

function checkSwap(id, display_id) {
	var elem = document.getElementById(id);
	if(id == display_id && elem.getAttribute("vis") == "none") {
		swapDisplay(id);
	} else if(id != display_id && elem.getAttribute("vis") == "block") {
		swapDisplay(id);
	}
}

function focusOn(element_Id) {
    var element = document.getElementById(element_Id);
    // we need to wait for the element to finish loading onto the page
    // should be fairly consistent but we should test this to be sure
    window.setTimeout(function () {
        element.focus();
    }, 350);
}

// gets lab techs from database
function getLabTechs(id) {
	$.ajax({
		url : url + "api/web/labtech/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			fillLabTechs(response, id);
		},
		error : function(response, tStatus, responseCode) {
			console.error(responseCode.status);
		}
	});
}

// fills in lab techs in element with id = passed in id
function fillLabTechs(object, id) {
	var elements = document.getElementById(id);
	var techs = object.lab_techs;
	var newInnerHTML = ""

	for(var i=0; i < techs.length; i++) {
		newInnerHTML += "<option>" + techs[i].name + "</option>";
	}
	elements.innerHTML = newInnerHTML;
}

async function getMachineID() {
	var retval = await $.ajax({
		url : url + "api/web/machine/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			retval = response;
		},
		error : function(response, tStatus, responseCode) {
			console.error(responseCode.status);
		}
	});

	return retval
}

async function fillMachineID(id) {
	var machines = await getMachineID();
	machines = machines.machines;
	var newHTML = ""

	for(var idx in machines) {
		newHTML += "<option>" + machines[idx].machine_id + "</option>";
	}
	var elem = document.getElementById(id);
	elem.innerHTML = newHTML;
	console.log(newHTML)
} 

async function getStudent(input) {
	payload = {
		"query_field" : input
	}

	var retval = await $.ajax({
		url : url + "api/web/student/read.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});
	return retval;
}

// checks to see if there is a hash in the url then simulates a click on the 
// element with given href then calls the passed in function to fill in the form
function hashCheck(href, func) {
	var hash = location.hash;
	if(hash == "") {
		console.log("there was no hash");
		return;
	}

	if(href !== null) {
		$('.nav-tabs a[href="' + href + '"]').tab('show');
	}

	func();
	student_id = hash.split("=")[1];
	document.getElementById("manually_add_to_queue").setAttribute("id", student_id);
	fillStudentName(student_id);
}

async function fillStudentName(student_id) {
	var student = await getStudent(student_id);
	student = student.students[0];

	var elem = document.getElementById("student_name");
	elem.value = student.first_name + " " + student.last_name;
}

function calcTime(initTime, timeAdd) {
	var initTimeArray = initTime.split(":");
	var timeAddArray = timeAdd.split(":");
	var time = [0, 0, 0];
	var retval = ["", "", ""];
	for(var idx = 0; idx < 3; idx++) {
		initTimeArray[idx] = parseInt(initTimeArray[idx]);
		timeAddArray[idx] = parseInt(timeAddArray[idx]);
		time[idx] = initTimeArray[idx] + timeAddArray[idx];

		if(idx > 0) {
			if(time[idx] > 60) {
				time[idx] -= 60;
				time[idx-1] += 1;
				if(time[idx-1] < 10) {
					retval[idx-1] = "0" + String(time[idx-1]);
				} else {
					retval[idx-1] = String(time[idx-1]);
				}
			}
		}

		if(time[idx] < 10) {
			retval[idx] = "0" + String(time[idx]);
		} else {
			retval[idx] = String(time[idx]);
		}
	}
	retval = retval[0] + ":" + retval[1] + ":" + retval[2];
	return retval;
}