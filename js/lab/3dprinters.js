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
	document.getElementById("tableBody").innerHTML = newInnerHTML; 
}

async function manuallyAddQueue() {
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

	getLabTechs("tech_select_add");
	fillMachineID("machine_id");
	checkSwap("manually_add_to_queue", "manually_add_to_queue");
	checkSwap("3d_cutting_queue", "manually_add_to_queue");
	clearInput3D();
}

async function fillStudentProfile(student) {
	student = student.students[0];

	document.getElementById("student_name").value = student.first_name + " " + student.last_name;
	getLabTechs("tech_select_add");
	fillMachineID("machine_id");
	checkSwap("manually_add_to_queue", "manually_add_to_queue");
	checkSwap("3d_cutting_queue", "manually_add_to_queue");
	clearInput3D();
}

function clearInput3D() {
	document.getElementById("student_name").value = "";
	document.getElementById("estimated_time").value = "";
	document.getElementById("part_name").value = "";
	document.getElementById("file_path").value = "";
	document.getElementById("material_name").value = "";
	document.getElementById("soluble_name").value = "";
	document.getElementById("material_amount").value = "";
	document.getElementById("soluble_amount").value = "";
	document.getElementById("club_name").value = "";
}

async function addTo3DQueueButton() {
	var name = document.getElementById("student_name");
	var estimated_time = document.getElementById("estimated_time");
	var lab_tech = document.getElementById("tech_select_add");
	var machine_id = document.getElementById("machine_id");
	var part_name = document.getElementById("part_name");
	var file_path = document.getElementById("file_path");
	var material_name = document.getElementById("material_name");
	var soluble_name = document.getElementById("soluble_name");
	var material_amount = document.getElementById("material_amount");
	var soluble_amount = document.getElementById("soluble_amount");
	var club_name = document.getElementById("club_name");

	name = name.value;
	estimated_time = estimated_time.value;
	lab_tech = lab_tech.options[lab_tech.selectedIndex].getAttribute("tech_id");
	machine_id = machine_id.value;
	part_name = part_name.value;
	file_path = file_path.value;
	material_name = material_name.value;
	material_amount = parseFloat(material_amount.value);
	soluble_name = soluble_name.value;
	soluble_amount = parseFloat(soluble_amount.value);
	club_name = club_name.value;


	var student_id = await getStudent(name);
	var payload = {
		"machine_id" : machine_id,
		"student_id" : student_id,
		"tech_id" : tech_id,
		"estimated_time" : estimated_time,
		"part_name" : part_name,
		"material_name" : material_name,
		"material_amount" : material_amount,
		"soluble_amount" : soluble_amount,
		"soluble_name" : soluable_name,
		"club_name" : club_name
	};

	await add3DQueue(payload);
	checkSwap("3d_cutting_queue", "3d_cutting_queue");
	checkSwap("manually_add_to_queue", "3d_cutting_queue");
	add3DQueue();
}

async function add3DQueue(payload) {
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


function cardSwipeFind() {
	var input = document.getElementById("userCard_ID");
	var str = input.value;
	str = parseID(str);
	fillStudentName(str);
	manuallyAddQueue();
	return false;
}

async function foundStudent(event) {
	var target = event.target;
	document.getElementById("student_search").value = "";
	
	$("#searchStudentModal").modal("hide");
	fillStudentProfile(await getStudent(target.getAttribute("student_id")));
}

$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];
        href = this.getAttribute('href');        
        if(href == "#home") {
        	checkSwap("3d_cutting_queue", "3d_cutting_queue");
			checkSwap("manually_add_to_queue", "3d_cutting_queue");
            focusOn("userCard_ID");
        }
        if(href != "#menu1") {
        	// clear form
        	clearInput3D();
        	document.getElementById("manually_add_to_queue").setAttribute("student_id", "")
        }
    });

    $('#searchStudentModal').on('shown.bs.modal', function () {
    	$("#student_search").focus();
 	});
});
