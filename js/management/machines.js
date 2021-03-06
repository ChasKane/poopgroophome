//meep
// most functions for machines tab

var url = "http://104.248.113.22/";

function getMachineList() {
	$.ajax({
		url : url + "api/web/machine/read.php",
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

function editMachine(machine_id) {
    $.ajax({
		url : url + "api/web/machine/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
            console.log(response);
			editMachine2(machine_id, response);
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
    var i = 0;
    var status;
	
	for (var idx in elements) {
        console.log("1 mech")
        if (elements[idx].status == null)
        {
            status = statuses[0];
        } else {
            status = elements[idx].status;
        }

		newInnerHTML += "<tr id=" + "r" + (i++) + " class="+ status +">";
		newInnerHTML += '<td>' + elements[idx].name + '<button type"button" class="btn btn-default btn-xs" onclick="editMachine('+ elements[idx].machine_id +');"><span name=edit_icon class="glyphicon glyphicon-pencil"></span></button></td>'+'<td>' + elements[idx].type + '</td>'+'<td>' + elements[idx].machine_id + '</td> '+
						'<td>' + elements[idx].restrictions + '</td>' + '<td>' + elements[idx].date_added + '</td>' + 
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
	console.log("Changing status");
	var payload = {
        "machine_id" : id,
		"status" : newStatus
	};

	var retval;
	retval = await $.ajax({
		url : url + "api/web/machine/updatestatus.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
			console.log(response);
		}

	});
	fillMachineTable(retval);
	return retval;
}

// might have issue <><><><><><><><><><><><><><><> but none found yet
function changeFunc(event) {
	// console.log(event.target.getAttribute("oldvalue"))
	var targ = event.target;
	console.log(targ.value);

    if(confirm("Change to "+ targ.value +"?")) {
        targ.setAttribute("oldValue", targ.value);
        var elem = targ.parentElement.parentElement.parentElement.getElementsByTagName("td")[2];
        updateMachine(targ.value, elem.innerHTML)
    } else {
        console.log(targ.getAttribute("oldvalue"));
        targ.value = targ.getAttribute("oldvalue");
    }
}

function editMachine2(machine_id, obj) {
    console.log(obj);
    var machines = obj.machines;

    for (var idx in machines)
    {
        if (machines[idx].machine_id == machine_id)
        {
            console.log("setting att.");
            document.getElementById("mach_id").innerHTML = machines[idx].machine_id;
            document.getElementById("mach_id").setAttribute("lookup", machines[idx].machine_id);
            document.getElementById("machine_name_edit").setAttribute("placeholder", machines[idx].name);
            document.getElementById("machine_type_edit").setAttribute("placeholder", machines[idx].type);
            document.getElementById("restrictions_edit").setAttribute("placholder", machines[idx].restrictions);
        }
    }
    
    
	checkSwap("edit_Maching_form", "edit_Maching_form");
	checkSwap("machine_list_block", "edit_Maching_form");
}

async function editConfirmButton() {
	var name = document.getElementById("machine_name_edit").value;
	var machine_type = document.getElementById("machine_type_edit").value;
    var restrictions = document.getElementById("restrictions_edit").value;
    var machine_id = document.getElementById("mach_id").getAttribute("lookup");
    var machines;

    if (name == undefined || machine_type == undefined || restrictions == undefined ||name == "" || machine_type == "" || restrictions == "")
    {
        alert("One or more fields unfilled.")
        return;
    }

    $.ajax({
		url : url + "api/web/machine/read.php",
		type : "POST",
		success : async function(response, tStatus, responseCode) {
            console.log(response);
            machines = response.machines;
			for (var idx in machines)
            {
                console.log(machines[idx].machine_id, machine_id);
                if (machines[idx].machine_id == machine_id)
                {
                    var payload = {
                        "machine_id" : machine_id,
                        "name" : name,
                        "type" : machine_type,
                        "restrictions" : restrictions,
                        "date_added" : machines[idx].date_added,
                        "status" : machines[idx].status
                    };
                
                    console.log("here i am");
                    var retval = await editMDataSend(payload);
                    checkSwap("machine_list_block", "machine_list_block");
                    checkSwap("edit_Maching_form", "machine_list_block");
                    fillMachineTable(retval);
                }
            }
		},
		error : function() {
			console.log("there be an error");
		}
    });

    
}

function editCancelButton() {
    checkSwap("machine_list_block", "machine_list_block");
	checkSwap("edit_Maching_form", "machine_list_block");
}

async function editMDataSend(payload) {
	console.log(payload);
	var retval = await $.ajax({
		url : url + "api/web/machine/update.php",
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
		url : url + "api/web/machine/create.php",
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

async function editDeleteButton() {
    var machine_id = document.getElementById("mach_id").getAttribute("lookup");
    var name = document.getElementById("machine_name_edit").value;

    if(confirm("Delete "+ name +" machine?")) {
        var payload = {
            "machine_id" : machine_id
        };

        var retval = await deleteMachineFromList(payload);
        checkSwap("machine_list_block", "machine_list_block");
        checkSwap("edit_Maching_form", "machine_list_block");
        fillMachineTable(retval);
    } else {
        console.log("Failed to delete.");
    }
}

async function deleteMachineFromList(payload) {
	console.log(payload);
	var retval = await $.ajax({
		url : url + "api/web/machine/delete.php",
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

