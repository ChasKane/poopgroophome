<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$headers = array('Content-Type: application/json', 'Authorization: key=AAAAXEMCnyQ:APA91bEmkAt1zK1nM2mefpqar4k2VJtcHXoxhM0BtEcEsz6b8Cg2D2fXMpKaMnrwDs-PnK5G2i8KcaXCKCmN2T19u2NnQ23gXwyR0Am2EpWHpXmOXGGzBf31TB7q2jhH6l6PAwGu6GUc');

$data = array('data' => ['title' => 'Title', 'body' => 'Body'], 'to' => 'dnUP93WpKn8:APA91bHs6GS0KXG9s2JTECXS_GjyIZymW4c4tqFctGAKuT3AwKesgl3lTSCclwMEL7L0D7K71KzcyU6Vucw_68MEvpGcbi7-yzUJw8Ybjwpyr8OP7GgQ1ZM8qcO6RXq_S86FgueNx1Mn');

$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($curl);

echo json_encode(array($data, $response));

curl_close($curl);

?>