export const ROWS = 30;
export const COLS = 50;

export const createEmptyGrid = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

export const DIRECTIONS = [
  [0, 1], //right
  [1, 1], //down right
  [1, 0], //down
  [1, -1], //down left
  [0, -1], //left
  [-1, -1], //up let
  [-1, 0], //up
  [-1, 1], //up right
];
