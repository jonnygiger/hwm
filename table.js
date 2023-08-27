var emptyTable = '<tbody class="itemtabletbody"><tr class="firstrow"><th style="width: 5%;">ItemID</th><th style="width: 5%;">Location</th><th style="width: 85%;">Name</th></tr></table>';

function addRow(itemid, name_en, name_de, location) {
	if (!document.getElementsByTagName) return;
	//tabBody=document.getElementsByTagName("tbody").item(0);
    itemTable=document.getElementsByClassName("itemtable").item(0);
    tabBody=itemTable.firstChild;
	row=document.createElement("tr");
	cell1 = document.createElement("td");
	cell2 = document.createElement("td");
	//cell3 = document.createElement("td");
	cell4 = document.createElement("td");
	textnode1=document.createTextNode(itemid);
	textnode2=document.createTextNode(location);
	//textnode3=document.createTextNode("1");
	var currentLang = document.getElementById("langbtn").innerHTML;
	if(currentLang == "DE" && name_de.length > 0) {
		textnode4=document.createTextNode(name_de);
	} else {
		textnode4=document.createTextNode(name_en);
	}
	cell1.appendChild(textnode1);
	cell2.appendChild(textnode2);
	//cell3.appendChild(textnode3);
	cell4.appendChild(textnode4);
	row.appendChild(cell1);
	row.appendChild(cell2);
	//row.appendChild(cell3);
	row.appendChild(cell4);
	tabBody.appendChild(row);
}

function clear_table_replace(data) {
	//old_tbody = document.querySelectorAll('.itemtabletbody')[0];
    old_table = document.querySelectorAll('.itemtable')[0];
    old_tbody = old_table.firstChild;
	var new_tbody = document.createElement('tbody');
	new_tbody.innerHTML = emptyTable;
	old_table.replaceChild(new_tbody, old_tbody);
	append_json(data);
}

function append_json(data) {
	data.forEach(function(object) {
		addRow(object.itemid, object.name_en, object.name_de, object.location);
	});
}

function get_json_data() {
	var json_url = '/itemlist.json';
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() { 
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);
			append_json(data);
		}
	}
	xmlhttp.open("GET", json_url, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send();
}

function changeLanguage() {
	var currentLang = document.getElementById("langbtn").innerHTML;
	if(currentLang == "EN") {
		document.getElementById("langbtn").innerHTML = "DE";
	} else {
		document.getElementById("langbtn").innerHTML = "EN";
	}
	document.getElementsByClassName("itemtable").item(0).innerHTML = emptyTable;
	get_json_data();
}

function itemIsInViewport(item) {
	var scrollElement = document.querySelector('.flex-container .row.content');
	console.log(item.innerHTML);
	var upperBound = item.offsetTop + item.offsetHeight;
	var lowerBound = item.offsetTop;// - scrollElement.offsetHeight;
	var currentPosition = scrollElement.scrollTop;
	console.log("upperBound: " + upperBound + " lowerBound: " + lowerBound + "offsetHeight: " + scrollElement.offsetHeight + " currentPos: " + currentPosition);
	console.log("Return: " + (lowerBound > currentPosition && currentPosition > upperBound));
	return lowerBound >= currentPosition && currentPosition + scrollElement.offsetHeight >= upperBound;
}

function updateImage(row) {
	var itemId = row.closest('tr').getElementsByTagName("td")[0].innerHTML;
	var imageTd = document.getElementById('image-td');
	var itemTextBox = document.getElementById('item-text');
	imageTd.innerHTML = '<img src="images/' + itemId + '.jpg"></img>';
	itemTextBox.innerHTML = itemId;
}

document.addEventListener("DOMContentLoaded", function(event){
	document.getElementsByClassName("itemtable").item(0).innerHTML = emptyTable;
	get_json_data();
	document.getElementById("langbtn").addEventListener("click", changeLanguage);
	tables = document.querySelectorAll('.itemtable'), toggleHighlight = (e) => {
		document.querySelectorAll('.selectedRow').forEach(
			(el) => el.classList.remove('selectedRow')
		);
		e.target.closest('tr').classList.add('selectedRow');
		//var itemId = e.target.closest('tr').getElementsByTagName("td")[0].innerHTML;
		//var imageTd = document.getElementById('image-td');
		//imageTd.innerHTML = '<img src=images/' + itemId + '.jpg></img>';
		updateImage(e.target);
	};
	tables.forEach(
		(table)=>{
			table.addEventListener('click', toggleHighlight)
		}
	);
	var tableClassScroller = document.querySelector(".flex-container .row.content");
	var moveUpBtn = document.getElementById("select-up");
	var moveDownBtn = document.getElementById("select-down");
	var skipUpBtn = document.getElementById("skip-up");
	var skipDownBtn = document.getElementById("skip-down");
	moveUpBtn.addEventListener("click", function() {
		var highlightedRow = document.querySelector("table tr.selectedRow");
		if (highlightedRow && highlightedRow.previousElementSibling.previousElementSibling) {
				highlightedRow.classList.remove("selectedRow");
				highlightedRow.previousElementSibling.classList.add("selectedRow");
				updateImage(highlightedRow.previousElementSibling);
		}
		if (!itemIsInViewport(highlightedRow.previousElementSibling)) {
			tableClassScroller.scrollTop = highlightedRow.previousElementSibling.offsetTop;
		}
	});
	moveDownBtn.addEventListener("click", function() {
		var highlightedRow = document.querySelector("table tr.selectedRow");
		if (highlightedRow && highlightedRow.nextElementSibling) {
			highlightedRow.classList.remove("selectedRow");
			highlightedRow.nextElementSibling.classList.add("selectedRow");
			updateImage(highlightedRow.nextElementSibling);
		}
		if (!itemIsInViewport(highlightedRow.nextElementSibling)) {
			tableClassScroller.scrollTop = highlightedRow.nextElementSibling.offsetTop;
		}
	});
	skipUpBtn.addEventListener("click", function() {
		var highlightedRow = document.querySelector("table tr.selectedRow");
		if (highlightedRow && highlightedRow.previousElementSibling) {
			var targetRow = highlightedRow;
			for (var i = 0; i < 5; i++) {
				if (targetRow.previousElementSibling) {
					targetRow = targetRow.previousElementSibling;
				} else {
					break;
				}
			}
			highlightedRow.classList.remove("selectedRow");
			targetRow.classList.add("selectedRow");
			updateImage(targetRow);
		}
		if (!itemIsInViewport(targetRow)) {
			tableClassScroller.scrollTop = targetRow.offsetTop;
		}
	});
	skipDownBtn.addEventListener("click", function() {
		var highlightedRow = document.querySelector("table tr.selectedRow");
		if (highlightedRow && highlightedRow.nextElementSibling) {
			var targetRow = highlightedRow;
			for (var i = 0; i < 5; i++) {
				if (targetRow.nextElementSibling) {
					targetRow = targetRow.nextElementSibling;
				} else {
					break;
				}
			}
			highlightedRow.classList.remove("selectedRow");
			targetRow.classList.add("selectedRow");
				updateImage(targetRow);
		}
		if (!itemIsInViewport(targetRow)) {
			tableClassScroller.scrollTop = targetRow.offsetTop;
		}
	});

});
