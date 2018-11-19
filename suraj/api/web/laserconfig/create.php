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

if (!isset($data->material)
	|| !isset($data->tech_id)
	|| !isset($data->thickness)
	|| !isset($data->task)
	|| !isset($data->power)
	|| !isset($data->speed)
	|| !isset($data->ppi)
	|| !isset($data->notes)) {
	http_response_code(400);
	return;
}

$query = "INSERT INTO Laser_Configuration  (material, tech_id, thickness, task, power, speed, ppi, notes) VALUES (:v1,:v2,:v3,:v4,:v5,:v6,:v7,:v8)";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->material,':v2' => $data->tech_id,':v3' => $data->thickness,':v4' => $data->task,':v5' => $data->power,':v6' => $data->speed,':v7' => $data->ppi,':v8' => $data->notes])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

http_response_code(201);

?>
