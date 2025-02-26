import React, { useState } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameHistory, setGameHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);

  // CSS styles defined inline
  const styles = {
    game: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "20px",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    board: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 100px)",
      gridTemplateRows: "repeat(3, 100px)",
      gap: "5px",
      marginBottom: "20px",
    },
    square: {
      width: "100px",
      height: "100px",
      fontSize: "48px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "white",
      border: "2px solid #555",
      cursor: "pointer",
    },
    winningSquare: {
      background: "#d4edda",
    },
    status: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    resetButton: {
      padding: "10px 15px",
      fontSize: "16px",
      background: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    historyTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    historyList: {
      listStyle: "none",
      padding: 0,
    },
    historyItem: {
      marginBottom: "8px",
    },
    historyButton: {
      padding: "8px 12px",
      background: "#f0f0f0",
      border: "1px solid #ddd",
      borderRadius: "4px",
      cursor: "pointer",
    },
    activeHistoryButton: {
      background: "#007bff",
      color: "white",
    },
  };

  const calculateWinner = (squares) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line: lines[i] };
      }
    }

    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((square) => square !== null);

  const handleClick = (i) => {
    // Return early if game is won or square is filled
    if (calculateWinner(board) || board[i]) {
      return;
    }

    const newBoard = board.slice();
    newBoard[i] = xIsNext ? "X" : "O";

    // Update history and state
    const newHistory = gameHistory.slice(0, stepNumber + 1);
    newHistory.push(newBoard);

    setBoard(newBoard);
    setXIsNext(!xIsNext);
    setGameHistory(newHistory);
    setStepNumber(newHistory.length - 1);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setBoard(gameHistory[step]);
    setXIsNext(step % 2 === 0);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameHistory([Array(9).fill(null)]);
    setStepNumber(0);
  };

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner.winner}`;
    } else if (isDraw) {
      return "Game ended in a draw!";
    } else {
      return `Next player: ${xIsNext ? "X" : "O"}`;
    }
  };

  const renderSquare = (i) => {
    const isWinningSquare = winner && winner.line.includes(i);

    return (
      <button
        key={i}
        style={{
          ...styles.square,
          ...(isWinningSquare ? styles.winningSquare : {}),
        }}
        onClick={() => handleClick(i)}
      >
        {board[i]}
      </button>
    );
  };

  // Generate moves history list
  const moves = gameHistory.map((_, move) => {
    const desc = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move} style={styles.historyItem}>
        <button
          onClick={() => jumpTo(move)}
          style={{
            ...styles.historyButton,
            ...(stepNumber === move ? styles.activeHistoryButton : {}),
          }}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div style={styles.game}>
      <div>
        <div style={styles.status}>{getStatus()}</div>
        <div style={styles.board}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSquare(i))}
        </div>
        <button onClick={resetGame} style={styles.resetButton}>
          Reset Game
        </button>
      </div>

      <div>
        <h3 style={styles.historyTitle}>Game History</h3>
        <ol style={styles.historyList}>{moves}</ol>
      </div>
    </div>
  );
};

export default TicTacToe;
