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

if (!isset($data->student_id)
	|| !isset($data->first_name)
	|| !isset($data->last_name)
	|| !isset($data->major_name)
	|| !isset($data->school_email)
	|| !isset($data->material_used)
	|| !isset($data->soluble_used)) {
	http_response_code(400);
	return;
}

$query = "UPDATE Student SET first_name=:v2,last_name=:v3,major_name=:v4,school_email=:v5,material_used=:v6,soluble_used=:v7 WHERE student_id=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->student_id,':v2' => $data->first_name,':v3' => $data->last_name,':v4' => $data->major_name,':v5' => $data->school_email,':v6' => $data->material_used, ':v7' => $data->soluble_used])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT first_name,last_name,major_name,school_email,material_used FROM Student";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->student_id])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$students = array();
$students["students"] = array();

if($num > 0) {
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$student=array(
			"student_id" => $student_id,
			"first_name" => $first_name,
			"last_name" => $last_name,
			"major_name" => $major_name,
			"school_email" => $school_email,
			"material_used" => $material_used,
			"soluble_used" => $soluble_used
		);

		array_push($students["students"], $student);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($students);
?>
