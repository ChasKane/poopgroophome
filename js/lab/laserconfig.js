
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
	var newhtml = "";

	for(var idx in configs) {
		newhtml += "<tr><td>" + configs[idx].material + "</td>";
		newhtml += "<td>" + configs[idx].thickness + "</td>";
		newhtml += "<td>" + configs[idx].power + "</td>";
		newhtml += "<td>" + configs[idx].speed + "</td>";
		newhtml += "<td>" + configs[idx].ppi + "</td>";
		newhtml += "<td>" + configs[idx].notes + "</td>";
		newhtml += "</tr>";
	}
	var elem = document.getElementById("configBody");
	elem.innerHTML = elem;
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