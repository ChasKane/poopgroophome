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

if (!isset($data->student_id)
	|| !isset($data->tech_id)
	|| !isset($data->date_selected)
	|| !isset($data->start_time)
	|| !isset($data->end_time)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM Laser_Appointment WHERE date_selected=:v3";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v3' => $data->date_selected])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

http_response_code(201);

?>
