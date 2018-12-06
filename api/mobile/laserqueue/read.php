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

$query = "SELECT SEC_TO_TIME(SUM(SEC_TO_TIME(estimated_time))) AS overall_wait_time FROM Laser_Queue";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$row = $stmt->fetch(PDO::FETCH_ASSOC);
extract($row);

$query = "SELECT queue_pos,machine_id,Student.student_id,tech_id,date_added,estimated_time,time_added,status,first_name,(SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(estimated_time))) AS total_time FROM (Laser_Queue as lq) WHERE lq.queue_pos < Laser_Queue.queue_pos) AS personal_wait_time FROM Laser_Queue JOIN Student ON Laser_Queue.student_id=Student.student_id WHERE date_added=CURDATE()";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$laser_queues = array();
$laser_queues["laser_queues"] = array();
$laser_queues["overall_wait_time"] = $overall_wait_time;

if($num > 0) {
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		if ($total_time == null) {
			$total_time = "00:00:00";
		}

		$laser_queue=array(
			"queue_pos" => $queue_pos,
			"machine_id" => $machine_id,
			"student_id" => $student_id,
			"tech_id" => $tech_id,
			"date_added" => $date_added,
			"time_added" => $time_added,
			"estimated_time" => $estimated_time,
			"personal_wait_time" => $personal_wait_time,
			"status" => $status,
			"first_name" => $first_name
		);

		array_push($laser_queues["laser_queues"], $laser_queue);
	}

	http_response_code(200);
} else {
	http_response_code(404);
}

echo json_encode($laser_queues);

?>
