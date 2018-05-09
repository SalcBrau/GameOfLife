"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

$(document).ready(function () {

	var $sizeSmall = $("#small"),
	    $sizeMed = $("#medium"),
	    $sizeBig = $("#big"),
	    $generation = $("#generation"),
	    generation = 0,
	    possibilities = ["dead", "dead", "dead", "dead", "dead", "dead", "dead", "dead", "dead", "dead", "dead", "dead", "young", "old"],
	    rndmNum,
	    board,
	    copyBoard,
	    innerBoard,
	    rows,
	    status,
	    cells,
	    ndxs,
	    cellState,
	    count,
	    game,
	    speed = 400,
	    x,
	    running = false,
	    y;

	$("#size button").click(function () {
		$(".cell").off("click");
		switch (this.id) {
			case "small":
				setSize(50, 30, false);
				break;
			case "medium":
				setSize(70, 50, false);
				break;
			case "big":
				setSize(100, 80, false);
				break;
		}
		$("#size .selected").toggleClass("selected");
		$(this).toggleClass("selected");
	});

	$("#speed button").click(function () {
		$("#speed .selected").toggleClass("selected");
		$(this).toggleClass("selected");
		switch (this.id) {
			case "fast":
				speed = 400;
				break;
			case "med":
				speed = 800;
				break;
			default:
				speed = 1200;
				break;
		}
		clearInterval(game);
		running = false;
		runGame(speed);
	});

	$("#run").click(function () {
		return runGame(speed);
	});

	$("#pause").click(function () {
		clearInterval(game);
		running = false;
	});

	$("#clear").click(function () {
		generation = 0;
		$generation.text(generation);
		$("#size .selected").trigger("click");
		clearInterval(game);
		running = false;
	});

	function setSize(first, second, init) {

		board = [];
		copyBoard = [];

		for (var i = 0; i < first; i++) {
			board.push([]);
			copyBoard.push([]);
			for (var j = 1; j <= second; j++) {
				board[i].push(["dead"]);
				copyBoard[i].push(["dead"]);
			}
		}

		if (!init) {
			innerBoard.setState({ board: board });
			if (game) {
				clearInterval(game);
				running = false;
			}
		} else {
			randomBoard(first, second);
		}

		generation = 0;
		$('#generation').text(generation);
		window.setTimeout(function () {
			$(".cell").click(checkStatus);
		}, 400);
	}

	function randomBoard(first, second) {
		for (var i = 0; i < first; i++) {
			board.push([]);
			copyBoard.push([]);
			for (var j = 1; j <= second; j++) {
				copyBoard[i][j] = board[i][j] = getRandomValue();
			}
		}
	}

	function getRandomValue() {
		rndmNum = Math.floor(Math.random() * (13 - 0 + 1)) + 0;
		return possibilities[rndmNum];
	}

	function setSpeed() {
		clearInterval(game);
		running = false;
		runGame(speed);
	}

	function runGame(speed) {
		if (!running) {
			game = setInterval(function () {
				running = true;
				generation++;
				$generation.text(generation);

				if (!$(".old").length && !$(".young").length) {
					window.setTimeout(function () {
						$("#clear").trigger("click");
					}, 350);
				}

				for (var i = 0; i < board.length; i++) {
					for (var j = 0; j < board[i].length; j++) {
						count = 0;
						for (var x = i - 1; x <= i + 1; x++) {
							if (board[x] !== undefined) {
								for (var y = j - 1; y <= j + 1; y++) {
									if (board[x][y] !== undefined && (x !== i || y !== j)) {
										if (board[x][y] == "young" || board[x][y] == "old") {
											count++;
										}
									}
								}
							}
						}

						if (board[i][j] == "dead") {
							if (count == 3) copyBoard[i][j] = "young";
						} else {
							if (count < 2 || count > 3) {
								copyBoard[i][j] = "dead";
							} else {
								copyBoard[i][j] = "old";
							}
						}
					}
				}
				for (var i = 0; i < copyBoard.length; i++) {
					for (var j = 0; j < copyBoard[i].length; j++) {
						board[i][j] = copyBoard[i][j];
					}
				}
				innerBoard.setState({ board: board });
			}, speed);
		}
	}

	function checkStatus() {
		ndxs = this.id.split(",");
		cellState = board[ndxs[0]][ndxs[1]];
		if (cellState == "dead") {
			cellState = "young";
		} else {
			cellState = "dead";
		}
		copyBoard[ndxs[0]][ndxs[1]] = board[ndxs[0]][ndxs[1]] = cellState;
		innerBoard.setState({ board: board });
	}

	var Board = function (_React$Component) {
		_inherits(Board, _React$Component);

		function Board() {
			_classCallCheck(this, Board);

			var _this = _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).call(this));

			_this.state = { board: board };
			innerBoard = _this;
			return _this;
		}

		_createClass(Board, [{
			key: "render",
			value: function render() {
				{
					rows = [];
					for (var i = 0; i < innerBoard.state.board.length; i++) {
						rows.push(React.createElement(Row, { data: innerBoard.state.board, num: i }));
					}
				}

				return React.createElement(
					"div",
					{ id: "cells" },
					rows
				);
			}
		}]);

		return Board;
	}(React.Component);

	var Row = function (_React$Component2) {
		_inherits(Row, _React$Component2);

		function Row() {
			_classCallCheck(this, Row);

			return _possibleConstructorReturn(this, (Row.__proto__ || Object.getPrototypeOf(Row)).apply(this, arguments));
		}

		_createClass(Row, [{
			key: "render",
			value: function render() {
				{
					cells = [];
					for (var i = 0; i < this.props.data[this.props.num].length; i++) {
						cells.push(React.createElement("div", {
							className: "cell " + this.props.data[this.props.num][i],
							id: this.props.num + "," + i
						}));
					}
				}
				return React.createElement(
					"div",
					{ className: "row" },
					cells
				);
			}
		}]);

		return Row;
	}(React.Component);

	setSize(70, 50, true);
	ReactDOM.render(React.createElement(Board, null), document.getElementById("board"));
	$("#run").trigger("click");
});
