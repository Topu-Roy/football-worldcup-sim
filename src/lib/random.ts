/** Standard-normal random value via Box-Muller. */
export function gauss(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Symmetric Gaussian swing clamped to ±range (per-player form modifier). */
export function formRoll(range: number): number {
  return clamp(gauss() * (range / 3), -range, range);
}

/** Logistic activation: maps any real number to a probability in (0, 1). */
export function logistic(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/** Number of successes in n independent Bernoulli trials. */
export function binomial(n: number, p: number): number {
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) count += 1;
  }
  return count;
}

/** Constrain a value to the inclusive [min, max] range. */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Random draw from a Poisson distribution (used for shot counts). */
export function poisson(mean: number): number {
  const L = Math.exp(-mean);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

/** Uniformly random element of an array. */
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Fisher-Yates shuffle of a copy of the array. */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
