import nearestVector from 'ml-nearest-vector';

/**
 * Calculates the distance matrix for a given array of points
 * @ignore
 * @param {Array<Array<number>>} data - the [x,y,z,...] points to cluster
 * @param {function} distance - Distance function to use between the points
 * @return {Array<Array<number>>} - matrix with the distance values
 */
export function calculateDistanceMatrix(
  data: number[][],
  distance: (a: number[], b: number[]) => number,
) {
  let distanceMatrix: number[][] = new Array(data.length);
  for (let i = 0; i < data.length; ++i) {
    for (let j = i; j < data.length; ++j) {
      if (!distanceMatrix[i]) {
        distanceMatrix[i] = new Array(data.length);
      }
      if (!distanceMatrix[j]) {
        distanceMatrix[j] = new Array(data.length);
      }
      const dist = distance(data[i], data[j]);
      distanceMatrix[i][j] = dist;
      distanceMatrix[j][i] = dist;
    }
  }
  return distanceMatrix;
}

/**
 * Updates the cluster identifier based in the new data
 * @ignore
 * @param {Array<Array<number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Array<number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array <number>} clusterID - the cluster identifier for each data dot
 * @param {function} distance - Distance function to use between the points
 * @return {Array} the cluster identifier for each data dot
 */
export function updateClusterID(
  data: number[][],
  centers: number[][],
  clusterID: number[],
  distance: (a: number[], b: number[]) => number,
): number[] {
  for (let i = 0; i < data.length; i++) {
    clusterID[i] = nearestVector(centers, data[i], {
      distanceFunction: distance,
    });
  }
  return clusterID;
}

/**
 * Update the center values based in the new configurations of the clusters
 * @ignore
 * @param {Array<Array<number>>} prevCenters - Centroids from the previous iteration
 * @param {Array <Array <number>>} data - the [x,y,z,...] points to cluster
 * @param {Array <number>} clusterID - the cluster identifier for each data dot
 * @param {number} K - Number of clusters
 * @return {Array} he K centers in format [x,y,z,...]
 */
export function updateCenters(
  prevCenters: number[][],
  data: number[][],
  clusterID: number[],
  K: number,
): number[][] {
  const nDim = data[0].length;

  // copy previous centers
  let centers = new Array<number[]>(K);
  let centersLen = new Array<number>(K);
  for (let i = 0; i < K; i++) {
    centers[i] = new Array<number>(nDim);
    centersLen[i] = 0;
    for (let j = 0; j < nDim; j++) {
      centers[i][j] = 0;
    }
  }

  // add the value for all dimensions of the point
  for (let l = 0; l < data.length; l++) {
    centersLen[clusterID[l]]++;
    for (let dim = 0; dim < nDim; dim++) {
      centers[clusterID[l]][dim] += data[l][dim];
    }
  }

  // divides by length
  for (let id = 0; id < K; id++) {
    for (let d = 0; d < nDim; d++) {
      if (centersLen[id]) {
        centers[id][d] /= centersLen[id];
      } else {
        centers[id][d] = prevCenters[id][d];
      }
    }
  }
  return centers;
}

/**
 * The centers have moved more than the tolerance value?
 * @ignore
 * @param {Array<Array<number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<number>>} oldCenters - the K old centers in format [x,y,z,...]
 * @param {function} distanceFunction - Distance function to use between the points
 * @param {number} tolerance - Allowed distance for the centroids to move
 * @return {boolean}
 */
export function hasConverged(
  centers: number[][],
  oldCenters: number[][],
  distanceFunction: (a: number[], b: number[]) => number,
  tolerance: number,
): boolean {
  for (let i = 0; i < centers.length; i++) {
    if (distanceFunction(centers[i], oldCenters[i]) > tolerance) {
      return false;
    }
  }
  return true;
}
