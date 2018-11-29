
function getLaserConfigs() {
	$.ajax({
		url : url + "api/web/laserconfig/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			fillLaserConfig(response);
		}
	});
}

function fillLaserConfig(configs) {
	configs = configs.laser_configurations;
	var newHTML = "";

	for(var idx in configs) {
		newHTML += "<tr config_id='" + configs[idx].config_id + "'><td>" + configs[idx].material + "</td>";
		newHTML += "<td>" + configs[idx].task + "</td>";
		newHTML += "<td>" + configs[idx].thickness + "</td>";
		newHTML += "<td>" + configs[idx].power + "</td>";
		newHTML += "<td>" + configs[idx].speed + "</td>";
		newHTML += "<td>" + configs[idx].ppi + "</td>";
		newHTML += "<td>" + configs[idx].notes + "</td>";
		newHTML += "<td><button onclick='deleteConfig(event);'>X</button></td>";
		newHTML += "</tr>";
	}
	var elem = document.getElementById("configBody");
	elem.innerHTML = newHTML;
}

function configSwap(id) {
	if(id == "config_table") {
		checkSwap("config_table", "config_table");
		checkSwap("add_config", "config_table");
	} else if(id == "add_config"){
		checkSwap("config_table", "add_config");
		checkSwap("add_config", "add_config");
	}
}

function deleteConfig(event) {
	var targ = event.target;
	targ = targ.parentElement;
	var config_id = targ.getAttribute("config_id");

	var payload = {
		"config_id" : config_id
	};

	$.ajax({
		url : url + "api/web/laserconfig/delete.php",
		type : "POST",
		data : JSON.stringify(payload);
		success : function(response, tStatus, responseCode) {
			console.log("success");
		}
	})
}

function addConfig() {
	var material = document.getElementById("material").value;
	var task = document.getElementById("task").value;
	var thickness = document.getElementById("thickness").value;
	var power = document.getElementById("power").value;
	var speed = document.getElementById("speed").value;
	var ppi = document.getElementById("ppi").value;
	var notes = document.getElementById("notes").value;

	var payload = {
		"material" : material,
		"task" : task,
		"thickness" : thickness,
		"power" : power,
		"speed" : speed,
		"ppi" : ppi,
		"notes" : notes,
		"tech_id" : 1
	};

	$.ajax({
		url : url + "api/web/laserconfig/create.php",
		type : "POST",
		data : JSON.stringify(payload),
		success : function(response, tStatus, responseCode) {
			return;
		}
	});
	checkSwap("config_table", "config_table");
	checkSwap("add_config", "config_table");
	getLaserConfigs();
}

$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];
        href = this.getAttribute('href');        
        if(href == "#menu2") {
        	getLaserConfigs();
        	checkSwap("config_table", "config_table");
			checkSwap("add_config", "config_table");
        }
    });
});