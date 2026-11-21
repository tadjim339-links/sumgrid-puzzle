const assert = require('assert');
const { makePuzzle, countSol } = require('./index.js');
for (const [R, C, gold] of [[3, 3, 0], [4, 4, 1], [5, 5, 2], [6, 6, 3]]) {
  for (let seed = 1; seed <= 20; seed++) {
    const P = makePuzzle(R, C, gold, seed);
    assert(P, `no puzzle for ${R}x${C} seed ${seed}`);
    assert.strictEqual(countSol(P, 3).count, 1, 'exactly one answer');
    assert.strictEqual(P.goldN, gold);
    // the stored answer meets every target when golden cells count twice
    const rows = new Array(R).fill(0), cols = new Array(C).fill(0);
    P.sol.forEach((k, i) => { if (k) { const v = P.val[i] * P.mult[i]; rows[(i / C) | 0] += v; cols[i % C] += v; } });
    assert.deepStrictEqual(rows, P.rowT); assert.deepStrictEqual(cols, P.colT);
  }
}
console.log('all sumgrid tests passed');
