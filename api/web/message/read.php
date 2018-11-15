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

$query = "SELECT * FROM Message";
$stmt = $db->prepare($query);

if (!$stmt->execute([])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$messages = array();

if($num>0){
	$messages["messages"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$message = array(
			'message_id' => $message_id,
			'message' => $message,
			'body' => $body
		);

		array_push($messages["messages"], $message);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($messages);

?>
