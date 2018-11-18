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

function showMajors() {
	getMajors().then(function(result) {
		var newInnerHTML = "";
		for (var idx in result.majors) {
			newInnerHTML += "<p>"+result.majors[idx].major_name+"</p>";
		}
		document.getElementById("menu3_text").innerHTML = newInnerHTML;
	});
}

function buildMajorTable(majors) {
	var newHTML = "";
	console.log(majors);
	majors = majors.majors

	for(var idx in majors) {
		newHTML += "<tr><td id='_" + idx + "' ondblclick='editMajor(event)' onfocusout='submitMajor(event)'>" + majors[idx].major_name +"</td></tr>";
	}
	var elem = document.getElementById("major_table");
	elem.innerHTML = newHTML;
}

function editMajor(event) {
	var targ = event.target;
	var major_name = targ.innerHTML;
	targ.innerHTML = '<input id="-' + major_name + '" class="form-control" placeholder="Search" type="text" value=' + major_name + ' autofocus>'
}


function submitMajor(event) {
	var targ = event.target.parentElement;
	console.log(targ)
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
	showMajors();
}
