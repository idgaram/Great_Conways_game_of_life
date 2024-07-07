import { useState, useRef, useCallback } from "react";
import { COLS, createEmptyGrid, DIRECTIONS, ROWS } from "./utils/utils";
import { twMerge } from "tailwind-merge";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { Button } from "./components/Button";

function App() {
  const [grid, setGrid] = useState<number[][]>(createEmptyGrid());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

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

    setTimeout(runGameOfLife, 100);
  }, [playingRef, setGrid]);

  //   const handleMouseDown = () => {
  //     setIsMouseDown(true);
  //   };

  //   const handleMouseUp = () => {
  //     setIsMouseDown(false);
  //   };

  //   const toggleCellState = (rowToToggle: number, colToToggle: number) =>{
  //     const newGrid = grid.map((row,rowIndex) =>{

  //     })
  //   }

  //   const handleMouseEnter = (row: number, col: number) =>{
  //     if (isMouseDown) {
  // //toggle the cell state

  //     }
  //   }

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
    </div>
  );
}

export default App;
