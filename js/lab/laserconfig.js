
function getLaserConfigs() {
	$.ajax({
		url : url + "api/web/laserconfig/read.php",
		type : "POST",
		success : function(response, tStatus, responseCode) {
			fillLaserConfig(response);
		}
	});
}

// $laser_configuration = array(
//       'config_id' => $config_id,
// 			'material' => $material,
// 			'tech_id' => $tech_id,
// 			'thickness' => $thickness,
// 			'task' => $task,
// 			'power' => $power,
// 			'speed' => $speed,
// 			'ppi' => $ppi,
// 			'notes' => $notes
// 		);

function fillLaserConfig(configs) {
	configs = configs.laser_configurations;
	var newHTML = "";

	for(var idx in configs) {
		newHTML += "<tr><td>" + configs[idx].material + "</td>";
		newHTML += "<td>" + configs[idx].task + "</td>";
		newHTML += "<td>" + configs[idx].thickness + "</td>";
		newHTML += "<td>" + configs[idx].power + "</td>";
		newHTML += "<td>" + configs[idx].speed + "</td>";
		newHTML += "<td>" + configs[idx].ppi + "</td>";
		newHTML += "<td>" + configs[idx].notes + "</td>";
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

function addConfig() {
	return;
}

$(document).ready(function() {
    $('.nav-tabs a').on('show.bs.tab', function(e){
        activeTab = $(this).attr('href').split('-')[1];
        href = this.getAttribute('href');        
        if(href == "#menu2") {
        	getLaserConfigs();
        }
    });
});