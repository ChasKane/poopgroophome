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
	|| !isset($data->message_id)
	|| !isset($data->time_sent)
	|| !isset($data->seen)) {
	http_response_code(400);
	return;
}

$query = "INSERT INTO Notification VALUES (:v1,:v2,:v3,:v4)";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->student_id,':v2' => $data->message_id,':v3' => $data->time_sent,':v4' => $data->seen])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

http_response_code(201);

?>
