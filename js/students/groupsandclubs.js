var url = "http://104.248.113.22/gavin/";

async function getAllClubs() {
	var retval = await $.ajax({
		url : url + "api/web/club/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			console.log(response);
		},
	});
	console.log(retval)
	return retval;
}

async function loadClubTable() {
	var groups = await getAllClubs();
	var groups = groups.clubs;
	var newHTML = "";

	for(var idx in groups) {
		newHTML += "<tr id='club_row" + idx + "'><td id='club" + idx + "' onclick='loadMembers(event)'>" + groups[idx].club_name +"</td></tr>";

	}
	var elem = document.getElementById("club_table_body");
	elem.innerHTML = newHTML;
}

async function getMembers(club_name) {
	console.log(club_name);
	var payload = {
		"club_name" : club_name
	};

	var retval = await $.ajax({
		url : url + "api/web/student_club/read.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			console.log(response);
		},
	});
	
	return retval;
}

async function loadMembers(event) {
	var targ = event.target;
	var newHTML = "";
	console.log(targ);
	var members = await getMembers(targ.innerHTML);
	console.log(members)
	members = members.students;

	for(var idx in members) {
		newHTML += "<tr id='member_row" + idx + "'><td id='member" + idx + "' onclick='loadMembers(event)'>" + members[idx].first_name + " " + members[idx].last_name + "</td></tr>";
	}
	var element = document.getElementById("member_table_body");
	element.innerHTML = newHTML;
}

async function addToClub(student_id, club_name) {
	payload = {
		"student_id" : student_id,
		"club_name" : club_name
	}

	await $.ajax({
		url : url + "api/web/student_club/delete.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});
}

function addToClubButton(event) {
	var student_name = document.getElementById("name").innerHTML;
	var eventTarg = event.target;
	var club_name = eventTarg.getAttribute("club");
	
	getStudent(student_name).then(function(result) {
		var student_id = result.student_id;
		removeFromClub(student_id, club_name).then(function() {
			loadStudentProfile();
		});
	});
}

async function getGroups(student_id) {
	payload = {
		"student_id" : student_id
	}

	var retval = await $.ajax({
		url : url + "api/web/student_club/read.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		},
		error : function(response, tStatus, responseCode) {
			if(responseCode == 404) {
				return null;
			}
		}  
	});
	return retval;
}

async function removeFromClub(studentID, clubName) {
	payload = {
		"student_id" : studentID,
		"club_name" : clubName
	};
	await $.ajax({
		url : url + "api/web/student_club/delete.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});
}

function removefromClubButton(event) {
	var student_name = document.getElementById("fname").value;
	var eventTarg = event.target;
	var clubName = eventTarg.parentElement.getAttribute("club");
	
	getStudent(student_name).then(function(result) {
		var student_id = result.students[0].student_id;
		removeFromClub(student_id, clubName).then(function() {
			loadStudentProfile();
		});
	});
}
