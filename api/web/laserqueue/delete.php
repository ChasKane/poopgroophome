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

if (!isset($data->queue_pos)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM Laser_Queue WHERE queue_pos=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->queue_pos])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT queue_pos,machine_id,student_id,tech_id,date_added,estimated_time,time_added,status FROM Laser_Queue WHERE date_added=CURDATE()";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$laser_queues = array();
$laser_queues["laser_queues"] = array();

if($num > 0) {
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$laser_queue=array(
			"queue_pos" => $queue_pos,
			"machine_id" => $machine_id,
			"student_id" => $student_id,
			"tech_id" => $tech_id,
			"date_added" => $date_added,
			"time_added" => $time_added,
			"estimated_time" => $estimated_time,
			"status" => $status
		);

		array_push($laser_queues["laser_queues"], $laser_queue);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($laser_queues);

?>
