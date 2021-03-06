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

if (!isset($data->queue_pos) || !isset($data->status)) {
	http_response_code(400);
	return;
}

$query = "UPDATE Laser_Queue SET status=:v2 WHERE queue_pos=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->queue_pos,':v2' => $data->status])) {
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

if($num == 0) {
	http_response_code(204);
	return;
}

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

if ($data->status == "Cutting") {
	$query = "SELECT app_token FROM Student WHERE student_id=(SELECT student_id FROM Laser_Queue WHERE date_added=CURDATE() AND queue_pos=(SELECT MIN(queue_pos) FROM Laser_Queue WHERE date_added=CURDATE() AND queue_pos > :v1))";
	$stmt = $db->prepare($query);

	if (!$stmt->execute([':v1' => $data->queue_pos])) {
		echo json_encode($stmt->errorInfo());
		http_response_code(503);
	}

	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	extract($row);

	$query = "SELECT student_id FROM Laser_Queue WHERE date_added=CURDATE() AND queue_pos=(SELECT MIN(queue_pos) FROM Laser_Queue WHERE date_added=CURDATE() AND queue_pos > :v1)";
	$stmt = $db->prepare($query);
	if (!$stmt->execute([':v1' => $data->queue_pos])) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}

	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	extract($row);

	$query = "INSERT INTO Notification VALUES (:v1, 1, NOW(), false)";
	$stmt = $db->prepare($query);
	if (!$stmt->execute([':v1' => $student_id])) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}

	if (empty($app_token)) {
		return;
	}

	$query = "SELECT title,body FROM Message WHERE message_id=1";
	$stmt = $db->prepare($query);
	if (!$stmt->execute()) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}

	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	extract($row);

	$curl = new CURL();
	$response = $curl->pushNotification($app_token, $title, $body);
}

// echo json_encode($laser_queues);

?>
