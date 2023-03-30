import { useRef, useCallback, useEffect, useState } from "react";
import "./globalStyles.css";
import { useGameEngine } from "./hooks/useGameEngine";
import { paintSnake, paintFood, getRandomCoordinates } from "./utils";

function App() {
  const snake = useRef([
    { x: 13, y: 15 },
    { x: 13, y: 16 },
    { x: 13, y: 17 },
  ]);
  const food = useRef(null);
  const gameBoard = useRef(null);
  const inputDir = useRef({ x: 0, y: -1 });
  const lastSnakeMoveTimeRef = useRef(0);
  const speed = 150;

  const [gameStatus, setGameStatus] = useState("idle"); // idle, running, paused, over
  const [scoreBoard, setScoreBoard] = useState({
    score: 0,
    highScore: +localStorage.getItem("hiscore") || 0,
  });

  const updateScore = useCallback(() => {
    setScoreBoard((prev) => {
      const newScore = prev.score + 1;
      const newHighScore =
        newScore > prev.highScore ? newScore : prev.highScore;

      localStorage.setItem("hiscore", JSON.stringify(newHighScore));

      return { score: newScore, highScore: newHighScore };
    });
  }, []);

  const updateData = useCallback(() => {
    // check if snake has collided with itself
    const hasCollidedWithItself = snake.current.some((snakePart, index) => {
      if (index === 0) return false;
      return (
        snakePart.x === snake.current[0].x && snakePart.y === snake.current[0].y
      );
    });

    // check if snake has collided with walls
    const hasCollidedWithWalls =
      snake.current[0].x < 0 ||
      snake.current[0].x > 27 ||
      snake.current[0].y < 0 ||
      snake.current[0].y > 21;
    if (hasCollidedWithWalls || hasCollidedWithItself) {
      console.log("Game Over");
      setGameStatus("over");
      return;
    }

    // move snake
    const newSnake = [...snake.current];
    const snakeHead = newSnake[0];
    const newSnakeHead = {
      x: snakeHead.x + inputDir.current.x,
      y: snakeHead.y + inputDir.current.y,
    };
    newSnake.unshift(newSnakeHead);

    // check if snake has eaten food
    const hasEatenFood =
      snakeHead.x === food.current.x && snakeHead.y === food.current.y;
    if (hasEatenFood) {
      // increase score
      updateScore();

      // remove old food
      const foodElement = document.querySelector(".food");
      gameBoard.current.removeChild(foodElement);

      // generate new food
      const newCoordinates = getRandomCoordinates();
      food.current = newCoordinates;
    } else {
      // remove tail
      newSnake.pop();
    }

    // update snake
    snake.current = newSnake;
  }, [updateScore]);

  const paintScreen = useCallback(() => {
    paintSnake(gameBoard.current, snake.current);
    paintFood(gameBoard.current, food.current);
  }, [gameBoard, snake, food]);

  const update = useCallback(
    (currentTime) => {
      const secondsSinceLastSnakeMove =
        currentTime - lastSnakeMoveTimeRef.current;
      if (secondsSinceLastSnakeMove > speed) {
        lastSnakeMoveTimeRef.current = currentTime;
        if (gameStatus === "running") updateData();
      }
      paintScreen();
    },
    [gameStatus, paintScreen, updateData]
  );

  useEffect(() => {
    // initialize food coordinates
    food.current = getRandomCoordinates();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (gameStatus === "idle") setGameStatus("running");
      switch (e.key) {
        case "ArrowUp":
          inputDir.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          inputDir.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          inputDir.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          inputDir.current = { x: 1, y: 0 };
          break;
        default:
          break;
      }
    });
  }, [gameStatus]);

  useGameEngine(update);

  return (
    <div className="App">
      <p className="heading">Snake Game</p>

      <div className="board" ref={gameBoard}>
        {gameStatus !== "running" && (
          <div className="gameStatus">
            {gameStatus === "over" && <p>Game Over</p>}
            {gameStatus === "paused" && (
              <p>Game paused, press any key to resume</p>
            )}
            {gameStatus === "idle" && <p>Press any key to start</p>}
          </div>
        )}

        <p className="score">Score: {scoreBoard.score}</p>
        <p className="highScore">High Score: {scoreBoard.highScore}</p>
      </div>

      <div className="controls">
        <button
          className="pause"
          disabled={gameStatus !== "running"}
          onClick={() => {
            if (gameStatus === "running") setGameStatus("paused");
          }}
        >
          Pause
        </button>
        <button
          className="resume"
          disabled={gameStatus !== "paused"}
          onClick={() => {
            if (gameStatus === "paused") setGameStatus("running");
          }}
        >
          Resume
        </button>

        <button
          className="reset"
          onClick={() => {
            setGameStatus("idle");
            setScoreBoard({ score: 0, highScore: scoreBoard.highScore });
            snake.current = [
              { x: 13, y: 15 },
              { x: 13, y: 16 },
              { x: 13, y: 17 },
            ];
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
