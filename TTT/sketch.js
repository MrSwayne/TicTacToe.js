var textToDisplay = [];
var game;


class Player {

	constructor(colour) {
		this.colour = colour;
		print("Player " + colour + " created");
	}

	toString() {
		return this.colour;
	}
}

class Human extends Player {

	constructor( colour) {
		super(colour);
	}

	getTurn(board) {
		return [-1,-1];
	}
}

class Bot extends Player {

	constructor(colour) {
		super(colour);
	}

	minimax(board, max) {
		//board.placeRandom(this.colour);
	}

	getTurn(board) {
		var max = 0;
		/*
		for(var r =0;r < board.ROWS;r++) {
			for(var c = 0;c < board.COLS;c++) {
				if(board[r][c].toString() == "") {
					this.minimax(board, true);
				}
			}
		}
		//return [x,y];
*/		
	//	for(var r = 0;r < board.rows();r++) {

		//	for(var c = 0;c < board.cols();c++) {
		//		if(!board.get(r,c).isSet()) {
		//			print("bot:::" + r + " " + c);
		//			return [r,c];
		//		}
		//	}
		//}
	//	return [x,y];
		var x = ((Math.random() * 100) | 0) % board.rows();
		print(x);
		var y = ((Math.random() * 100) | 0) % board.cols();
		print(y);
		return[x, y];
	}
}


class Game {
	constructor() {
		this.players = [];
		for(let o of arguments)
			if(o instanceof Player)
				this.players.push(o);
		this.ROWS = 3;
		this.COLS = 3;
		this.setup();
	}

	check(x, y, tolerance = this.ROWS) {
	//var [left, top, right, bottom] 

	//var [topLeft, topRight, bottomRight, bottomLeft]

		var placer = this.board.get(x,y);

		var neighbours = [this.board.getNeighboursStraight(x, y), this.board.getNeighboursDiag(x, y)];
		var won = false;
		for(let directions of neighbours) {
			for(let direction of directions) {
				if(won) return placer.colour;

				if(direction.length >= tolerance - 1)
					won = true;
				for(var neighbourIndex = 0;neighbourIndex < direction.length && won;neighbourIndex++) {
					var neighbour = direction[neighbourIndex];
					if(placer.toString() != neighbour.toString())
						won = false;
				}
			}
		}
		if(won) return placer.colour;
		return "";
	}	

	setup() {
		this.gameOver = false;
		this.board = new Board(this.ROWS,this.COLS);
		this.turn = 0;
	}

	random() {
		setup();

		for(var r = 0;r < this.ROWS;r++) {
			for(var c = 0;c < this.COLS;c++) {
				var rand = Math.random() * (this.players.length + 1);
				if(rand < this.players.length)
					board.sets(r, c, this.players[rand].colour);
			}
		}
	}

	mouseClick() {
		this.getTurn();
	}

	getCurrentPlayer() {
		return this.players[this.turn % this.players.length];
	}

	tick() {
		this.draw();
		this.getTurn();
	}

	getTurn() {
		if(this.gameOver) return;
		var player = this.getCurrentPlayer();


	//	if(player instanceof Human) {
		//	var placer = this.players[this.turn % this.players.length];
		//	var [x, y] = this.board.place(player, mouseX, mouseY);

	//	}
	//	else {
	//		var [x, y] = player.getTurn(this.board);
	//	}
		var[x, y] = [-1,-1];

		// var [x1,y1] = player.getTurn(this.board);

		 if(player instanceof Bot) {
		 	[x,y] = this.board.placeRandom(player.colour);
		 	//[x, y] = this.board.place(player, -x, -y);
		 }
		 else if(player instanceof Human) {
		 	if(mouseIsPressed) {
		 		[x, y] = this.board.place(player, mouseX, mouseY);
		 	}
		 }
		 	
		if(x >= 0 && y >= 0) {
			var winner = this.check(x, y);
			if(winner != "white" && winner != "") {
				textToDisplay.push("Player " + winner + " has won!");
				this.gameOver = true;
			}
			this.turn++;
		}
	}

	draw() {
		this.board.draw();
		fill(0);
		text("It is player " + this.getCurrentPlayer() + "'s turn", 10, this.board.COLS * this.board.ySz + 30);
	}
}


function setup() {
	createCanvas(600, 600);
	print("hi");
	 game = new Game(new Human("Blue"), new Bot("Red"));
}

function mouseClicked() {
	game.mouseClick();
}

function draw() {
	clear();

	fill(0);
	for(var i = 0;i < textToDisplay.length;i++) {
		text(textToDisplay[i],10, game.board.COLS * game.board.ySz + ((i + 4) * 10));
	}
	game.tick();
//	board.draw();
}