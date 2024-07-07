import { useState, useRef, useCallback, ChangeEvent } from "react";
import { COLS, createEmptyGrid, DIRECTIONS, ROWS } from "./utils/utils";
import { twMerge } from "tailwind-merge";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { Button } from "./components/Button";

function App() {
  const [grid, setGrid] = useState<number[][]>(createEmptyGrid());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [gameSpeed, setGameSpeed] = useState<number>(100);
  const [mousePosition, setMousePosition] = useState<[number][number] | null>(
    null
  );

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  const gameSpeedRef = useRef(gameSpeed);
  gameSpeedRef.current = gameSpeed;

  const runGameOfLife = useCallback(() => {
    if (!playingRef.current) {
      return;
    }

    setGrid((currentGrid) => {
      const newGrid = currentGrid.map((arr) => [...arr]);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          let liveNeighbors = 0;

          DIRECTIONS.forEach(([directionX, directionY]) => {
            const neighborRow = row + directionX;
            const neighborCol = col + directionY;

            if (
              neighborRow >= 0 &&
              neighborRow < ROWS &&
              neighborCol >= 0 &&
              neighborCol < COLS
            ) {
              liveNeighbors += currentGrid[neighborRow][neighborCol] ? 1 : 0;
            }
          });

          if (liveNeighbors < 2 || liveNeighbors > 3) {
            newGrid[row][col] = 0;
          } else if (currentGrid[row][col] === 0 && liveNeighbors === 3) {
            newGrid[row][col] = 1;
          }
        }
      }

      return newGrid;
    });

    setTimeout(runGameOfLife, gameSpeedRef.current);
  }, [playingRef, setGrid]);

  const handleMouseDown = (row: number, col: number) => {
    setIsMouseDown(true);
    toggleCellState(row, col);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const changeGameSpeed = (userSpeed: ChangeEvent<HTMLInputElement>) => {
    setGameSpeed(Number(userSpeed.target.value));
  };

  const toggleCellState = (rowToToggle: number, colToToggle: number) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === rowToToggle && colIndex === colToToggle
          ? cell
            ? 0
            : 1
          : cell
      )
    );
    setGrid(newGrid);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isMouseDown) {
      toggleCellState(row, col); //toggle the cell state
    }
    setMousePosition([row | null, col | null]);
  };

  return (
    <div className="h-screen w-screen flex items-center p-4 bg-blue-500 flex-col gap-4">
      <h1 className="md:text-2xl text-xl">Conway's Game Of Life</h1>
      <div className="flex gap-4 items-center">
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying) {
              playingRef.current = true;
              runGameOfLife(); //run simulation
            }
          }}
        />
        <Button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < ROWS; i++) {
              rows.push(
                Array.from(Array(COLS), () => (Math.random() > 0.75 ? 1 : 0))
              );
            }
            setGrid(rows);
          }}
        >
          Seed
        </Button>
        <Button
          onClick={() => {
            setGrid(createEmptyGrid());
            setIsPlaying(false);
          }}
        >
          Clear
        </Button>
        <input type="range" min="1" max="1500" onChange={changeGameSpeed} />
        <p>{gameSpeed}</p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
          gridTemplateRows: `repeat(${ROWS}, 20px)`,
        }}
      >
        {grid.map((rows, originalRowIndex) =>
          rows.map((col, originalColIndex) => (
            <button
              type="button"
              onMouseDown={() =>
                handleMouseDown(originalRowIndex, originalColIndex)
              }
              onMouseUp={handleMouseUp}
              onMouseEnter={() => {
                handleMouseEnter(originalRowIndex, originalColIndex);
              }}
              // onClick={() => {
              //   toggleCellState(originalRowIndex, originalColIndex)
              //   ;
              // }}
              key={`${originalRowIndex}-${originalColIndex}`}
              className={twMerge(
                "border border-[#737275]",
                grid[originalRowIndex][originalColIndex]
                  ? "bg-[#ffffff]"
                  : "bg-[#000000]"
              )}
            />
          ))
        )}
      </div>
      <p className="w-full text-center ">{`mouse is in ${mousePosition[0]}:${mousePosition[1]}`}</p>
    </div>
  );
}

export default App;
