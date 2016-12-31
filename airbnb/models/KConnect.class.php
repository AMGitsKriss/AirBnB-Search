<?php
	class KConnect {

		/* v1.0 May need replacing */

		//Defining the Database Connection and Tables list.
		private $conn;

		private $sql = [
			"test" => "SELECT * FROM searchSpace WHERE property_type = 'Apartment' LIMIT 20",// AND bed_type = 'bed'",
			"selectEntires" => "SELECT * FROM searchSpace WHERE nights = ? AND people = ? AND room_type = ? AND bed_type = ?"//target_address = ? AND hours_check_in = ?, air_conditioning = ?, breakfast = ?, wireless_intercom = ?, cable_tv = ?, carbon_monoxide_detector = ?, cats = ?, dogs = ?, doorman = ?, dryer = ?, elevator = ?, essentials = ?, family_friendly = ?, fire_extinguisher = ?, first_aid = ?, parking = ?, gym = ?, hair_Dryer = ?, hangers = ?, heating = ?, hot_tub = ?, fireplace = ?, internet = ?, iron = ?, kitchen = ?, workspace = ?, bedroom_lock = ?, other_pets = ?, pets_allowed = ?, host_has_pets = ?, pool = ?, safety_card = ?, shampoo = ?, smoke_detector = ?, smoking_allowed = ?, suitable_for_events = ?, tv = ?, washer = ?, washer_dryer = ?, wheelchair_accessible"
		];

		//Initialise the connection.
		function __construct($servername, $dbname, $username, $password){
			try{
				$this->conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
			}
			catch (Exception $e){
				print "<p>Database Connection Derp: " . $e->getMessage() . "</p>";
				die();
			}
		}

		function makeStatement($sql, $data = null){
			$statement = $this->conn->prepare( $sql );
			try{
				$statement->execute($data);
			}
			catch(Exception $e){
				//spit back an error
				$msg = "<p>You tried to run this sql: $entrySQL<p>\n<p>Exception: $e</p>";
				trigger_error($msg);
			}
			return $statement;
		}

		//Returns all entries of a named table. 
		//Should not be called in regular use.
		function getAll($table){
			$sql = "SELECT * FROM $table";

			$statement = $this->makeStatement($sql);
			
			$returnList = [];

			//Get each row as "$value" and add it to the "$returnList" array.
			while($value = $statement->fetch(PDO::FETCH_ASSOC)){
				array_push($returnList, $value);
			}
			return $returnList;
		}

		function query(){
			//First element is the sql key. The rest are arguments.
			$data = func_get_args();
			$key = array_shift($data);

			$statement = $this->makeStatement($this->sql[$key], $data);
			return $statement;
		}
	}
?>