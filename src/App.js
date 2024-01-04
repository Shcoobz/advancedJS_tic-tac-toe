import React from 'react';
import { useState } from 'react';

/**
 * React component representing a single square in the Tic-Tac-Toe board.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.value - The value of the square ('X', 'O', or null).
 * @param {function} props.onSquareClick - The function to call when the square is clicked.
 * @param {boolean} props.isWinningSquare - Indicates if the square is part of the winning line.
 * @returns {JSX.Element} A React component.
 */
function Square({ value, onSquareClick, isWinningSquare }) {
  const className = 'square' + (isWinningSquare ? ' winning' : '');

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * Calculates the winner of the Tic-Tac-Toe game.
 *
 * @param {Array<string|null>} squares - An array representing the game board state.
 * @returns {Object} An object with the winner and the winning line (if any).
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: [] };
}

/**
 * React component representing the Tic-Tac-Toe game board.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.xIsNext - Indicates if it's X's turn.
 * @param {Array<string|null>} props.squares - An array representing the game board state.
 * @param {function} props.onPlay - The function to call when a square is played.
 * @param {number} props.currentMove - The current move number.
 * @returns {JSX.Element} A React component.
 */
function Board({ xIsNext, squares, onPlay, currentMove }) {
  const winner = calculateWinner(squares);

  function handleClick(i) {
    const location = [(i / 3) >> 0, i % 3];

    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, location);
  }

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={winner.line.includes(i)}
      />
    );
  }

  function generateBoard() {
    const boardSize = Math.sqrt(squares.length);
    let board = [];

    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push(renderSquare(i * boardSize + j));
      }
      board.push(
        <div key={i} className='board-row'>
          {row}
        </div>
      );
    }
    return board;
  }

  return generateBoard();
}

/**
 * React component representing the entire Tic-Tac-Toe game.
 *
 * @returns {JSX.Element} A React component.
 */
export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortAsc] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const restartButton = 'Reset Game';

  let status;
  let sortedMoves;

  function getStatus(params) {
    const winner = calculateWinner(currentSquares);

    if (winner.winner) {
      status = 'Winner: ' + winner.winner;
    } else if (currentSquares.every((sq) => sq !== null)) {
      status = 'Draw!';
    } else {
      status =
        'Next player: ' +
        (xIsNext ? 'X' : 'O') +
        (currentMove > 0 ? `\nMove: ${currentMove}` : '');
    }
    return status;
  }

  function handlePlay(nextSquares, location) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    const newHistory = history.slice(0, nextMove + 1);
    setHistory(newHistory);
  }

  function handleSortToggle() {
    setSortAsc(!sortAsc);
  }

  function generateMoves() {
    const moves = history.map((square, move) => {
      if (move === 0) return null;

      const description = `Move: ${move} @ ${square.location}`;

      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    });

    return moves;
  }

  sortedMoves = sortAsc ? generateMoves() : generateMoves().reverse();

  const gameStructure = (
    <div className='game'>
      <div className='game-board'>
        <div className='game-controls'>
          <button className='toggle-btn' onClick={handleSortToggle}>
            Toggle Sorting
          </button>
          <button className='reset-game-btn' onClick={() => jumpTo(0)}>
            {restartButton}
          </button>
          <div className='status'>{getStatus()}</div>
        </div>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className='game-info'>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );

  return gameStructure;
}
