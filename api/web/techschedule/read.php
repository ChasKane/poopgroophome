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



$query = "SELECT * FROM Tech_Schedule";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$tech_schedules = array();

if($num>0){
	$tech_schedules["tech_schedules"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$tech_schedule = array(
			'tech_id' => $tech_id,
			'day' => $day,
			'time_in' => $time_in,
			'time_out' => $time_out
		);

		array_push($tech_schedules["tech_schedules"], $tech_schedule);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($tech_schedules);

?>
