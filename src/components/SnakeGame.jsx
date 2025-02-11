import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

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
    width: "100%",
    maxWidth: "400px",
    marginBottom: "1rem",
  },
  score: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#3B82F6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  gameBoard: {
    position: "relative",
    backgroundColor: "#F3F4F6",
    border: "2px solid #D1D5DB",
  },
  snakeSegment: {
    position: "absolute",
    backgroundColor: "#22C55E",
  },
  food: {
    position: "absolute",
    backgroundColor: "#EF4444",
    borderRadius: "50%",
  },
  gameOver: {
    marginTop: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#EF4444",
  },
  pausedText: {
    marginTop: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#3B82F6",
  },
  instructions: {
    marginTop: "1rem",
    fontSize: "0.875rem",
    color: "#4B5563",
  },
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    const isOnSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );

    if (isOnSnake) {
      return generateFood();
    }

    return newFood;
  }, [snake]);

  const checkCollision = (head) => {
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    return snake.some(
      (segment, index) =>
        index !== 0 && segment.x === head.x && segment.y === head.y
    );
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const head = { ...snake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    const newSnake = [head];
    const ateFood = head.x === food.x && head.y === food.y;

    if (ateFood) {
      setScore((prev) => prev + 1);
      setFood(generateFood());
      newSnake.push(...snake);
    } else {
      newSnake.push(...snake.slice(0, -1));
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, generateFood]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "p") {
        setIsPaused((prev) => !prev);
        return;
      }

      if (gameOver || isPaused) return;

      const keyDirections = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };

      const newDirection = keyDirections[e.key];
      if (!newDirection) return;

      const opposites = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };

      if (opposites[newDirection] !== direction) {
        setDirection(newDirection);
      }
    },
    [direction, gameOver, isPaused]
  );

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.score}>Score: {score}</div>
        <button onClick={resetGame} style={styles.button}>
          New Game
        </button>
      </div>

      <div
        style={{
          ...styles.gameBoard,
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              ...styles.snakeSegment,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              borderRadius: index === 0 ? "4px" : "2px",
            }}
          />
        ))}

        <div
          style={{
            ...styles.food,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
          }}
        />
      </div>

      {gameOver && (
        <div style={styles.gameOver}>Game Over! Final Score: {score}</div>
      )}

      {isPaused && <div style={styles.pausedText}>Game Paused</div>}

      <div style={styles.instructions}>
        Use arrow keys to move • Press 'P' to pause
      </div>
    </div>
  );
};

export default SnakeGame;
