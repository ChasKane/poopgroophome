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

if (!isset($data->machine_id)
	|| !isset($data->student_id)
	|| !isset($data->tech_id)
	|| !isset($data->date_added)
	|| !isset($data->time_added)
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

$query = "INSERT INTO 3DPrint_Queue VALUES (null,:v2,:v3,:v4,CURDATE(),CURTIME(),:v7,'Waiting',:v9,:v10,:v11,:v12,:v13,:v14,:v15)";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v2' => $data->machine_id,':v3' => $data->student_id,':v4' => $data->tech_id,':v7' => $data->estimated_time,':v9' => $data->part_name,':v10' => $data->file_path,':v11' => $data->material_amt,':v12' => $data->soluble_amt,':v13' => $data->material_name, ':v14' => $data->soluble_name, ':v15' => $data->club_name])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
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
