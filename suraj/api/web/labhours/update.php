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

if (!isset($data->sunday_open)
	|| !isset($data->sunday_close)
	|| !isset($data->monday_open)
	|| !isset($data->monday_close)
	|| !isset($data->tuesday_open)
	|| !isset($data->tuesday_close)
	|| !isset($data->wednesday_open)
	|| !isset($data->wednesday_close)
	|| !isset($data->thursday_open)
	|| !isset($data->thursday_close)
	|| !isset($data->friday_open)
	|| !isset($data->friday_close)
	|| !isset($data->saturday_open)
	|| !isset($data->saturday_close)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM Lab_Hours";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "INSERT INTO Lab_Hours VALUES (:v1,:v2,:v3,:v4,:v5,:v6,:v7,:v8,:v9,:v10,:v11,:v12,:v13,:v14)";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->sunday_open,':v2' => $data->sunday_close,':v3' => $data->monday_open,':v4' => $data->monday_close,':v5' => $data->tuesday_open,':v6' => $data->tuesday_close,':v7' => $data->wednesday_open,':v8' => $data->wednesday_close,':v9' => $data->thursday_open,':v10' => $data->thursday_close,':v11' => $data->friday_open,':v12' => $data->friday_close,':v13' => $data->saturday_open,':v14' => $data->saturday_close])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

http_response_code(201);

?>
