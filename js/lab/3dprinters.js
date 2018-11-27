// most functions for 3dprinter page

function get3DPrinterQueue() {
	$.ajax({
		url : url + "api/web/3dprintqueue/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			console.log(response);
			fill3DPrinterQueue(response);
		},
		error : function() {
			console.log("there be an error");
		}
	});
}

function fill3DPrinterQueue(object) {
	var estimated_time = 0;
	if(object == undefined) {
		return;
	}
	console.log("Laser Queue: ")
	console.log(object)
	var elements = object.threedprintqueues;

	var statuses = ["Waiting", "Printing", "Skipped", "Done"]
	var newInnerHTML = "";
	var i = 0
	
	for (var idx in elements) {
		console.log("1 boi")
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
	console.log(newInnerHTML);
	document.getElementById("tableBody").innerHTML = newInnerHTML; 
}

function manuallyAddQueue() {
	getLabTechs("tech_select_add");
	fillMachineID("machine_id");
	checkSwap("manually_add_to_queue", "manually_add_to_queue");
	checkSwap("3d_cutting_queue", "manually_add_to_queue");
}

async function addTo3DQueueButton() {
	var name = document.getElementById("student_name");
	var estimated_time = document.getElementById("estimated_time");
	var lab_tech = document.getElementById("tech_select_add");
	var machine_id = document.getElementById("machine_id");

	name = name.value;
	estimated_time = estimated_time.value;
	lab_tech = lab_tech.options[lab_tech.selectedIndex].getAttribute("tech_id");
	console.log(lab_tech);
	machine_id = machine_id.value;

	await add3DQueue(name, lab_tech, machine_id, estimated_time);
	checkSwap("3d_cutting_queue", "3d_cutting_queue");
	checkSwap("manually_add_to_queue", "3d_cutting_queue");
	laserQueueButton();
}

async function add3DQueue(student_name, tech_id, machine_id, estimated_time) {
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
		url : url + "api/web/3dprintqueue/create.php",
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

$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];
        href = this.getAttribute('href');        
        if(href == "#menu1") {
        	checkSwap("3d_cutting_queue", "3d_cutting_queue");
			checkSwap("manually_add_to_queue", "3d_cutting_queue");
            focusOn("userCard_ID");
        }
    });
});
