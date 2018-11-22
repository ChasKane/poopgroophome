// js for laser queue


var url = "http://104.248.113.22/"

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

function focusOn(element_Id) {
    var element = document.getElementById(element_Id);
    // we need to wait for the element to finish loading onto the page
    // should be fairly consistent but we should test this to be sure
    window.setTimeout(function () {
        element.focus();
    }, 250);
}

async function getlaserqueue() {
	var retval = await $.ajax({
		url : url + "api/web/laserqueue/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			console.log(response)
			retval = response;
		},
		error : function() {
			console.log("there be an error")
		}
	});
	console.log(retval)
	return retval;
}

function addToQueue() {
	var payload = "nothing";	
	$.ajax({
		url : url + "api/web/laserqueue/create.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			return responseCode.status;
		}
	});
}

async function updatequeue(newStatus, position) {
	console.log("Changing status")
	var payload = {
		"status" : newStatus,
		"queue_pos" : position
	};

	var retval;
	retval = await $.ajax({
		url : url + "api/web/laserqueue/update.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
			console.log(response);
		}

	});
	fillLaserQueue(retval)
	return retval;
}

function changeFunc(event) {
	// console.log(event.target.getAttribute("oldvalue"))
	var targ = event.target;
	console.log(targ.value);
	if(targ.value == "Cutting") {
		if(confirm("Change to cutting?")) {
			targ.value = "Cutting";
			targ.setAttribute("oldValue", "Cutting");
			var elem = targ.parentElement.parentElement.parentElement.getElementsByTagName("td")[0];
			updatequeue(targ.value, elem.innerHTML)
			// tell firebase to notify next 2 people
		} else {
			console.log(targ.getAttribute("oldvalue"));
			targ.value = targ.getAttribute("oldvalue");
		}

	} else {
		targ.setAttribute("oldValue", targ.value);
		
		// yes i know this is not a great way to do thi
		var elem = targ.parentElement.parentElement.parentElement.getElementsByTagName("td")[0];
		updatequeue(targ.value, elem.innerHTML)
	}
	// fillLaserQueue();
}

async function laserQueueButton() {
	 var retval = await getlaserqueue();
	 fillLaserQueue(retval);
}

function fillLaserQueue(object) {
	var estimated_time = 0;
	if(object == undefined) {
		return;
	}
	console.log("Laser Queue: ")
	console.log(object)
	var elements = object.laser_queues;

	var statuses = ["Waiting", "Cutting", "Skipped", "Done"]
	var newInnerHTML = "";
	var i = 0
	
	for (var idx in elements) {
		newInnerHTML += "<tr id=" + "r" + (i++) + " class="+ elements[idx].status +">";
		estimated_time += elements[idx].estimated_time;
		newInnerHTML += "<td>" + elements[idx].queue_pos + "</td>" + "<td>" + elements[idx].machine_id + "</td>" + 
						"<td>" + elements[idx].student_id + "</td>" + "<td>" + elements[idx].tech_id + "</td>" + 
						"<td>" + estimated_time + "</td>" +'<td> <div class="selection">';
		
		newInnerHTML += "<select onchange='changeFunc(event)' oldvalue='" + elements[idx].status + "'>";
		for (var idx2 in statuses) {
			if(statuses[idx2] == elements[idx].status){
				newInnerHTML += "<option value='" + statuses[idx2] + "' selected>" + statuses[idx2] + "</option>";
			} else {
				newInnerHTML += "<option value='" + statuses[idx2] + "'>" + statuses[idx2] + "</option>";
			}
		}
		newInnerHTML += "</select></tr>";
	}
	document.getElementById("tableBody").innerHTML = newInnerHTML;
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
		newInnerHTML += "<option tech_id=" + techs[i].tech_id + ">" + techs[i].name + "</option>";
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


// functions for switching visisbility on elements
function swapDisplay(div_name) {
	console.log(div_name)
	var x = document.getElementById(div_name);
	var display = x.getAttribute("vis");
    if (display == "" || display == "none") {
    	console.log("should display "  + x);
    	x.setAttribute("vis", "block")
        x.style.display = "block";
    } else {
        x.style.display = "none";
        x.setAttribute("vis", "none")
    }
}

// if id == display_id, make it visible
function checkSwap(id, display_id) {
	var elem = document.getElementById(id);
	console.log(elem);
	if(id == display_id && elem.getAttribute("vis") == "none") {
		swapDisplay(id);
	} else if(id != display_id && elem.getAttribute("vis") == "block") {
		swapDisplay(id);
	}
}


// Manually add student to laser queue
async function addLaserQueueButton() {
	var name = document.getElementById("userCard_ID");
	name = name.value;
	var stu_name = document.getElementById("student_name");
	stu_name = name.value;

	getLabTechs("tech_select_add");
	fillMachineID("machine_id");
	checkSwap("laser_cutting_queue", "manually_add_to_queue");
	checkSwap("manually_add_to_queue", "manually_add_to_queue")

	var hash = location.hash;
	if(hash == "") {
		console.log("there was no hash");
		return;
	}

	var student_id = hash.split("=")[1];
	var student = await getStudent(student_id);
	console.log(student);
	student = student.students;

	var elem = document.getElementById("student_name");
	elem.value = student.first_name + " " + student.last_name;

}

async function addLaserQueue(student_name, tech_id, machine_id, estimated_time) {
	var payload = {
		"query_field" : student_name
	}

	var student_id = await $.ajax({
		url : url + "api/web/student/read.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function (response, tStatus, responseCode) {
			return response;
		}
	});
	// student_id = student_id.student;
	console.log("student_id: ")
	student_id = student_id.students[0].student_id;
	console.log(student_id)

	payload = {
		"machine_id" : machine_id,
		"student_id" : student_id,
		"tech_id" : tech_id,
		"estimated_time" : estimated_time
	}

	console.log(payload);
	var retval = await $.ajax({
		url : url + "api/web/laserqueue/create.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		},
		error : function(response, tStatus, responseCode) {
			console.error(responseCode.status);
		}
	});

	return retval;
}

// adds student to laser queue
async function addToLaserQueueButton() {
	var name = document.getElementById("student_name");
	var estimated_time = document.getElementById("estimated_time");
	var lab_tech = document.getElementById("tech_select_add");
	var machine_id = document.getElementById("machine_id");

	name = name.value;
	estimated_time = estimated_time.value;
	lab_tech = lab_tech.options[lab_tech.selectedIndex].getAttribute("tech_id");
	console.log(lab_tech);
	machine_id = machine_id.value;

	await addLaserQueue(name, lab_tech, machine_id, estimated_time);
	checkSwap("laser_cutting_queue", "laser_cutting_queue");
	checkSwap("manually_add_to_queue", "laser_cutting_queue");
	laserQueueButton();
}

function setInactive(id) {
	var elem = document.getElementById(id);
	if(elem.classList.contains("in")) {
		elem.classList.remove("in");
		elem.classList.remove("active");
	} else {
		return;
	}
}

function hashCheck() {
	var hash = location.hash;
	if(hash == "") {
		console.log("there was no hash");
		return;
	}

	var elem = document.getElementById("nav_tab");
	elem = elem.getElementsByTagName("li");
	for(var idx in elem) {
		if(elem[idx].classList == undefined) {
			continue;
		}
		
		if(elem[idx].classList.contains("active")) {
			console.log("Found an ative class");
			elem[idx].classList.remove("active");
			elem[idx].firstChild.setAttribute("aria-expanded", "false");
		} 
	}

	// set the other three tabs to inactive
	setInactive("home");

	elem = elem[1];
	elem.classList.add("active");
	elem.firstChild.setAttribute("aria-expanded", "true")
	
	elem = document.getElementById("menu1");
	elem.classList.add("active");
	elem.classList.add("in");
	addLaserQueueButton();
}

// make sure the right elements are visible
$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];
        href = this.getAttribute('href');        
        if(href == "#menu1") {
            checkSwap("laser_cutting_queue", "laser_cutting_queue");
			checkSwap("manually_add_to_queue", "laser_cutting_queue");
        }
    });
});