// Define start/end positions
// Note: X axis is vertical to the right, Y axis is horizontal to the left
var height = 20,
	width = 20,
	startX = 10,
	startY = 0,
	endX = 10,
	endY = 19;

// Define blocked
Element.prototype.blocked = function() {
	// "block" = wall, no "block" = way
	return this.classList.contains("block");
};

// Hold left mouse button = mouse1 = draw,
// Hold right mouse button = mouse2 = erase
var mouse1 = false, mouse2 = false;
document.addEventListener("mousedown", function(event) {
	var e = event || window.event || arguments.caller.callee.arguments[0];
	e.preventDefault();
	switch (e.button) {
		case 0:
			mouse1 = true;
			break;
		case 2:
			mouse2 = true;
	}
});
// Release mouse, same as above
document.addEventListener("mouseup", function(event) {
	var e = event || window.event || arguments.caller.callee.arguments[0];
	e.preventDefault();
	switch (e.button) {
		case 0:
			mouse1 = false;
			break;
		case 2:
			mouse2 = false;
	}
});
document.addEventListener("contextmenu", function(event) {
	var e = event || window.event || arguments.caller.callee.arguments[0];
	e.preventDefault();
});
// Mouseover td function
function over(event) {
	if (mouse1) {
		this.classList.remove("block");
		this.classList.remove("shortest");
	} else if (mouse2) {
		this.classList.add("block");
		this.classList.remove("shortest");
	}
	var e = event || window.event || arguments.caller.callee.arguments[0];
	e.preventDefault();
}

// Define table and array of <td>s
var table = document.getElementById("table");
var tds = [];
for (var i = 0; i < height; i++) {
	
	var tr = document.createElement("tr");
	table.appendChild(tr);
	tds.push([]);
	for (var j = 0; j < width; j++) {
		var td = document.createElement("td");
		td.classList.add("block");
		td.addEventListener("mouseover", over);
		tr.append(td);
		tds[i].push(td);
	}
}

// tds[startX][startY] = start position
tds[startX][startY].removeEventListener("mouseover", over);
tds[startX][startY].classList.remove("block");
tds[startX][startY].id = "start";
// tds[endX][endY] = end position
tds[endX][endY].removeEventListener("mouseover", over);
tds[endX][endY].classList.remove("block");
tds[endX][endY].id = "end";

// Record of whether a cell is reached
var book = (new Array(height)).fill().map(function() {return new Array(30).fill(false);});
// Next step for 4 directions
var next = [[0, 1], [1, 0], [0, -1], [-1, 0]];
// Output: minimum of steps
var min = Infinity;

// Main function
function search(x, y, step) {
	// Reach end
	var shortest = false;
	if (x == endX && y == endY) {
		if (step < min) {
			min = step;
			for (var i = 0; i < height; i++)
				for (var j = 0; j < width; j++)
					tds[i][j].classList.remove("shortest");
			return true;
		}
		return false;
	}
	
	// 4 Directions
	for (var direction = 0; direction < 4; direction++) {
		// Position of next step
		var nextX = x + next[direction][0];
		var nextY = y + next[direction][1];
		
		// Reach border
		if (nextX < 0 || nextX >= height || nextY < 0 || nextY >= width)
			continue;
		
		// Not blocked or reached before
		if (!tds[nextX][nextY].blocked() && !book[nextX][nextY]) {
			book[nextX][nextY] = true;
			// Recurse function to next step
			if(search(nextX, nextY, step + 1)) {
				shortest = true;
				tds[x][y].classList.add("shortest");
			}
			book[nextX][nextY] = false;
		}
	}
	return shortest;
}

// Start
function start() {
	min = Infinity;
	search(startX, startY, 0);
	if (isFinite(min))
		document.getElementById("output").innerHTML = "You need a minimum of " + min + " steps to reach the end.";
	else
		document.getElementByIdById("output").innerHTML = "You can not reach the end.";
}
document.getElementsByTagName("button")[0].addEventListener("click", start);