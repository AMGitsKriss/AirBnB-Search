
var dimensions = 2;
var popSize = 10;
var bestIndex = -1;

//The min and max values for all the listings.
var longMin = -0.5013048470;
var longMax = 0.3175229200;
var latMin = 51.2927186100;
var latMax = 51.6860494400;

function getList(form) { //target_address, nights, people, room_type, bed_type, amenities

	// Use form results to get absolute negatives and hand them to the search.php file via GET
		// Minimum nights >= nights
		// people >= people
		// room type == room type
		// bed_type == bed_type
	//
	var address = "address=" + form.address.value;

	var nights = "";
	if(form.nights.value) nights = "nights=" + form.nights.value;
	//alert("Nights " + nights);

	var people = "";
	if(form.people.value) people = "people=" + form.people.value;
	//alert("People " + people);

	var room = "room="+form.room_type.value
	//alert("Room " + room);

	// The search.php file will treat blank as any.
	var bedType = "bed=";
	// Iterate over the bed_type list and make a comma seperated list like above from the checked boxes.
	for(i = 0; i < form.bed_type.length; i++){
		if(form.bed_type[i].checked == true){
			if(bedType != "bed=") bedType += ",";
			bedType += form.bed_type[i].value;
		}
	}
	//alert(bedType);

	var getSearch = "search.php?" + address + "&" + nights + "&" + people + "&" + room + "&" + bedType;

	//Clear the results field
	document.getElementById("results").innerHTML = "<p>Working... Please be patient.</p>";

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var jsonData = JSON.parse(this.responseText);
			//alert(fitness(amenities(form.amenities), jsonData[0]));
			alert(crawl(form, jsonData));
			var output = "";
			for(i = 0; i < jsonData.length; i++){
				output += "<p>" + JSON.stringify(jsonData[i]) + "</p>";
				//output += JSON.stringify(jsonData[i]) ;
			}
			document.getElementById("results").innerHTML = output;
		// TODO - Handle the results based on the remaining values. Call another function here to handle the data methinks.
		}
	};
	xmlhttp.open("GET", getSearch);
	xmlhttp.send();

	// TESTING IN CONSOLE

	/*
	var tempPos = getRandPos();
	var tempFly = new Fly(tempPos);
	console.log("getRandPos: "+tempPos);
	console.log("Making a fly... " + tempFly.getPos());
	tempFly.setPos(getRandPos());
	console.log("Updating fly... " + tempFly.getPos());
	*/
}

function dfo(){
	var fly = Array(popSize);

	for(i = 0; i < popSize; i++){
		// TODO - variable references
		fly[i] = new Fly(getRandPos());
	}

	// While the break condition *isn't* fulfilled.
	while(!TODOcondition){
		// TODO - If... What is less than what?
		if (Global.evalCount < Global.FE_allowed) { //TODO
			for(i = 0; i < popSize; i++){
				// Evaluate each fly's fitness.
				Global.fly[i].setFitness(utils.evaluate(Global.fly[i].getPos()));
			}
			utils.findBestFly();
			for(i = 0; i < popSize; i++){
				getNeighbours(i);
				// TODO - Variables to JS 
				var leftP = Global.fly[Global.leftN].fitness();
				var rightP = Global.fly[Global.rightN].fitness();

				var chosen;
				if (leftP < rightP)
					chosen = Global.leftN;
				else
					chosen = Global.rightN;

				var dCounter = 0;
				// Update equations
				var temp = Array(dimensions);
				for(d = 0; d < dimensions; d++){
					temp[d] = flat[chosen].getPos(d) + random(1) * (fly[bestIndex].getPos(d) - fly[i].getPos(d));
					//Disturbance
					// TODO - Disturb threshod variable
					if (random(1) < disturbThreshold){
								//TODO - I don't have a range for this search space. eyeall it based on GPS distance
								temp[d] = random(-Global.imgW, Global.imgW);
								dCounter++;
					}
				}
				fly[i].setPos(temp); // TODO - Make sure this isn't a pointer

			}
		}
	}
}

function crawl(form, jsonData){
	// TODO - Iterate over every given result, calculate fitness, then make note of the best fitness. 
	// TODO - We're accessing more globals that we should. 

	// Where entity is the listing.
	var myAmenities = amenities(form.amenities);
	var bestId = -1;
	var bestFitness = -1;

	console.log("ID: " + bestId + " | Fitness: " + bestFitness + " | Result qty: " + jsonData.length);

	for(i = 0; i < jsonData.length; i++){
		console.log(i);
		var listingFitness = fitness(myAmenities, jsonData[i]);
		if(listingFitness > bestFitness){
			bestId = jsonData[i]['id'];
			bestFitness = listingFitness;
			console.log("ID: " + bestId + " | Fitness: " + bestFitness);
		}
	}

	console.log("ID: " + bestId + " | Fitness: " + bestFitness);

	return bestId;
}

function Fly(position){
	// Build Fly object. Kinda self explanitory. 
	var thisFly = {
		pos : position,
		exPos : position,
		fitness : -1,
		getPos : function() {
			return this.pos;
		},
		setPos : function(position){
			this.exPos = this.pos;
			this.pos = position;
		},
		getExPos : function(){
			return this.exPos;
		},
		setFitness : function(f){
			this.fitness = f;
		}
	}
	return thisFly;
}

function getRandPos(){
	// Return coordinates within the long-lat min-max boundries. 
	var range = longMax-longMin;
	var longitude = (Math.random()*range)+longMin;
	range = latMin-latMax;
	var latitude = (Math.random()*range)+latMin;
	return [longitude, latitude];
}

// TODO - Fix for JS
function getNeighbours(index) {
	Global.leftN = curr - 1;
	Global.rightN = curr + 1;

	if (curr == 0)
		Global.leftN = popSize - 1;
	if (curr == popSize - 1)
		Global.rightN = 0;
}

// Finds the best fly. Pretty self explanitory...
function findBestFly() {
	var max = -1;

	for (i = 0; i < popSize; i++) {
		if (fly[i].getFitness() > max) {
			max = fly[i].getFitness();
			bestIndex = i;
		}
	}
}

// Iterate over all of the amenities[i].value and amenities[i].checked values. Return a list of the checked values.
function amenities(amenities){
	var list = [];
	for(i = 0; i < amenities.length; i++){
		if(amenities[i].checked){
			list.push(amenities[i].value);
		}
	}
	return list;
}

// Fitness calculations. Because yeah...
function fitness(amenities, entity){
	// Wanted amenities are x1.0 when present. x0.5 when not.

	var amenityModifier = 1;

	// Iterate over amenities list entity[amenities[i]], getting the value [0,1].
	for(j = 0; j < amenities.length; j++){
		//console.log(amenities[i]);
		if(entity[amenities[j]] != 1) {
			//console.log("Value " + entity[amenities[i]] + " treated as 'false'");
			amenityModifier *= 0.5;
		}
		else{
			//console.log("Value " + entity[amenities[i]] + " treated as 'true'");
		}
	}

	// Avoid throwing a negative number IF the distanceWeights contain a negative. 
	if(entity.distanceWeight <= 0) entity.distanceWeight = 0.01;

	//Ditto for scores
	var review_score = 10;
	if(entity.review_scores_rating > 10) review_score = entity.review_scores_rating;

	console.log("Price: " + (entity.weight/10) + ", Distance: " + (entity.distanceWeight) + ", Score: " + (review_score/10) + ", Amenities: " + amenityModifier);
	// fitness = goodness of price * goodness of distance * user score * amenityModifier
	var fitness = (entity.weight/10) * (entity.distanceWeight/10) * (review_score/10) * amenityModifier;
	//console.log("Fitness: " + fitness);
	return fitness;
}