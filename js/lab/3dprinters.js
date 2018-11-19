
var url = "http://104.248.113.22/";

function focusOn(element_Id) {
    var element = document.getElementById(element_Id);
    // we need to wait for the element to finish loading onto the page
    // should be fairly consistent but we should test this to be sure
    window.setTimeout(function () {
        element.focus();
    }, 250);
}

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

function changeFunc(event) {
	// incase we want to do something when items in 3d queue change to cutting
	return;
}

function fill3DPrinterQueue(object) {
	var estimated_time = 0;
	if(object == undefined) {
		return;
	}
	console.log("Laser Queue: ")
	console.log(object)
	var elements = object.laser_queues;

	var statuses = ["Waiting", "Printing", "Skipped", "Done"]
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
		newInnerHTML += "<option>" + techs[i].name + "</option>";
	}
	elements.innerHTML = newInnerHTML;
}

$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];        
        if(this.getAttribute('href') == "#home") {
            focusOn("userCard_ID");
        }
    });
});