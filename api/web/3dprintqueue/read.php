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

if (isset($data->queue_pos)) {
	$query = "SELECT * FROM 3DPrint_Queue WHERE queue_pos=:v1";
	$stmt = $db->prepare($query);

	if (!$stmt->execute([':v1' => $data->queue_pos])) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}

	$num = $stmt->rowCount();

	if ($num == 0) {
		http_response_code(204);
		return;
	}

	$row = $stmt->fetch(PDO::FETCH_ASSOC);
	extract($row);

	$threedprint_queue = array(
		'queue_pos' => $queue_pos,
		'machine_id' => $machine_id,
		'student_id' => $student_id,
		'tech_id' => $tech_id,
		'date_added' => $date_added,
		'time_added' => $time_added,
		'estimated_time' => $estimated_time,
		'status' => $status,
		'part_name' => $part_name,
		'file_path' => $file_path,
		'material_amt' => $material_amt,
		'soluble_amt' => $soluble_amt,
		'material_name' => $material_name,
		'soluble_name' => $soluble_name,
		'club_name' => $club_name
	);

	echo json_encode($threedprint_queue);
	return;
}

$query = "SELECT queue_pos,machine_id,student_id,tech_id,estimated_time,status,part_name,club_name FROM 3DPrint_Queue";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$threedprint_queues = array();

if($num>0){
	$threedprint_queues["threedprintqueues"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$threedprint_queue = array(
			'queue_pos' => $queue_pos,
			'machine_id' => $machine_id,
			'student_id' => $student_id,
			'tech_id' => $tech_id,
			'estimated_time' => $estimated_time,
			'status' => $status,
			'part_name' => $part_name,
			'club_name' => $club_name
		);

		array_push($threedprint_queues["threedprintqueues"], $threedprint_queue);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($threedprint_queues);

?>
