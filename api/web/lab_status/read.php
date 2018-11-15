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



$query = "SELECT * FROM Lab_Status";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$lab_statuss = array();

if($num>0){
	$lab_statuss["lab_statuss"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$lab_status = array(
			'student_id' => $student_id,
			'date_selected' => $date_selected,
			'time_in' => $time_in,
			'time_out' => $time_out
		);

		array_push($lab_statuss["lab_statuss"], $lab_status);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($lab_statuss);

?>
