

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