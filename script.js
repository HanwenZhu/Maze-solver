// Define variables
// Note: X axis is vertical to the right, Y axis is horizontal to the left
var height = 20, // X: length up to down
	width = 20, // Y: length left to right
	startX = 10, // X of start position
	startY = 0, // Y of start position
	endX = 10, // X of end position
	endY = 19; // Y of end position

// Define blocked()
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
// Prevent calling out the context menu if right click
document.addEventListener("contextmenu", function(event) {
	var e = event || window.event || arguments.caller.callee.arguments[0];
	e.preventDefault();
});
// Mouseover td function
function over(event) {
	if (mouse1) {
		// Draw
		this.classList.remove("block");
		this.classList.remove("shortest");
	} else if (mouse2) {
		// Erase
		this.classList.add("block");
		this.classList.remove("shortest");
	}
	var e = event || window.event || arguments.caller.callee.arguments[0];
	e.preventDefault();
}

// Define table element and array of <td> elements
var table = document.getElementById("table");
var tds = [];
for (var i = 0; i < height; i++) {
	// Create each row
	var tr = document.createElement("tr");
	table.appendChild(tr);
	tds.push([]);
	for (var j = 0; j < width; j++) {
		// Create each cell
		var td = document.createElement("td");
		td.classList.add("block");
		// Add mouseover of each cell
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
	var shortest = false;
	
	// If reach end, return
	if (x == endX && y == endY) {
		if (step < min) {
			// If the number of steps is minimum, return true to show route in green
			min = step;
			// Remove previous green routes
			for (var i = 0; i < height; i++)
				for (var j = 0; j < width; j++)
					tds[i][j].classList.remove("shortest");
			return true;
		}
		return false;
	}
	
	// 4 directions
	for (var direction = 0; direction < 4; direction++) {
		// Position of next step
		var nextX = x + next[direction][0];
		var nextY = y + next[direction][1];
		
		// If reach border, try next direction
		if (nextX < 0 || nextX >= height || nextY < 0 || nextY >= width)
			continue;
		
		// Not blocked or reached before
		if (!tds[nextX][nextY].blocked() && !book[nextX][nextY]) {
			// Record this position as reached
			book[nextX][nextY] = true;
			// Recurse function to next step
			if(search(nextX, nextY, step + 1)) {
				// If returned true (see before), show cell in green, and return true to previous function, so every cell in the shortest route is green
				shortest = true;
				tds[x][y].classList.add("shortest");
			}
			// Remove record of this position (to detect for next shortest route if it goes across this same position)
			book[nextX][nextY] = false;
		}
	}
	// return true/false to show route in green (see before)
	return shortest;
}

// Start
function start() {
	// Reset min to Infinity
	min = Infinity;
	// Main function
	search(startX, startY, 0);
	// Output steps
	if (isFinite(min))
		document.getElementById("output").innerHTML = "You need a minimum of " + min + " steps to reach the end.";
	else
		document.getElementByIdById("output").innerHTML = "You can not reach the end.";
}
document.getElementsByTagName("button")[0].addEventListener("click", start);