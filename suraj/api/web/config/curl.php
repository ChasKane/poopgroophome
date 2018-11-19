<?php

class CURL {
	public function pushNotification($app_token, $title, $body) {
		$headers = array('Content-Type: application/json', 'Authorization: key=AAAAXEMCnyQ:APA91bEmkAt1zK1nM2mefpqar4k2VJtcHXoxhM0BtEcEsz6b8Cg2D2fXMpKaMnrwDs-PnK5G2i8KcaXCKCmN2T19u2NnQ23gXwyR0Am2EpWHpXmOXGGzBf31TB7q2jhH6l6PAwGu6GUc');

		$data = array('notification' => ['title' => $title, 'body' => $body], 'to' => $app_token);

		$curl = curl_init();

		curl_setopt($curl, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_POST, 1);
		curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

		$response = curl_exec($curl);

		curl_close($curl);

		return $response;
	}
}

?>