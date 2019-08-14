
class LinkedList {

	constructor() {
		this.head = null;
		this.tail = null;
		this.sz = 0;
	}

	add(node) {
		if(node instanceof Node) {
			if(head == null) {
				this.head = node;
				this.tail = node;
			} else {
				this.tail.next = node;
				node.previous = this.tail;
				this.tail = node;
			}
			this.sz++;
		}
	}

	remove(data) {

		if(this.sz == 1) {
			this.head = null;
			this.tail = null;
			sz--;
		}
		else if(this.sz > 1) {
			var cNode = new Node();
			cNode.next = this.head;
			while(cNode.next != null) {
				cNode = cNode.next;
				if(cNode.data == data) {
					var lNode = cNode.previous;
					var nNode = cNode.next;
					lNode.next = nNode;
					nNode.previous = lNode;
					sz--;
				}
			}
		}
	}

	get(i) {
		if(i < 0 || i >= sz) return null;
		var cNode = new Node();
		cNode.next = this.head;
		var currentIndex = 0;

		while(currentIndex <= i) {
			cNode = cNode.next;
			if(currentIndex == i)
				return cNode.data;
			currentIndex++;
		}
	return null;
	}
}

class Node {
	constructor(data = "") {
		this.data = data;
		this.next = null;
		this.previous = null;
	}
}



class Board {

	constructor(R = 3, C = 3) {
		this.ROWS = R;
		this.COLS = C;
		this.xSz = 50;
		this.ySz = 50;
		//this.available = new LinkedList();
		this.init();
	}

	cols() {
		return this.COLS;
	}

	getAvailable() {

	}

	rows() {
		return this.ROWS;
	}

	clone() {
		var b = new Board(this.ROWS, this.COLS);
		for(var r =0;r < this.ROWS;r++)
			for(var c = 0; c < this.COLS;c++)
				if(this.board[r][c].isSet())
					b.get(r,c).sets(this.board[r][c].colour);
		return b;
	}

	get(r,c) {
		if(r > this.ROWS || c > this.COLS || r < 0 || c < 0)
			return;
		return this.board[r][c];
	}

	sets(r,c, colour) {

		if(this.board[r][c].sets(colour)) {
			return true;
		} return false;
	}

	init() {
		this.board = [];
		for(var r = 0;r < this.ROWS;r++) {
			var row = [];
			for(var c = 0;c < this.COLS;c++) {
				var cell = new Cell(10 + this.xSz * r, 10 + this.ySz * c, this.xSz, this.ySz);
				row.push(cell);
				//this.available.push(cell);
			}
			this.board.push(row);
		}
	}

	placeRandom(colour) {
		var row = Math.floor(Math.random() * this.ROWS);
		var col = Math.floor(Math.random() * this.COLS);
		if(this.sets(row, col, colour))
			return [row,col];
		else
			return [-1,-1];

	}
	//if -X, then it is a row, if -Y then it is a column
	place(player, mouseX, mouseY) {
		if(mouseX < 0 && mouseY < 0) {
			var r = -mouseX;
			var c = -mouseY;

			if(r > this.ROWS || c > this.COLS || r < 0 || c < 0)
				return [-1,-1];
			if(this.sets(r, c, player.colour))
				return [r, c];

		}

		for(var r = 0; r < this.ROWS;r++)
			for(var c = 0;c < this.COLS;c++)
				if(this.board[r][c].collided(mouseX,mouseY))
					if(this.sets(r, c, player.colour)) {		
						return [r, c];
					}
		return [-1,-1];		
	}

	draw() {
		for(var r = 0;r < this.ROWS;r++) 
			for(var c = 0;c < this.COLS;c++){
				this.board[r][c].draw();
			}
	}

	getNeighboursDiag(r, c) {
		if(r > this.ROWS || c > this.COLS || r < 0 || c < 0)
			return;
		var topLeft = [], topRight = [], bottomLeft = [], bottomRight = [];

		for(var i = c - 1, j = r - 1;i >= 0 && j >= 0;i--, j--)
			topLeft.push(this.board[j][i]);
		for(var i = c + 1, j = r + 1; i < this.ROWS && j < this.COLS;i++, j++) {
			bottomRight.push(this.board[j][i]);
		}

		for(var i = c + 1, j = r - 1;i < this.ROWS && j >= 0;i++,j--)
			bottomLeft.push(this.board[j][i]);
		for(var i = c - 1, j = r + 1;i >= 0 && j < this.COLS;i--,j++)
			topRight.push(this.board[j][i]);

		return [topLeft, topRight, bottomRight, bottomLeft];
	}

	getNeighboursStraight(r, c) {
		if(r > this.ROWS || c > this.COLS || r < 0 || c < 0)
			return;

		var left = [], top = [], right = [], bottom = []
		for(var i = r - 1;i >= 0;i--)
			left.push(this.board[i][c]);
		for(var i = c - 1;i >= 0;i--)
			top.push(this.board[r][i]);
		for(var i = r + 1; i < this.ROWS;i++)
			right.push(this.board[i][c]);
		for(var i = c + 1;i < this.COLS;i++)
			bottom.push(this.board[r][i]);

		return [left,top,right,bottom];
	}

}

class Cell {
	constructor( xTL, yTL, xSz, ySz, colour = "white") {
		this.TLx = xTL;
		this.TLy = yTL;
		this.BRx = xTL + xSz;
		this.BRy = yTL + ySz;
		this.xSz = xSz;
		this.ySz = ySz;
		this.colour = colour;
	}

	sets(colour) {
			if(!this.isSet()) {
				this.colour = colour;
				return true;
			}
		 return false;
	}

	collided(mouseX, mouseY) {
		if(mouseX <= this.BRx && mouseX >= this.TLx)
			if(mouseY <= this.BRy && mouseY >= this.TLy)
				return true;
		return false;
	}

	isSet() {
		if(this.colour != "white")
			return true;
		return false;
	}

	draw() {
		fill(this.colour);
		rect(this.TLx, this.TLy, this.xSz, this.ySz);
	}

	toString() {
		return this.colour;
	}
}