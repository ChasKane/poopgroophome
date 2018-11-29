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

if (!isset($data->material_name)
	|| !isset($data->initial_amount)
	|| !isset($data->date_purchased)
	|| !isset($data->num_semesters)) {
	http_response_code(400);
	return;
}

$query = "INSERT INTO 3DMaterial VALUES (:v1,:v2,:v3,:v4)";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->material_name,':v2' => $data->initial_amount,':v3' => $data->date_purchased,':v4' => $data->num_semesters])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT material_name FROM 3DMaterial";
$stmt = $db->prepare($query);

if (!$stmt->execute()) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$num = $stmt->rowCount();

$threedmaterials = array();

if($num>0){
	$threedmaterials["threedmaterials"] = array();

	while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
		extract($row);

		$threedmaterial = array(
			'material_name' => $material_name,
		);

		array_push($threedmaterials["threedmaterials"], $threedmaterial);
	}

	http_response_code(200);
} else {
	http_response_code(204);
}

echo json_encode($threedmaterials);

?>
