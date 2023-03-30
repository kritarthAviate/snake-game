export const paintSnake = (gameBoard, snake) => {
  if (!gameBoard) return;

  for (const node of gameBoard.childNodes) {
    if (
      node.classList.value === "snakeHead" ||
      node.classList.value === "snakeBody"
    ) {
      gameBoard.removeChild(node);
    }
  }

  snake.forEach((e, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) snakeElement.classList.add("snakeHead");
    else snakeElement.classList.add("snakeBody");
    gameBoard.appendChild(snakeElement);
  });
};

export const paintFood = (gameBoard, food) => {
  if (!gameBoard) return;

  let foodExists = false;
  for (const node of gameBoard.childNodes) {
    if (node.classList.value === "food") {
      foodExists = true;
      break;
    }
  }

  if (!foodExists) {
    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
  }
};

export const getRandomCoordinates = () => {
  let newFoodCoordinates = {
    x: Math.floor(Math.random() * 27) + 1,
    y: Math.floor(Math.random() * 21) + 1,
  };
  console.log({ newFoodCoordinates });
  return newFoodCoordinates;
};
