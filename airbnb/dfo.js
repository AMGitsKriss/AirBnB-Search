
var dimensions = 2;
popSize = 10;

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
	document.getElementById("results").innerHTML = ""

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var jsonData = JSON.parse(this.responseText);
			alert(fitness(amenities(form.amenities), jsonData[0]));
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
}

function dfo(){
	var fly = Array(popSize);

	for(i = 0; i < popSize; i++){
		// TODO - variable references
		fly[i] = new Fly(utils.getRandPos());
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

function Fly(){
	// TODO - Build Fly object
	var temp = {};
}

// TODO
function setPos(){

}

// TODO
function getPos(){

}

// TODO - Fix for JS
function getNeighbours(index) {
	Global.leftN = curr - 1;
	Global.rightN = curr + 1;

	if (curr == 0)
		Global.leftN = Global.popSize - 1;
	if (curr == Global.popSize - 1)
		Global.rightN = 0;
}

function findBestFly() {
		var max = -1;

		// TODO - variable references
		for (int i = 0; i < popSize; i++) {
			if (fly[i].getFitness() > max) {
				min = Global.fly[i].getFitness();
				bestIndex = i;
			}
		}
	}


function amenities(amenities){
	// Iterate over all of the amenities[i].value and amenities[i].checked values. Return a list of the checked values.
	var list = [];
	for(i = 0; i < amenities.length; i++){
		if(amenities[i].checked){
			list.push(amenities[i].value);
		}
	}
	return list;
}

function fitness(amenities, entity){
	// Wanted amenities are x1.0 when present. x0.5 when not.

	var amenityModifier = 1;

	// Iterate over amenities list entity[amenities[i]], getting the value [0,1].
	for(i = 0; i < amenities.length; i++){
		console.log(amenities[i]);
		if(entity[amenities[i]] == 1) {
			console.log("Value " + entity[amenities[i]] + " treated as 'true'");
		}
		else if(entity[amenities[i]] == 0){
			console.log("Value " + entity[amenities[i]] + " treated as 'false'");
			amenityModifier *= 0.5;
		}
	}

	// Avoid throwing a negative number IF the distanceWeights contain a negative. 
	if(entity.distanceWeight <= 0) entity.distanceWeight = 0.01;

	//Ditto for scores
	var review_score = 10;
	if(entity.review_scores_rating > 10) review_score = entity.review_scores_rating;

	console.log("Price: " + (entity.weight/10) + ", Distance: " + (entity.distanceWeight) + ", Score: " + (review_score/10) + ", Amenities: " + amenityModifier);
	// fitness = goodness of price * goodness of distance * user score
	var fitness = (entity.weight/10) * (entity.distanceWeight) * (review_score/10) * amenityModifier;
	console.log("Fitness: " + fitness);
	return fitness;
}