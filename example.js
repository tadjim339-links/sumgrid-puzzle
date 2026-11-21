const { makePuzzle } = require('./index.js');
const P = makePuzzle(4, 4, 1, 42);
console.log('row targets   :', P.rowT.join(' '));
console.log('column targets:', P.colT.join(' '));
for (let r = 0; r < P.R; r++) console.log(P.val.slice(r * P.C, (r + 1) * P.C).map((v, c) => (P.mult[r * P.C + c] > 1 ? v + '*' : v + ' ')).join(' '));
console.log('(* = golden, counts double when kept)');
