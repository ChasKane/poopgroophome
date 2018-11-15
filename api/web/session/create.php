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

if (!isset($data->tech_id)
	|| !isset($data->last_updated)) {
	http_response_code(400);
	return;
}

$query = "INSERT INTO Session VALUES (:v1,:v2)";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->tech_id,':v2' => $data->last_updated])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

http_response_code(201);

?>
