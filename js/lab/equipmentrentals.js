
function getRentedEquipment(student) {
	student = student.students[0];
	var payload = {
		student_id : student.student_id
	}

	$.ajax({
		url : url + "api/web/rentedinventory/read.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			updateRentalTable(response);
		},
		error : function() {
			var elem = document.getElementById("tableBody");
			var newHTML = "<tr><th>None</th>";
			newHTML += "<th>None</th>";
			newHTML += "<th>None</th>";
			newHTML += "<th>None</th>";
			newHTML += "</tr>";
			elem.innerHTML = newHTML;
		}
	});
}

function updateRentalTable(rented_equipment) {
	rented_equipment = rented_equipment.rented_inventory;

	var newHTML = "";
	var elem = document.getElementById("tableBody");

	for(var idx in rented_equipment) {
		newHTML += "<tr><th>" + rented_equipment[idx].name + "</th>";
		newHTML += "<th>" + rented_equipment[idx].item_id + "</th>";
		newHTML += "<th>" + rented_equipment[idx].sacrificed + "</th>";
		newHTML += "<th>" + rented_equipment[idx].loaned_date + "</th>";
		newHTML += "</tr>";
	}

	elem.innerHTML = newHTML;
}

async function findStudent() {
	var name = document.getElementById("userCard_ID");
	name = name.value;

	var students = await getStudent(name);
	if(students == undefined || students.students.length > 1) {
		document.getElementById("student_search").value = name;
		fillModalTable("student_search");
		$("#searchStudentModal").modal("show");
		return;
	} else {
		getRentedEquipment(students);
	}
}

async function foundStudent(event) {
	var target = event.target;
	document.getElementById("student_search").value = "";
	document.getElementById("student_table").innerHTML = "";
	
	$("#searchStudentModal").modal("hide");
	getRentedEquipment(await getStudent(target.getAttribute("student_id")));
}

function cardSwipeFind() {
	var input = document.getElementById("userCard_ID");
	var str = input.value;
	str = parseID(str);
	// getRentedEquipment(await getStudent(str));
	
	return false;
}