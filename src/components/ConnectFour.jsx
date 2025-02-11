import React, { useState, useCallback } from "react";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "630px",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    padding: "16px",
    backgroundColor: "#2563EB",
    borderRadius: "8px",
  },
  cell: {
    width: "70px",
    height: "70px",
    backgroundColor: "white",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  status: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1F2937",
  },
};

const ConnectFour = () => {
  const ROWS = 6;
  const COLS = 7;
  const initialBoard = Array(ROWS)
    .fill()
    .map(() => Array(COLS).fill(null));

  const [board, setBoard] = useState(initialBoard);
  const [isRedNext, setIsRedNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const checkWin = useCallback((board, row, col, player) => {
    // Check horizontal
    for (let c = 0; c <= COLS - 4; c++) {
      for (let r = 0; r < ROWS; r++) {
        if (
          board[r][c] === player &&
          board[r][c + 1] === player &&
          board[r][c + 2] === player &&
          board[r][c + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check vertical
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r <= ROWS - 4; r++) {
        if (
          board[r][c] === player &&
          board[r + 1][c] === player &&
          board[r + 2][c] === player &&
          board[r + 3][c] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (positive slope)
    for (let c = 0; c <= COLS - 4; c++) {
      for (let r = 0; r <= ROWS - 4; r++) {
        if (
          board[r][c] === player &&
          board[r + 1][c + 1] === player &&
          board[r + 2][c + 2] === player &&
          board[r + 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (negative slope)
    for (let c = 0; c <= COLS - 4; c++) {
      for (let r = 3; r < ROWS; r++) {
        if (
          board[r][c] === player &&
          board[r - 1][c + 1] === player &&
          board[r - 2][c + 2] === player &&
          board[r - 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const checkDraw = (board) => {
    return board[0].every((cell) => cell !== null);
  };

  const getLowestEmptyRow = (col) => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  const handleClick = (col) => {
    if (gameOver) return;

    const row = getLowestEmptyRow(col);
    if (row === -1) return;

    const newBoard = board.map((row) => [...row]);
    const currentPlayer = isRedNext ? "red" : "yellow";
    newBoard[row][col] = currentPlayer;

    setBoard(newBoard);

    if (checkWin(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      setGameOver(true);
      return;
    }

    if (checkDraw(newBoard)) {
      setGameOver(true);
      return;
    }

    setIsRedNext(!isRedNext);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsRedNext(true);
    setWinner(null);
    setGameOver(false);
  };

  const getCellStyle = (value) => ({
    ...styles.cell,
    backgroundColor: value === null ? "white" : value,
    cursor: gameOver ? "default" : "pointer",
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.status}>
          {winner
            ? `${winner === "red" ? "Red" : "Yellow"} wins!`
            : gameOver
            ? "It's a draw!"
            : `${isRedNext ? "Red" : "Yellow"}'s turn`}
        </div>
        <button onClick={resetGame} style={styles.button}>
          New Game
        </button>
      </div>

      <div style={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={getCellStyle(cell)}
              onClick={() => handleClick(colIndex)}
              onMouseEnter={(e) => {
                if (!gameOver && getLowestEmptyRow(colIndex) !== -1) {
                  e.target.style.backgroundColor = isRedNext
                    ? "#FEE2E2"
                    : "#FEF3C7";
                }
              }}
              onMouseLeave={(e) => {
                if (!gameOver && cell === null) {
                  e.target.style.backgroundColor = "white";
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectFour;
