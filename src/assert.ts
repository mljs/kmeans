export function assertUnreachable(x: never, message: string): never {
  throw new Error(`${message}: "${String(x)}"`);
}

export function validateKmeansInput(data: number[][], K: number) {
  if (K <= 0 || K > data.length || !Number.isInteger(K)) {
    throw new Error(
      'K should be a positive integer smaller than the number of points',
    );
  }
}
