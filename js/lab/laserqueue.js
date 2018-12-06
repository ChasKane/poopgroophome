// js for laser queue
var url = "http://104.248.113.22/gavin/";

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
		}
	});
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

// function calcTime(initTime, timeAdd)
function fillLaserQueue(object) {
	var estimated_time = "00:00:00";
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
		if(elements[idx].status == "Waiting" || elements[idx].status == "Printing") {
			estimated_time = calcTime(estimated_time, elements[idx].estimated_time);
			newInnerHTML += "<td>" + elements[idx].machine_id + "</td>" + 
						"<td>" + elements[idx].student_name + "</td>" + 
						"<td>" + elements[idx].tech_name + "</td>" + 
						"<td>" + estimated_time + "</td>" +'<td> <div class="selection">';
		} else if(elements[idx].status == "Skipped") {
			newInnerHTML += "<td>" + elements[idx].machine_id + "</td>" + 
						"<td>" + elements[idx].student_name + "</td>" + 
						"<td>" + elements[idx].tech_name + "</td>" + 
						"<td>Skipped</td>" +'<td> <div class="selection">';
		} else {
			newInnerHTML += "<td>" + elements[idx].machine_id + "</td>" + 
						"<td>" + elements[idx].student_name + "</td>" + 
						"<td>" + elements[idx].tech_name + "</td>" + 
						"<td>Done</td>" +'<td> <div class="selection">';
		}
		
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

	var students = await getStudent(name);
	if(students == undefined || students.students.length > 1) {
		document.getElementById("student_search").value = name;
		fillModalTable("student_search");
		$("#searchStudentModal").modal("show");
		return;
	} else {
		fillAddLaserQueue(students);
	}
}

async function fillAddLaserQueue(student) {
	student = student.students[0];

	document.getElementById("student_name").value = student.first_name + " " + student.last_name;
	document.getElementById("manually_add_to_queue").setAttribute("student_id", student.student_id);
	getLabTechs("tech_select_add");
	fillMachineID("machine_id");
	checkSwap("laser_cutting_queue", "manually_add_to_queue");
	checkSwap("manually_add_to_queue", "manually_add_to_queue")
}

async function laserQueueHash() {
	checkSwap("laser_cutting_queue", "manually_add_to_queue");
	checkSwap("manually_add_to_queue", "manually_add_to_queue")
}

async function addLaserQueue(student_name, tech_id, machine_id, estimated_time) {
	var student_id = document.getElementById("manually_add_to_queue").getAttribute("student_id");

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
			document.getElementById("manually_add_to_queue").setAttribute("student_id", "");
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

function laserQueueSwap(id) {
	if(id == "laser_cutting_queue") {
		checkSwap("laser_cutting_queue", "laser_cutting_queue");
		checkSwap("manually_add_to_queue", "laser_cutting_queue");
	} else if(id == "manually_add_to_queue") {
		checkSwap("laser_cutting_queue", "manually_add_to_queue");
		checkSwap("manually_add_to_queue", "manually_add_to_queue");
	}
}

function cardSwipeFind() {
	var input = document.getElementById("userCard_ID");
	var str = input.value;
	str = parseID(str);
	fillStudentName(str);
	laserQueueSwap("manually_add_to_queue");
	return false;
}

async function foundStudent(event) {
	var target = event.target;
	document.getElementById("student_search").value = "";
	document.getElementById("student_table").innerHTML = "";
	
	$("#searchStudentModal").modal("hide");
	fillAddLaserQueue(await getStudent(target.getAttribute("student_id")));
}

// make sure the right elements are visible
$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];
        href = this.getAttribute('href');        
        if(href == "#menu1") {
            checkSwap("laser_cutting_queue", "laser_cutting_queue");
			checkSwap("manually_add_to_queue", "laser_cutting_queue");
			document.getElementById("userCard_ID").value = "";
        	laserQueueButton();
        }
        if(href != "#menu1") {
        	// clear form
        	document.getElementById("student_name").value = "";
        	document.getElementById("estimated_time").value = "";
        	document.getElementById("manually_add_to_queue").setAttribute("student_id", "")
        }
    });
    $('#searchStudentModal').on('shown.bs.modal', function () {
    	$("#student_search").focus();
 	});
});