var board;
var rows = 3;
var cols = 3;
var players = {"X":"blue", "O":"red"};
var gameOver = false;

var textToDisplay = [];


class Board {
	constructor(R, C) {
		this.ROWS = R;
		this.COLS = C;
		this.xSz = 50;
		this.ySz = 50;
		this.turn = 0;
		this.init();
	}

	random() {
		this.board = [];
		for(var r = 0;r < this.ROWS;r++) {
			var row = [];
			for(var c = 0;c < this.COLS;c++) {
				var rand = Math.random() * 10;
				var symbol = "";
				if(rand < 3.3333333)
					symbol = "X";
				else if(rand > 6.66666)
					symbol = "O";

				row.push(new Cell(10 + this.xSz * r, 10 + this.ySz * c, this.xSz, this.ySz, symbol, players[symbol]));
			}
			this.board.push(row);
		}
	}

	get(r,c) {
		if(r > rows || c > cols || r < 0 || c < 0)
			return;
		return this.board[r][c];
	}

	init() {
		this.board = [];
		this.turn = 0;
		for(var r = 0;r < this.ROWS;r++) {
			var row = [];
			for(var c = 0;c < this.COLS;c++) 
				row.push(new Cell(10 + this.xSz * r, 10 + this.ySz * c, this.xSz, this.ySz));
			this.board.push(row);
		}
	}

	place(mouseX, mouseY) {
		for(var r = 0; r < this.ROWS;r++)
			for(var c = 0;c < this.COLS;c++)
				if(this.board[r][c].collided(mouseX,mouseY)) {
					var keys = Object.keys(players);
					var index = this.turn % keys.length;
					if(this.board[r][c].sets(keys[index], players[keys[index]])) {		
						this.turn++;
						return [r, c];
					}
				}
		return [-1,-1];		
	}

	draw() {
		for(var r = 0;r < this.ROWS;r++) 
			for(var c = 0;c < this.COLS;c++){
				this.board[r][c].draw();
			}
	}

	getTurn() {
		var keys = Object.keys(players);

		return(players[keys[this.turn % keys.length]]);
		
	}

	getNeighboursDiag(r, c) {
		if(r > rows || c > cols || r < 0 || c < 0)
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
		if(r > rows || c > cols || r < 0 || c < 0)
			return;

		var left = [], top = [], right = [], bottom = []
		print("getting neighbours of " + r +"," + c)
		for(var i = 0;i < r;i++)
			left.push(this.board[i][c]);
		for(var i = 0;i < c;i++)
			top.push(this.board[r][i]);
		for(var i = r + 1; i < this.ROWS;i++)
			right.push(this.board[i][c]);
		for(var i = c + 1;i < this.COLS;i++)
			bottom.push(this.board[r][i]);

		return [left,top,right,bottom];
	}

}

class Cell {
	constructor( xTL, yTL, xSz, ySz, symbol = "", colour = "white") {
		this.symbol = symbol;
		this.TLx = xTL;
		this.TLy = yTL;
		this.BRx = xTL + xSz;
		this.BRy = yTL + ySz;
		this.xSz = xSz;
		this.ySz = ySz;
		this.colour = colour;
	}

	sets(symb, colour) {
			if(!this.isSet()) {
			this.symbol = symb;
			this.colour = colour;
			return true;
		} return false;
	}

	collided(mouseX, mouseY) {
		if(mouseX <= this.BRx && mouseX >= this.TLx)
			if(mouseY <= this.BRy && mouseY >= this.TLy)
				return true;
		return false;
	}

	isSet() {
		if(this.symbol != "")
			return true;
		return false;
	}

	draw() {
		fill(this.colour);
		rect(this.TLx, this.TLy, this.xSz, this.ySz);
	}

	toString() {
		return this.symbol
	}
}

function check(board, x, y, tolerance = rows) {
	//var [left, top, right, bottom] 

	//var [topLeft, topRight, bottomRight, bottomLeft]

	var placer = board.get(x,y);

	
	var neighbours = [board.getNeighboursStraight(x, y), board.getNeighboursDiag(x, y)];

	var won = false;
	for(let directions of neighbours) {
		for(let direction of directions) {
			if(won) return placer.symbol;

			if(direction.length >= tolerance - 1)
				won = true;
			for(var neighbourIndex = 0;neighbourIndex < direction.length && won;neighbourIndex++) {
				var neighbour = direction[neighbourIndex];
				if(placer.toString() != neighbour.toString())
					won = false;
			}
		}
	}
	if(won) return placer.symbol;
	return "";
}

function setup() {
	createCanvas(600, 600);
	board = new Board(rows, cols);
	board.init();
}


function mouseClicked() {

	if(!gameOver)
		var [x, y] = board.place(mouseX, mouseY);
	if(x >= 0 && y >= 0) {
		var winner = check(board, x, y);
		print("w:" + winner);
		if(winner != "") {
			textToDisplay.push("Player " + players[winner] + " has won!");
			gameOver = true;
		}
		print(players[winner]);
	}
}

function draw() {
	clear();

	fill(0);

	for(let t of textToDisplay)
		text(t,10, board.COLS * board.ySz + 40);

	text("It is player " + board.getTurn() + "'s turn", 10,board.COLS * board.ySz + 30);

	board.draw();

	//ellipse(mouseX, mouseY, 80, 80);
}