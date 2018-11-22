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
	return retval;
	//retval = retval.then(result => result.data);
}

function buildMajorTable(majors) {
	var newHTML = "";
	console.log(majors);
	majors = majors.majors

	for(var idx in majors) {
		newHTML += "<tr><td style='display: inline' id='_" + idx + "' ondblclick='editMajor(event);' onfocusout='submitMajor(event)'>" + majors[idx].major_name +"</td><button>delete</button></tr>";
	}
	var elem = document.getElementById("major_table");
	elem.innerHTML = newHTML;
}

function editMajor(event) {
	var targ = event.target;
	var major_name = targ.innerHTML;
	targ.innerHTML = '<input id="-' + major_name + '" class="form-control" placeholder="Search" type="text" value="' + major_name + '" autofocus>'
	targ.firstChild.focus();
}


function submitMajor(event) {
	var targ = event.target;
	targ.parentElement.innerHTML = targ.value;
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
