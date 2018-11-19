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

$query = "SELECT * FROM Machine";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$machines = array();
$machines["machines"] = array();

if($num > 0) {
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$machine=array(
			"machine_id" => $machine_id,
			"name" => $name,
			"type" => $type,
			"restrictions" => $restrictions,
			"date_added" => $date_added,
			"status" => $status
		);

		array_push($machines["machines"], $machine);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($machines);

?>
