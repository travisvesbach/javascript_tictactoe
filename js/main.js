var currentPlayer = "";
var playerOne = new Player('X');
var playerTwo = new Player('O');

// Player object
function Player(symbol) {
	this.symbol = symbol;
}

// Board object
var board = {
	cells: [],
	winners: [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]],
	game_over: false,
	winner: "",
	// Initializes the board
	initialize: function() {
		this.cells = ["","","","","","","","",""];
		this.game_over = false;
	},
	// Updates the board when a move is made
	update: function(index) {
		this.cells[index] = currentPlayer.symbol;
	},
	// Checks to see if the current player won or if there is a draw
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

// AI object
var ai = {
	active: false,
	// Turns the AI on or off
	on_off: function() {
		if (this.active === true) {
			this.active = false;
			$('.ai-button').html('AI Off');
		} else {
			this.active = true;
			$('.ai-button').html('AI On');
		}
	},
	// Ai finds and makes a move
	move: function() {
		var target = false;
		target = this.check_win();
		if (target === false) {
			target = this.check_lose();
		}
		if (target === false) {
			target = this.check_soon_win();
		}
		if (target === false) {
			var potential = Math.floor(Math.random() * 9);
			while (board.cells[potential] === 'X' || board.cells[potential] === 'O') {
				potential = Math.floor(Math.random() * 9);
			}
			target = potential;
		}
		board.update(target);
	},
	//checks to see if the AI has a move that it can win by making
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
		return possibleMove;
	},
	// Checks to see of the player has 2 in line so the AI can block
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
		return possibleMove;
	},		
	// AI checks for a row that only needs two more for it to win
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
		return possibleMove;
	}

}

// Prints the board in the browser
function render() {
	$('.board-container').html("");
	$('.board-container').append('<div class="board-cell" id="0"><p>' + board.cells[0] + '</p></div><div class="board-cell" id="1"><p>' + board.cells[1] + '</p></div><div class="board-cell" id="2"><p>' + board.cells[2] + '</p></div><div class="board-cell" id="3"><p>' + board.cells[3] + '</p></div><div class="board-cell" id="4"><p>' + board.cells[4] + '</p></div><div class="board-cell" id="5"><p>' + board.cells[5] + '</p></div><div class="board-cell" id="6"><p>' + board.cells[6] + '</p></div><div class="board-cell" id="7"><p>' + board.cells[7] + '</p></div><div class="board-cell" id="8"><p>' + board.cells[8] + '</p></div>' );
}

// Checks to see if a click is a valid move for the player, then makes the move.  If the AI is active, it will then call for the AI to make a move.
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

// Reacts when a user clicks on one of the 9 spaces of the board
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

// Resets settings for a new game
function new_game() {
	$('.ending').html(' ');
	$('.ending').removeClass('player-one');
	$('.ending').removeClass('player-two');
	$('.ending').removeClass('draw');
	currentPlayer = playerOne;
	board.initialize();
	render();
}

// Prints out the results of the game in the browser
function game_end() {
	if (board.winner !== 'draw') {
		$('.ending').html('Game over! ' + currentPlayer.symbol + ' is the winner!');
		if (currentPlayer === playerOne) {
			$('.ending').addClass('player-one');
		} else {
			$('.ending').addClass('player-two');
		}
	} else {
		$('.ending').html('It\'s a draw! No one wins!');
		$('.ending').addClass('draw');
	}
}

// Starting engine for the game
function game_engine() {
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