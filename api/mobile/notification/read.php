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
	http_response_code(400);
	return;
}

$query = "SELECT * FROM Message WHERE message_id IN (SELECT message_id FROM Notification WHERE seen=false AND student_id=(SELECT student_id FROM Student WHERE school_email=:v1))";
// $query = "SELECT * FROM Message JOIN Notification ON Message.message_id=Notification.message_id WHERE seen=false AND student_id=(SELECT student_id FROM Student WHERE school_email"
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->school_email])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();
$notifications = array();

if($num>0){
	$notifications["notifications"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$notification = array(
			'title' => $title,
			'body' => $body,
			'time_sent' => $time_sent
		);

		array_push($notifications["notifications"], $notification);
	}

	http_response_code(200);
} else {
	http_response_code(404);
}

echo json_encode($notifications);

?>
