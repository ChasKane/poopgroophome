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

if (!isset($data->item_id)
	|| !isset($data->name)
	|| !isset($data->description)
	|| !isset($data->stocked)
	|| !isset($data->rentable)
	|| !isset($data->ti)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM Lab_Inventory WHERE item_id=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->item_id])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT * FROM Lab_Inventory";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$lab_inventorys = array();
$lab_inventorys["inventory"] = array();

if($num > 0) {
	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$lab_inventory=array(
			"item_id" => $item_id,
			"name" => $name,
			"description" => $description,
			"stocked" => $stocked,
			"rentable" => $rentable,
			"ti" => $ti
		);

		array_push($lab_inventorys["inventory"], $lab_inventory);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($lab_inventorys);

?>
