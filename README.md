# sumgrid

A small, dependency-free JavaScript module that generates "keep the numbers so every row and column adds up" puzzles and checks that each one has **exactly one answer**.

A puzzle is a grid of numbers from 1 to 9. The player strikes some numbers out. The numbers that are left must add up to the target of their row and the target of their column. A cell can be *golden*: it counts double when it is kept.

## Use

```js
const { makePuzzle, countSol } = require('./index.js');

const P = makePuzzle(4, 4, 1, 42);   // rows, columns, golden cells, seed
console.log(P.rowT, P.colT);         // the targets
console.log(countSol(P, 3).count);   // 1: exactly one answer
```

`node example.js` prints a sample grid. `npm test` generates 80 puzzles from 3x3 up to 6x6 and checks, for each one, that the solver finds one answer and that the stored answer meets every target.

## How it works

1. Pick random numbers, pick the golden cells and pick a hidden answer (which cells are kept).
2. Write the targets from the hidden answer, counting golden cells twice.
3. Count every way to meet all targets: for each row, list the keep-masks whose sum equals the row target, then search row by row and prune as soon as a column goes over its target.
4. Accept the puzzle only when the count is exactly 1. Otherwise draw again.

Generation is instant for grids up to 6x6, because rows are short and column sums prune the search early.

## Play it

The same generator runs in a free browser game: [play math puzzles online](https://cozypuzzlegames.com/math-puzzles/?utm_source=github&utm_medium=readme) (a garden-themed version with a guided first level, hints and undo). More puzzle games are listed at cozypuzzlegames.com.

## License

MIT
