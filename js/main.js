var currentPlayer = "";
var playerOne = new Player('X');
var playerTwo = new Player('O');

function Player(symbol) {
	this.symbol = symbol;
}


var board = {
	cells: [],
	winners: [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]],
	game_over: false,
	winner: "",
	initialize: function() {
		this.cells = ["","","","","","","","",""];
		this.game_over = false;
	},
	update: function(index) {
		this.cells[index] = currentPlayer.symbol;
		console.log('cells: ' + this.cells);
		console.log('starting cells: ' + this.startingCells);
	},
	check_win: function() {
		this.winners.forEach(function(array){
			var count = 0;
			array.forEach(function(index) {
				if (board.cells[index] === currentPlayer.symbol) {
					count++;
					console.log(count);
				}
			});
			if (count === 3) {
				board.game_over = true;
				board.winner = currentPlayer;
			}
		});
		if (this.game_over === false && this.cells.includes("") === false) {
			this.game_over = true;
			this.winner = 'draw';
		}
	}
}

var ai = {
	active: false,
	on_off: function() {
		if (this.active === true) {
			this.active = false;
			$('.ai-button').html('Turn AI On');
		} else {
			this.active = true;
			$('.ai-button').html('Turn AI Off');
		}
		console.log('ai active: ' + this.active);
	},
	move: function() {
		var target = false;
		console.log('ai target: ' + target);
		target = this.check_win();
		console.log('ai target: ' + target);
		if (target === false) {
			target = this.check_lose();
			console.log('ai target: ' + target);
		}
		if (target === false) {
			target = this.check_soon_win();
			console.log('ai target: ' + target);
		}
		if (target === false) {
			var potential = Math.floor(Math.random() * 9);
			console.log('ai potential: ' + potential);
			while (board.cells[potential] === 'X') {
				potential = Math.floor(Math.random() * 9);
				console.log('ai potential: ' + potential);
			}
			console.log('ai potential: ' + potential);
			target = potential;
		}
		console.log('ai target: ' + target);
		board.update(target);
	},
	check_win: function() {
		var possibleMove = false;
		board.winners.forEach(function(array) {
			var count = 0;
			var target = false;
			array.forEach(function(index) {
				if (board.cells[index] === 'O') {
					count++;
				} else if (board.cells[index] !== 'X') {
					target = index;
				}
			});
			if (count == 2 && target !== false) {
				possibleMove = target;
			} 
		});
		console.log('possibleMove: ' + possibleMove);
		return possibleMove;
	},
	check_lose: function() {
		var possibleMove = false;
		board.winners.forEach(function(array) {
			var count = 0;
			var target = false;
			array.forEach(function(index) {
				if (board.cells[index] === 'X') {
					count++;
				} else if (board.cells[index] !== 'O') {
					target = index;
				}
			});
			if (count == 2 && target !== false) {
				possibleMove = target;
			}
		});
		console.log('possibleMove: ' + possibleMove);
		return possibleMove;
	},		
	check_soon_win: function() {
		var possibleMove = false;
		board.winners.forEach(function(array) {
			var oCount = 0;
			var xCount = 0;
			var target = false;
			array.forEach(function(index) {
				if (board.cells[index] === 'O') {
					oCount++;
				} else if (board.cells[index] != 'X') {
					target = index;
				} else {
					xCount++;
				}
			});
			if (oCount >= 1 && xCount === 0 && target !== false) {
				possibleMove = target;
			} 
		});
		console.log('possibleMove: ' + possibleMove);
		return possibleMove;
	}

}

function render() {
	$('.board-container').html("");
	$('.board-container').append('<div class="board-cell" id="0"><p>' + board.cells[0] + '</p></div><div class="board-cell" id="1"><p>' + board.cells[1] + '</p></div><div class="board-cell" id="2"><p>' + board.cells[2] + '</p></div><div class="board-cell" id="3"><p>' + board.cells[3] + '</p></div><div class="board-cell" id="4"><p>' + board.cells[4] + '</p></div><div class="board-cell" id="5"><p>' + board.cells[5] + '</p></div><div class="board-cell" id="6"><p>' + board.cells[6] + '</p></div><div class="board-cell" id="7"><p>' + board.cells[7] + '</p></div><div class="board-cell" id="8"><p>' + board.cells[8] + '</p></div>' );
}

function new_game() {
	console.log('new game');
	$('.ending').html(' ');
	currentPlayer = playerOne;
	board.initialize();
	render();
}

function make_move() {
	var index = this.id;
	if (board.cells[index] === "") {
		board.update(index);
		render();
		board.check_win();
		if (board.game_over === true) {
			return game_end();
		}
		if (currentPlayer === playerOne) {
			currentPlayer = playerTwo;
		} else {
			currentPlayer = playerOne;
		}
		if (ai.active === true) {
			console.log(ai.active);
			console.log('ai is active, so moving');
			ai.move();
			render();
			board.check_win();
			if (board.game_over === true) {
				return game_end();
			}
			currentPlayer = playerOne;
		}
	}
	input();
}

function input() {
	$('#0').on('click', make_move);
	$('#1').on('click', make_move);
	$('#2').on('click', make_move);
	$('#3').on('click', make_move);
	$('#4').on('click', make_move);
	$('#5').on('click', make_move);
	$('#6').on('click', make_move);
	$('#7').on('click', make_move);
	$('#8').on('click', make_move);
}

function game_end() {
	if (board.winner !== 'draw') {
		$('.ending').html('Game over! ' + currentPlayer.symbol + ' is the winner!');
	} else {
		$('.ending').html('It\'s a draw! No one wins!');
	}
}

function game_engine() {
	console.log('game engine');
	new_game();
	input();
}

$(document).ready(function() {
	game_engine();
	$('.new-game-button').on('click', game_engine);
	$('.ai-button').on('click', function() {
		ai.on_off();
		game_engine();
	});
});