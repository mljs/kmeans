/**
 * Throws an error for an unreachable branch, ensuring exhaustive handling at compile time.
 * @ignore
 * @param x - The value that should never occur.
 * @param message - Message prefix for the thrown error.
 */
export function assertUnreachable(x: never, message: string): never {
  throw new Error(`${message}: "${String(x)}"`);
}

/**
 * Validates the inputs of the kmeans algorithm and throws if they are invalid.
 * @ignore
 * @param data - Points in the format to cluster [x,y,z,...].
 * @param K - Number of clusters.
 */
export function validateKmeansInput(data: number[][], K: number) {
  if (K <= 0 || K > data.length || !Number.isInteger(K)) {
    throw new Error(
      'K should be a positive integer smaller than the number of points',
    );
  }
}
