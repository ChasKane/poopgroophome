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

if (!isset($data->club_name)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM Club WHERE club_name=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->club_name])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT * FROM Club";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$clubs = array();
$clubs["clubs"] = array();

if($num > 0) {
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$club=array(
			"club_name" => $club_name
		);

		array_push($clubs["clubs"], $club);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($clubs);

?>
