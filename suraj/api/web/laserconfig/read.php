<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));



$query = "SELECT * FROM Laser_Configuration";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$laser_configurations = array();

if($num>0){
	$laser_configurations["laser_configurations"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$laser_configuration = array(
      'config_id' => $config_id,
			'material' => $material,
			'tech_id' => $tech_id,
			'thickness' => $thickness,
			'task' => $task,
			'power' => $power,
			'speed' => $speed,
			'ppi' => $ppi,
			'notes' => $notes
		);

		array_push($laser_configurations["laser_configurations"], $laser_configuration);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($laser_configurations);

?>
