<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../config/curl.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->school_email)
	|| !isset($data->app_token)) {
	http_response_code(400);
	return;
}

$query = "UPDATE Student SET app_token=:v2 WHERE school_email=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->school_email,':v2' => $data->app_token])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$curl = new CURL();
$response = $curl->pushNotification($data->app_token, "TEST_TITLE", "TEST_BODY");

http_response_code(200);
echo json_encode($response);

?>
