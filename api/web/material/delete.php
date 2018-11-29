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

if (!isset($data->material_name)) {
	http_response_code(400);
	return;
}

$query = "DELETE FROM 3DMaterial_Graph WHERE material_name=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->material_name])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "DELETE FROM 3DMaterial WHERE material_name=:v1";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->material_name])) {
	http_response_code(503);
	echo json_encode($stmt->errorInfo());
	return;
}

$query = "SELECT material_name FROM 3DMaterial";
$stmt = $db->prepare($query);

if (!$stmt->execute([':v1' => $data->material_name])) {
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
	return;
}

echo json_encode($threedmaterials);

?>
