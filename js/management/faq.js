//meep, I aere FAQ scripts
var url = "http://104.248.113.22/";

function getFAQList() {
	$.ajax({
		url : url + "api/web/faq/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			console.log(response);
            fillFAQList(response);
		},
		error : function() {
			console.log("there be an error");
		}
	});
}

function fillFAQList(object) {
    if(object == undefined) {
		return;
	}
	console.log("FAQ list: ")
	console.log(object)
	var elements = object.faqs;


	var newInnerHTML = "";
    var i = 0;
	
	for (var idx in elements) {
        console.log("meep?")
        

		newInnerHTML += '<a id="faq'+ (i++) + '" class="list-group-item">';
		newInnerHTML += '<h4 class="list-group-item-heading">'+elements[idx].question+'<button type="button" class="btn btn-default btn-xs" onclick="editFAQ('+elements[idx].question_id+');"><span class="glyphicon glyphicon-pencil"></span></button></h4>'+
        '<p class="list-group-item-text">'+elements[idx].answer+'</p>';

		newInnerHTML += "</a>";
	}
	console.log(newInnerHTML);
    document.getElementById("FAQ_listy").innerHTML = newInnerHTML; 
}

function addFAQ() {
	checkSwap("FAQ_add_form", "FAQ_add_form");
	checkSwap("FAQ_list", "FAQ_add_form");
}

function addFAQCancelButton() {
    checkSwap("FAQ_list", "FAQ_list");
	checkSwap("FAQ_add_form", "FAQ_list");
}

async function addToFAQButton() {
	var question = document.getElementById("add_question").value;
	var answer = document.getElementById("add_answer").value;

	var payload = {
		"question" : question,
		"answer" : answer
	};

	var retval = await addFAQToList(payload);
	checkSwap("FAQ_list", "FAQ_list");
	checkSwap("FAQ_add_form", "FAQ_list");
    fillFAQList(retval);
}

async function addFAQToList(payload) {
    console.log(payload);
	var retval = await $.ajax({
		url : url + "api/web/faq/create.php",
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

function editFAQ(faq_id) {
    document.getElementById("FAQ_edit_form").setAttribute("lookup", faq_id);
    editFAQGetFiller(faq_id);
    checkSwap("FAQ_edit_form", "FAQ_edit_form");
	checkSwap("FAQ_list", "FAQ_edit_form");
}

function editFAQGetFiller(question_id) {
    $.ajax({
		url : url + "api/web/faq/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
            console.log(response);
			editFAQFillHolder(question_id, response);
		},
		error : function() {
			console.log("there be an error");
		}
    });
}

function editFAQFillHolder(question_id, obj) {
    console.log(obj);
    var faqs = obj.faqs;

    for (var idx in faqs)
    {
        if (faqs[idx].question_id == question_id)
        {
            console.log("setting att.");
            document.getElementById("edit_question").setAttribute("placeholder", faqs[idx].question);
            document.getElementById("edit_answer").setAttribute("placeholder", faqs[idx].answer);
        }
    }
}

function editFAQCancelButton() {
    checkSwap("FAQ_list", "FAQ_list");
	checkSwap("FAQ_edit_form", "FAQ_list");
}

async function editFAQButton() {
	var question = document.getElementById("edit_question").value;
    var answer = document.getElementById("edit_answer").value;
    var question_id = document.getElementById("FAQ_edit_form").getAttribute("lookup");
    
    if (question == undefined || answer == undefined ||question == "" || answer == "")
    {
        alert("One or more fields unfilled.")
        return;
    }

    $.ajax({
		url : url + "api/web/faq/read.php",
		type : "POST",
		success : async function(response, tStatus, responseCode) {
            console.log(response);
            faqs = response.faqs;
			for (var idx in faqs)
            {
                console.log(faqs[idx].question_id, question_id);
                if (faqs[idx].question_id == question_id)
                {
                    var payload = {
                        "question_id" : question_id,
                        "question" : question,
                        "answer" : answer
                    };
                
                    console.log("here i am");
                    var retval = await editFAQDataSend(payload);
                    checkSwap("FAQ_list", "FAQ_list");
                    checkSwap("FAQ_edit_form", "FAQ_list");
                    fillFAQList(retval);
                }
            }
		},
		error : function() {
			console.log("there be an error");
		}
    });
}

async function editFAQDataSend(payload) {
	console.log(payload);
	var retval = await $.ajax({
		url : url + "api/web/faq/update.php",
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

async function editFAQDeleteButton() {
    var question_id = document.getElementById("FAQ_edit_form").getAttribute("lookup");
    var name = document.getElementById("edit_question").getAttribute("placeholder");

    if(confirm('Delete "'+ name +'" question?')) {
        var payload = {
            "question_id" : question_id
        };

        var retval = await deleteFAQFromList(payload);
        checkSwap("FAQ_list", "FAQ_list");
        checkSwap("FAQ_edit_form", "FAQ_list");
        fillFAQList(retval);
    } else {
        console.log("Failed to delete.");
    }
}

async function deleteFAQFromList(payload) {
	console.log(payload);
	var retval = await $.ajax({
		url : url + "api/web/faq/delete.php",
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

