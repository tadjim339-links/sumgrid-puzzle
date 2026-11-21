// sumgrid: generate "keep the numbers so every row and column adds up" puzzles that have exactly one answer.
// A grid holds numbers 1-9. A cell may be golden (counts double when kept). Targets are the row and column sums of the hidden answer.
'use strict';
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function mkPz(R, C, val, mult, sol) {
  const N = R * C, rowT = new Array(R).fill(0), colT = new Array(C).fill(0);
  for (let i = 0; i < N; i++) if (sol[i]) { const v = val[i] * mult[i]; rowT[(i / C) | 0] += v; colT[i % C] += v; }
  return { R, C, N, val, mult, sol, rowT, colT, goldN: mult.filter(m => m > 1).length };
}
/* count the ways to keep packets so every sign is met (stops at `limit`); `first` is the first one found (1 = kept) */
function countSol(Pz, limit) {
  const { R, C, val, mult, rowT, colT } = Pz, opts = [];
  for (let r = 0; r < R; r++) { const o = []; for (let m = 0; m < (1 << C); m++) { let s = 0; for (let c = 0; c < C; c++) if (m >> c & 1) s += val[r * C + c] * mult[r * C + c]; if (s === rowT[r]) o.push(m); } opts.push(o); }
  const col = new Array(C).fill(0), pick = []; let count = 0, first = null;
  function rec(r) {
    if (r === R) { for (let c = 0; c < C; c++) if (col[c] !== colT[c]) return false; count++; if (!first) first = pick.slice(); return count >= limit; }
    for (const m of opts[r]) {
      let ok = true; for (let c = 0; c < C; c++) if (m >> c & 1) { col[c] += val[r * C + c] * mult[r * C + c]; if (col[c] > colT[c]) ok = false; }
      pick.push(m);
      if (ok && rec(r + 1)) return true;
      pick.pop(); for (let c = 0; c < C; c++) if (m >> c & 1) col[c] -= val[r * C + c] * mult[r * C + c];
    }
    return false;
  }
  rec(0); return { count, first };
}
function makePuzzle(R, C, gold, seed) {
  const N = R * C;
  for (let att = 0; att < 400; att++) {
    const r = rng(seed + att * 7717), val = [], mult = new Array(N).fill(1), sol = [];
    for (let i = 0; i < N; i++) { val.push(1 + Math.floor(r() * 9)); sol.push(r() < .56 ? 1 : 0); }
    for (let k = 0; k < gold; k++) { let i; do { i = Math.floor(r() * N); } while (mult[i] > 1); mult[i] = 2; }
    const kept = sol.reduce((a, b) => a + b, 0); if (kept > N * .72 || kept < N * .4) continue;
    let fine = true;
    for (let q = 0; q < R && fine; q++) { let k = 0; for (let c = 0; c < C; c++) k += sol[q * C + c]; if (k < 1 || k === C) fine = false; }
    for (let c = 0; c < C && fine; c++) { let k = 0; for (let q = 0; q < R; q++) k += sol[q * C + c]; if (k < 1 || k === R) fine = false; }
    if (!fine) continue;
    const Pz = mkPz(R, C, val, mult, sol), s = countSol(Pz, 2);
    if (s.count === 1) return Pz;
  }
  return null;
}

module.exports = { rng, mkPz, countSol, makePuzzle };
