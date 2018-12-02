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

$query = "SELECT student_id,first_name,last_name,major_name,school_email,material_used,soluble_used FROM Student";
$stmt = null;
$success = true;


if (isset($data->query_field)) {
	$boom = explode(" ", $data->query_field);

	if (count($boom) == 2) {
		$query = $query . " WHERE first_name=:v1 AND last_name=:v2";
		$stmt = $db->prepare($query);
		$success = $stmt->execute([':v1' => $boom[0], ':v2' => $boom[1]]);
	} else {
		$data->query_field = '%' . $data->query_field . '%';
		$query = $query . " WHERE student_pid=:v1 OR student_id=:v1 OR first_name=:v1 OR last_name=:v1";
		$stmt = $db->prepare($query);
		$success = $stmt->execute([':v1' => $data->query_field]);
	}
} else {
	$stmt = $db->prepare($query);
	$success = $stmt->execute();
}

if (!$success) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

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
