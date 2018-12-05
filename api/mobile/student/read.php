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

if (!isset($data->school_email)) {
	http_status_code(400);
	return;
}

$query = "SELECT * FROM Student WHERE school_email=:v1";
$stmt = $db->prepare($query);
$success = $stmt->execute([':v1' => $data->school_email]);

if (!$success) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$students = array();

if($num == 0) {
	http_response_code(204);
	return;
}

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$students = array(
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

echo json_encode($students);

?>
