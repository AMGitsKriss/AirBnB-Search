
function getList(form) { //target_address, nights, people, room_type, bed_type, amenities

	// Use form results to get absolute negatives and hand them to the search.php file via GET
		// Minimum nights >= nights
		// people >= people
		// room type == room type
		// bed_type == bed_type
	//

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

	var getSearch = "search.php?" + nights + "&" + people + "&" + room + "&" + bedType;

	//Clear the results field
	document.getElementById("results").innerHTML = ""

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var jsonData = JSON.parse(this.responseText);
			var output = "";
			for(i = 0; i < jsonData.length; i++){
				output += "<p>" + JSON.stringify(jsonData[i]) + "</p>";
			}
			document.getElementById("results").innerHTML = output;
		// TODO - Handle the results based on the remaining values. Call another function here to handle the data methinks.
		}
	};
	xmlhttp.open("GET", getSearch);
	xmlhttp.send();
}