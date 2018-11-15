async function getMajors() {
	var retval = await $.ajax({
		url : url + "api/web/major/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			retval = response;
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
