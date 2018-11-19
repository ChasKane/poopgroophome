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



$query = "SELECT * FROM Laser_Appointment";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$laser_appointments = array();

if($num>0){
	$laser_appointments["laser_appointments"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$laser_appointment = array(
			'student_id' => $student_id,
			'tech_id' => $tech_id,
			'date_selected' => $date_selected,
			'start_time' => $start_time,
			'end_time' => $end_time
		);

		array_push($laser_appointments["laser_appointments"], $laser_appointment);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($laser_appointments);

?>
