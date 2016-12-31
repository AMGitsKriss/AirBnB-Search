<?php
	error_reporting(E_ALL);
	ini_set('display_errors', true);

	require("models/KConnect.class.php");
	require("config.php");
	//Accept an AJAX Request.
	//Pass said request to a KDatabase() object
	//Present the data to the JQuery front-end

	$conn = new KConnect("localhost", "ma301kj_airbnb", "ma301kj", "atlantis1985");


	// TODO - Nights, people, room, bed queries! Then build a relevent statement. 


	//$result = $conn->query("selectEntries", $_GET['nights'], $_GET['people'], $_GET['room_type'], $_GET['bed_type']);
	$result = $conn->query("test");

	$tmp = file_get_contents_curl("https://maps.googleapis.com/maps/api/geocode/json?address=se8_4jf");
	$other = json_decode($tmp);
	$output1 = $result->fetchAll(PDO::FETCH_ASSOC);
	$output2 = json_encode($output1);
	$output3 = json_decode($output2);

	$user = $other->results[0]->geometry->location; 
	for($i = 0; $i < count($output3); $i++){ 
		$longDist = $user->lng - $output3[$i]->longitude; 
		$latDist = $user->lat - $output3[$i]->latitude; 
		$distanceWeight = sqrt(pow($latDist,2) + pow($longDist,2)) * $distanceModifier; 
		$distanceWeight = ($distanceWeight * -1) + 5;
		$output3[$i]->distanceWeight = $distanceWeight;
	}

	//print_r($other->results[0]->geometry->location);
	print_r(json_encode($output3));


	//TODO - Take the lat and lng values of the user and do the euclidean maths. Calculate the distance and add it to the output data.

	
	/*while($entry = $result->fetch(PDO::FETCH_ASSOC)) {
		//echo "<p>";
		echo json_encode($entry);
		//print_r($entry);
		//echo "</p>";s
	}*/

	//$googlaApi = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $_GET['target_address'];

	//print_r($result);

	//Pront end processes and finds the best solution
	//Requests a "pretty" display for the final result

	function file_get_contents_curl($url){
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}
?>