var url = "http://104.248.113.22/gavin/";

function getcurrentstudents() {
    $.ajax({
        url : url + "api/web/labstatus/read.php",
        type : "POST",
        success : function(response, tStatus, responseCode) {
            printcurrentstudents(response); 
        },
        error : function(response, tStatus, responseCode) {
            return responseCode.status; 
        }
    });
}

function printcurrentstudents(object) {
    console.log(object);
    var stuff = JSON.stringify(object);
    var elements = object.lab_status;
      
    
    var ul = document.getElementById("listy");
  
    while(ul.firstChild) ul.removeChild(ul.firstChild);
  
    for (var idx in elements)
    { 
        var o = elements[idx].first_name ;
    
        var span = document.createElement("SPAN");
        span.className = "close";
        span.innerHTML = "&times;";
    
        var li = document.createElement("LI");
        li.className = "list";
        li.setAttribute("student_id", elements[idx].student_id);
        li.appendChild(document.createTextNode(o));
        li.appendChild(span)
        ul.appendChild(li); 
    } 
    makeclosable();  
}

function makeclosable(){
    var closebtns = document.getElementsByClassName("close");
    var i;

    for (i = 0; i < closebtns.length; i++) {
        closebtns[i].addEventListener("click", function() {
            this.parentElement.style.display = 'none'; 
            var id = this.parentElement.getAttribute("student_id");
            logOutStudent(id);
        });
    }
}

// logs out student with given id
function logOutStudent(id) {
    var payload = {
        "student_id" : id
    };

    $.ajax({
        url : url + "api/web/labstatus/update.php",
        type : "POST",
        data : JSON.stringify(payload),
        success : function(response, tStatus, responseCode) {
            return response;
        }
    });
}