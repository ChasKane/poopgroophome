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

if (!isset($data->config_id)
  || !isset($data->material)
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

$query = "UPDATE Laser_Configuration SET material = :v2, tech_id = :v3, thickness = :v4, task = :v5, power = :v6, speed = :v7, ppi = :v8, notes = :v9 WHERE config_id = :v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->config_id,':v2' => $data->material,':v3' => $data->tech_id,':v4' => $data->thickness,':v5' => $data->task,':v6' => $data->power,':v7' => $data->speed,':v8' => $data->ppi,':v9' => $data->notes])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

http_response_code(201);

?>