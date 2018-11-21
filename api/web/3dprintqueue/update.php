<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/3dprint_queue.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->queue_pos)
	|| !isset($data->machine_id)
	|| !isset($data->estimated_time)
	|| !isset($data->status)
	|| !isset($data->part_name)
	|| !isset($data->file_path)
	|| !isset($data->material_amt)
	|| !isset($data->soluble_amt)
	|| !isset($data->material_name)
	|| !isset($data->soluble_name)
	|| !isset($data->club_name)) {
	http_response_code(400);
	return;
}

$query = "UPDATE 3DPrint_Queue SET machine_id=:v2,estimated_time=:v7,status=:v8,part_name=:v9,file_path=:v10,material_amt=:v11,soluble_amt=:v12,club_name=:v13 WHERE queue_pos=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->queue_pos,':v2' => $data->machine_id,':v7' => $data->estimated_time,':v8' => $data->status,':v9' => $data->part_name,':v10' => $data->file_path,':v11' => $data->material_amt,':v12' => $data->soluble_amt,':v13' => $data->club_name])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

if ($data->status == "Done") {
	$query = "UPDATE Student SET material_used=material_used+:v1,soluble_used=soluble_used+:v2 WHERE student_id=(SELECT student_id FROM 3DPrint_Queue WHERE queue_pos=:v3)";
	$stmt = $db->prepare($query);
	if (!$stmt->execute([':v1' => $data->material_amt,':v2' => $data->soluble_amt,':v3' => $data->queue_pos])) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}

	$query = "UPDATE 3DMaterial_Graph SET current_amount=current_amount-:v1 WHERE material_name=:v2";
	$stmt = $db->prepare($query);
	if (!$stmt->execute([':v1' => $data->material_amt, ':v2' => $data->material_name])) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}

	if (!$stmt->execute([':v1' => $data->soluble_amt, ':v2' => $data->soluble_name])) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}
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
