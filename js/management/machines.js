//meep
// most functions for machines tab

var url = "http://104.248.113.22";

function getMachineList() {
	$.ajax({
		url : url + "/api/web/machine/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			console.log(response);
			fillMachineTable(response);
		},
		error : function() {
			console.log("there be an error");
		}
	});
}

function fillMachineTable(object) {
	if(object == undefined) {
		return;
	}
	console.log("Machine list: ")
	console.log(object)
	var elements = object.machines;

	var statuses = ["Working", "Broken", "Maintenance"]
	var newInnerHTML = "";
	var i = 0
	
	for (var idx in elements) {
		console.log("1 mech")
		newInnerHTML += "<tr id=" + "r" + (i++) + " class="+ elements[idx].status +">";
		newInnerHTML += "<td>" + elements[idx].name + "</td>" + "<td>" + elements[idx].type + "</td>" + "<td>" + elements[idx].machine_id + "</td>" +
						"<td>" + elements[idx].restrictions + "</td>" + "<td>" + elements[idx].date_added + "</td>" + 
						'<td> <div class="selection">';
		
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

async function updateMachine(newStatus, id) {
	console.log("Changing status")
	var payload = {
        "machine_id" : id,
		"status" : newStatus
	};

	var retval;
	retval = await $.ajax({
		url : url + "/api/web/machine/updatestatus.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
			console.log(response);
		}

	});
	fillMachineTable(retval)
	return retval;
}

// might have issue <><><><><><><><><><><><><><><>
function changeFunc(event) {
	// console.log(event.target.getAttribute("oldvalue"))
	var targ = event.target;
	console.log(targ.value);

    if(confirm("Change to "+ targ.value +"?")) {
        targ.setAttribute("oldValue", targ.value);
        var elem = targ.parentElement.parentElement.parentElement.getElementsByTagName("td")[2];
        updateMachine(targ.value, elem.innerHTML)
        // tell firebase to notify next 2 people
    } else {
        console.log(targ.getAttribute("oldvalue"));
        targ.value = targ.getAttribute("oldvalue");
    }
}

function addMachine() {
	checkSwap("add_Maching_form", "add_Maching_form");
	checkSwap("machine_list_block", "add_Maching_form");
}

async function addToMListButton() {
	var name = document.getElementById("machine_name").value;
	var machine_type = document.getElementById("machine_type").value;
	var restrictions = document.getElementById("restrictions").value;

	var payload = {
		"name" : name,
		"type" : machine_type,
		"restrictions" : restrictions
	};

	var retval = await addMachineToList(payload);
	checkSwap("machine_list_block", "machine_list_block");
    checkSwap("add_Maching_form", "machine_list_block");
    fillMachineTable(retval);
}

function addCancelButton() {
    checkSwap("machine_list_block", "machine_list_block");
	checkSwap("add_Maching_form", "machine_list_block");
}


async function addMachineToList(payload) {
	console.log(payload);
	var retval = await $.ajax({
		url : url + "/api/web/machine/create.php",
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

// $(document).ready(function() {
//     $('.nav-tabs a').on('show.bs.tab', function(e){
//         activeTab = $(this).attr('href').split('-')[1];
//         href = this.getAttribute('href');        
//         if(href == "#menu1") {
//         	checkSwap("3d_cutting_queue", "3d_cutting_queue");
// 			checkSwap("manually_add_to_queue", "3d_cutting_queue");
//             focusOn("userCard_ID");
//         }
//     });
// });
