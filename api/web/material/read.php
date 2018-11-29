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

$threedmaterials = array();

if (isset($data->material_name)) {
	$query = "SELECT * FROM 3DMaterial WHERE material_name=:v1";
	$stmt = $db->prepare($query);

	if (!$stmt->execute([':v1' => $data->material_name])) {
		http_response_code(503);
	echo json_encode($stmt->errorInfo());
		return;
	}

	$num = $stmt->rowCount();

	if($num>0){
		$threedmaterials["threedmaterials"] = array();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$threedmaterial = array(
				'material_name' => $material_name,
				'initial_amount' => $initial_amount,
				'date_purchased' => $date_purchased,
				'num_semesters' => $num_semesters
			);

			array_push($threedmaterials["threedmaterials"], $threedmaterial);
		}

		http_response_code(200);
	} else {
		http_response_code(204);
		return;
	}

	$query = "SELECT today,time_used,current_amount FROM 3DMaterial_Graph WHERE material_name=:v1";
	$stmt = $db->prepare($query);

	if (!$stmt->execute([':v1' => $data->material_name])) {
		http_response_code(503);
		echo json_encode($stmt->errorInfo());
		return;
	}

	$num = $stmt->rowCount();

	if($num>0){
		$threedmaterials["graph"] = array();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$graph = array(
				'today' => $today,
				'time_used' => $time_used,
				'current_amount' => $current_amount
			);

			array_push($threedmaterials["graph"], $graph);
		}

		http_response_code(200);
	} else {
		http_response_code(204);
	}
} else {
	$query = "SELECT material_name FROM 3DMaterial";
	$stmt = $db->prepare($query);

	if (!$stmt->execute()) {
		http_response_code(503);
	echo json_encode($stmt->errorInfo());
		return;
	}

	$num = $stmt->rowCount();

	if($num>0){
		$threedmaterials["materialnames"] = array();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			extract($row);

			$threedmaterial = array(
				'material_name' => $material_name
			);

			array_push($threedmaterials["materialnames"], $threedmaterial);
		}

		http_response_code(200);
	} else {
		http_response_code(204);
	}
}

echo json_encode($threedmaterials);

?>
