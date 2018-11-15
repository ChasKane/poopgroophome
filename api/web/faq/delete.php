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

if (!isset($data->question_id)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM FAQ WHERE question_id=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->question_id])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT * FROM FAQ";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$faqs = array();
$faqs["faqs"] = array();

if($num > 0) {
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$faq=array(
			"question_id" => $question_id,
			"question" => $question,
			"answer" => $answer,
			"date_asked" => $date_asked
		);

		array_push($faqs["faqs"], $faq);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($faqs);

?>
