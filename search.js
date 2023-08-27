function searchTerm() {
	var xhr = new XMLHttpRequest();

	var searchTerms = document.getElementById("searchterm").value;
	console.log("Search Terms: " + searchTerms);

	xhr.onreadystatechange = function () {
	    if (this.readyState != 4) return;

	    if (this.status == 200) {
		var data = JSON.parse(this.responseText);
		    console.log("Returned Data: " + data);
		    clear_table_replace(data);
	    }
	};
	if(searchTerms == "") {
		searchTerms = "%";
	}
	var geturl = "http://localhost:3002/query?search=" + searchTerms;
	xhr.open('GET', geturl, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send();
}
