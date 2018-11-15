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

if (!isset($data->sunday_start)
	|| !isset($data->sunday_end)
	|| !isset($data->monday_start)
	|| !isset($data->monday_end)
	|| !isset($data->tuesday_start)
	|| !isset($data->tuesday_end)
	|| !isset($data->wednesday_start)
	|| !isset($data->wednesday_end)
	|| !isset($data->thursday_start)
	|| !isset($data->thursday_end)
	|| !isset($data->friday_start)
	|| !isset($data->friday_end)
	|| !isset($data->saturday_start)
	|| !isset($data->saturday_end)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM Appointment_Hours";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "INSERT INTO Appointment_Hours VALUES (:v1,:v2,:v3,:v4,:v5,:v6,:v7,:v8,:v9,:v10,:v11,:v12,:v13,:v14)";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->sunday_start,':v2' => $data->sunday_end,':v3' => $data->monday_start,':v4' => $data->monday_end,':v5' => $data->tuesday_start,':v6' => $data->tuesday_end,':v7' => $data->wednesday_start,':v8' => $data->wednesday_end,':v9' => $data->thursday_start,':v10' => $data->thursday_end,':v11' => $data->friday_start,':v12' => $data->friday_end,':v13' => $data->saturday_start,':v14' => $data->saturday_end])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

http_response_code(201);

?>
