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
	|| !isset($data->item_id)) {
	http_response_code(400);
	return;
}

if ($data->sacrificed == 1) {
	$query = "UPDATE Rented_Inventory SET sacrificed=1 WHERE student_id=:v1 AND item_id=:v2";
} else {
	$query = "UPDATE Rented_Inventory SET returned_date=NOW() WHERE student_id=:v1 AND item_id=:v2";
}

$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->student_id,':v2' => $data->item_id])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT item_id,name,sacrificed,loaned_date FROM Rented_Inventory WHERE student_id=:v1 AND returned_date=null";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->student_id])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$rented_inventorys = array();

if($num>0){
	$rented_inventorys["rented_inventory"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$rented_inventory = array(
			'item_id' => $item_id,
			'name' => $name,
			'sacrificed' => $sacrificed,
			'loaned_date' => $loaned_date
		);

		array_push($rented_inventorys["rented_inventory"], $rented_inventory);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($rented_inventorys);

?>
