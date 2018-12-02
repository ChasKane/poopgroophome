var url = "http://104.248.113.22/gavin/";

async function getMajors() {
	var retval = await $.ajax({
		url : url + "api/web/major/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			retval = response;
			buildMajorTable(response);
		}
	});
	//retval = retval.then(result => result.data);
}

function buildMajorTable(majors) {
	var newHTML = "";
	console.log(majors);
	majors = majors.majors

	for(var idx in majors) {
		newHTML += "<tr><td id='_" + idx + "' ondblclick='editMajor(event);' onfocusout='submitMajor(event)'>" + majors[idx].major_name +"</td>";
		newHTML += "<td style='text-align : center;'><button onclick='deleteMajorButton(event)'>X</button></td></tr>";
	}
	var elem = document.getElementById("major_table");
	elem.innerHTML = newHTML;
}

function editMajor(event) {
	var targ = event.target;
	var major_name = targ.innerHTML;
	targ.innerHTML = '<input id="-' + major_name + '" class="form-control" placeholder="Search" type="text" value="' + major_name + '" autofocus>'
	targ.firstChild.focus();
	targ.parentElement.parentElement.setAttribute("current_major", "major_name");
}

function deleteMajorButton(event) {
	var targ = event.target;
	var major_name = targ.parentElement.parentElement.getElementsByTagName("td")[0].innerHTML;

	var payload = {
		"major_name" : major_name
	};
	console.log(payload);

	$.ajax({
		url : url + "api/web/major/delete.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function (response, tStatus, responseCode) {
			getMajors();
		}
	});
}

function deleteMajor() {
	var elem = document.getElementById("major_table");
	var payload = {
		"major_name" : elem.getAttribute("current_major") 
	};
	console.log(payload);

	$.ajax({
		url : url + "api/web/major/delete.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function (response, tStatus, responseCode) {
			getMajors();
		}
	});
}

function submitMajor(event) {
	var targ = event.target;
	targ.parentElement.innerHTML = targ.value;
	var elem = document.getElementById("major_table");
	elem.setAttribute("current_major", targ.value);
}


async function addMajor() {
	var payload = {
		"major_name" : document.getElementById("add_major").value
	}

	await $.ajax({
		url : url + "api/web/major/create.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});
	getMajors();
}
