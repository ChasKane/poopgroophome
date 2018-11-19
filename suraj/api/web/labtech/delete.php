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

if (!isset($data->tech_id)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM Lab_Tech WHERE tech_id=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->tech_id])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT * FROM Lab_Tech";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$lab_techs = array();

if($num>0){
	$lab_techs["lab_techs"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$lab_tech = array(
			'tech_id' => $tech_id,
			'name' => $name,
			'info' => $info
		);

		array_push($lab_techs["lab_techs"], $lab_tech);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($lab_techs);

?>
