export function gauss(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function formRoll(range: number): number {
  return clamp(gauss() * (range / 3), -range, range);
}

export function logistic(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function binomial(n: number, p: number): number {
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) count += 1;
  }
  return count;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
