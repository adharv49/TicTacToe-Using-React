import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import "./TicTacToe.css";

function TicTacToe() {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState("multiplayer");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [width, height] = useWindowSize();

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  useEffect(() => {
    if (mode === "single" && !isPlayerTurn && !winner && !isDraw) {
      const timer = setTimeout(makeAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner, isDraw, mode]);

  function handleClick(index) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);

    if (mode === "single") {
      setIsPlayerTurn(false);
    } else {
      setIsXNext(!isXNext);
    }
  }

  function makeAIMove() {
    const bestMove = getBestMove(board);
    if (bestMove === -1) return;
    const newBoard = [...board];
    newBoard[bestMove] = "O";
    setBoard(newBoard);
    setIsPlayerTurn(true);
    setIsXNext(true);
  }

  function getBestMove(b) {
    const emptyIndices = b.map((val, idx) => (val === null ? idx : null)).filter((i) => i !== null);

    for (let i of emptyIndices) {
      const copy = [...b];
      copy[i] = "O";
      if (calculateWinner(copy) === "O") return i;
    }

    for (let i of emptyIndices) {
      const copy = [...b];
      copy[i] = "X";
      if (calculateWinner(copy) === "X") return i;
    }

    return emptyIndices.length > 0 ? emptyIndices[0] : -1;
  }

  function calculateWinner(b) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, bIdx, c] of lines) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  }

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw!"
    : mode === "single"
    ? `Next player: ${isPlayerTurn ? "You (X)" : "AI (O)"}`
    : `Next player: ${isXNext ? "X" : "O"}`;

  function resetGame() {
    setBoard(initialBoard);
    setIsXNext(true);
    setIsPlayerTurn(true);
  }

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  function handleModeChange(e) {
    setMode(e.target.value);
    resetGame();
  }

  return (
    <div className={`game-container ${darkMode ? "dark" : ""}`}>
      {winner && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300}
          gravity={0.3}
          recycle={false}
        />
      )}

      <div className="header">
        <h1 className="title">Tic-Tac-Toe</h1>
        <div className="controls">
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
          <select value={mode} onChange={handleModeChange} className="mode-select">
            <option value="multiplayer">Multiplayer</option>
            <option value="single">Single Player</option>
          </select>
        </div>
      </div>

      <div className="status">{status}</div>

      <div className="board">
        {board.map((value, idx) => (
          <button key={idx} className="cell" onClick={() => handleClick(idx)}>
            {value}
          </button>
        ))}
      </div>

      <button className="reset" onClick={resetGame}>Reset Game</button>

      {(winner || isDraw) && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{winner ? `🎉 ${mode === "single" && winner === "O" ? "AI Wins!" : `Player ${winner} Wins!`}` : "🤝 It's a Draw!"}</h2>
            <button className="play-again" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
