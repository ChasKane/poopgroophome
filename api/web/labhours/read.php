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

$query = "SELECT * FROM Lab_Hours";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$lab_hourss = array();

if($num>0){
	$lab_hourss["lab_hourss"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$lab_hours = array(
			'sunday_open' => $sunday_open,
			'sunday_close' => $sunday_close,
			'monday_open' => $monday_open,
			'monday_close' => $monday_close,
			'tuesday_open' => $tuesday_open,
			'tuesday_close' => $tuesday_close,
			'wednesday_open' => $wednesday_open,
			'wednesday_close' => $wednesday_close,
			'thursday_open' => $thursday_open,
			'thursday_close' => $thursday_close,
			'friday_open' => $friday_open,
			'friday_close' => $friday_close,
			'saturday_open' => $saturday_open,
			'saturday_close' => $saturday_close
		);

		array_push($lab_hourss["lab_hourss"], $lab_hours);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($lab_hourss);

?>
