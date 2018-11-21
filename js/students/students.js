// for students page

 

function getStyle(id, name) {
    var element = document.getElementById(id);
    return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
}

//-------------------------------------
// gweneral functions
//-------------------------------------
function swapDisplay(div_name) {
	// given an id it will switch the display style from block to none or the reverse
	var x = document.getElementById(div_name);
	// attribute i set to keep track of the value of style.display
	var display = x.getAttribute("vis");
    if (display == "" || display == "none") {
    	x.setAttribute("vis", "block")
        x.style.display = "block";
    } else {
        x.style.display = "none";
        x.setAttribute("vis", "none")
    }
}

function checkSwap(id, display_id) {
	// given an id and another id that should be visible, if they are the same make sure to show
	// display_id with swap
	// otherwise make sure other id's style.display = "none"
	var elem = document.getElementById(id);
	if(id == display_id && elem.getAttribute("vis") == "none") {
		swapDisplay(id);
	} else if(id != display_id && elem.getAttribute("vis") == "block") {
		swapDisplay(id);
	}
}

// fairly specific function
// turns visibility off on all elements on student page other than id passed in
function swapStudentsHTML(id) {
	checkSwap("student_profile", id);
	checkSwap("main_student", id);
	checkSwap("all_students", id);
}

function focusOn(element_Id) {
    var element = document.getElementById(element_Id);
    // we need to wait for the element to finish loading onto the page
    // should be fairly consistent but we should test this to be sure
    window.setTimeout(function () {
        element.focus();
    }, 350);
}

// gets majors and loads them onto html of element id passed in
function getMajors(id) {
	$.ajax({
		url : url + "api/web/major/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			loadMajors(response, id)
		}
	});
	return retval;
}

function loadMajors(majors, id) {
	majors = majors.majors;
	var element = document.getElementById(id);
	var newHTML = "";

	for(var idx in majors) {
		if(majors[idx].major_name == result.major_name) {
			newHTML += "<option selected value='" + majors[idx].major_name + "'>" + majors[idx].major_name + "</option>";
		} else {
			newHTML += "<option value='" + majors[idx].major_name + "'>" + majors[idx].major_name + "</option>";
		}
	}
	element.innerHTML = newHTML;
}


//-------------------------------------
// student functions
//-------------------------------------
// returns json of all students in db
async function getAllStudents() {
	var retval = await $.ajax({
		url : url + "api/web/student/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});
	return retval;
}

// loads students into table on the page
async function loadAllStudents() {
	var students = await getAllStudents();
	var newHTML = "";
	students = students.students;

	// for each student add a table row and 4 columns for each piece of information
	for(var idx in students) {
		newHTML += "<tr id='row" + idx + "' ondblclick='loadStudentProfile(event)'>";
		newHTML += "<td ondbclick='loadStudentProfile(event)'>" + students[idx].first_name + "</td>";
		newHTML += "<td>" + students[idx].last_name + "</td>";
		newHTML += "<td>" + students[idx].school_email + "</td>";
		newHTML += "<td>" + students[idx].major_name + "</td>";
		newHTML += "</tr>"
	}
	var element = document.getElementById("all_students_body");
	// store the newly made html in the actuaal element on the page
	element.innerHTML = newHTML;
	swapStudentsHTML("all_students");
}

async function getStudent(input) {
	payload = {
		"query_field" : input
	}

	var retval = await $.ajax({
		url : url + "api/web/student/read.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});
	return retval;
}


function loadAddStudent() {
	getMajors("add_major_profile");
}

// loads a students information from db onto the page to be edited/viewed
async function loadStudentProfile(event) {
	var student;
	// if there was no event then assume info wll be on mains students page
	// otherwise info will be a row in all students table
	if(event == undefined) {
		student = document.getElementById("userCard_ID");
		student = student.value;
	} else {
		var targ = event.target;
		student = targ.parentElement.getElementsByTagName("td");
		student = student[0].textContent;
	}
	
	// fill in student info
	result = await getStudent(student);
	result = result.students[0];
	var elem = document.getElementById("fname");
	elem.value = result.first_name; 
	elem = document.getElementById("lname");
	elem.value = result.last_name;
	elem = document.getElementById("email");
	elem.value = result.school_email;
	elem = document.getElementById("student_profile");
	elem.setAttribute("student_id", result.student_id);

	// fill in majors dropdown
	getMajors("major_profile");

	// fill in materials used
	elem = document.getElementById("material_used");
	elem.innerHTML = ": " +result.material_used;
	elem.setAttribute("value", result.material_used);
	elem = document.getElementById("soluble_used");
	elem.setAttribute("value", result.soluble_used);
	elem.innerHTML = ": " + result.soluble_used;

	// fill in groups
	var clubs = await getGroups(result.student_id);
	elem = document.getElementById("groups");
	newHTML = "";
	console.log(result)
	if(result == undefined) {
		elem.innerHTML = "Oh no you arent in any clubs!";
	} else {
		for(var x in result.clubs) {
			newHTML += "<p club='" + result.clubs[x].club_name + "'>" + result.clubs[x].club_name;
			newHTML += "<button onclick='removefromClubButton(event)'>X</button></p> ";
		}
		elem.innerHTML = newHTML;
	}

	// show student profile
	swapStudentsHTML("student_profile");
}

// add student to db from modal form
function addStudent(event) {
	var fname = document.getElementById("add_fname");
	var lname = document.getElementById("add_lname");
	var email = document.getElementById("add_email");
	var student_id = document.getElementById("add_student_id");
	var major = document.getElementById("add_major_profile");

	console.log(student_id.value);
	var payload = {
		"student_id" : student_id.value,
		"first_name" : fname.value,
		"last_name" : lname.value,
		"major_name" : major.value,
		"school_email" : email.value
	};

	$.ajax({
		url : url + "api/web/student/create.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
			$('#addStudentModal').modal('hide');
		},
		error : function (response, tStatus, responseCode) {
			var element = document.getElementById("addStudentHeader");
			element.innerHTML = "TEST: This student already exists"
		}
	});
}

// collects updated information and sends it to the db
async function updateStudent() {
	var fname = document.getElementById("fname").value;
	var lname = document.getElementById("lname").value;
	var email = document.getElementById("email").value;
	var major = document.getElementById("major_profile");
	var mat_used = document.getElementById("material_used");
	var sol_used = document.getElementById("soluble_used");
	var student_id = document.getElementById("student_profile");
	student_id = student_id.getAttribute("stu_id");

	major = major.options[major.selectedIndex].value;
	mat_used = mat_used.getAttribute("value");
	sol_used = sol_used.getAttribute("value");

	var payload = { 
		"query_field" : student_id
	};

	var student = await $.ajax({
		url : url + "api/web/student/read.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});

	student = student.students[0].student_id;
	payload = {
		"student_id" : student,
		"first_name" : fname,
		"last_name" : lname,
		"major_name" : major,
		"school_email" : email,
		"material_used" : mat_used,
		"soluble_used" : sol_used
	};

	$.ajax({
		url : url + "api/web/student/update.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			retval = response;
		}
	});
}

function gotoLaserQueue() {
	var student_id = document.getElementById("student_profile");
	student_id = student_id.getAttribute("student_id");
	document.location.href = "http://104.248.113.22/html/lab/Laser_Cutter.html#student_id=" + student_id;
}


//-----------------------------------------
$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];
        href = this.getAttribute('href');        
        if(href == "#home") {
            swapStudentsHTML("main_student");
        } 
    });
});
