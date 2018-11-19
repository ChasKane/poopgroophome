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



$query = "SELECT name FROM Lab_Tech WHERE tech_id=(SELECT tech_id FROM Session)";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$sessions = array();

if($num>0){
	$sessions["sessions"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$session = array(
			'name' => $name
		);

		array_push($sessions["sessions"], $session);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($sessions);

?>
