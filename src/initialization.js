import Random from 'ml-random';
import { squaredEuclidean } from 'ml-distance-euclidean';
import { Matrix } from 'ml-matrix';

/**
 * Choose K different random points from the original data
 * @ignore
 * @param {Array<Array<number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {number} K - number of clusters
 * @param {number} seed - seed for random number generation
 * @return {Array<Array<number>>} - Initial random points
 */
export function random(data, K, seed) {
  const random = new Random(seed);
  return random.choice(data, { size: K });
}

/**
 * Chooses the most distant points to a first random pick
 * @ignore
 * @param {Array<Array<number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {number} K - number of clusters
 * @param {Array<Array<number>>} distanceMatrix - matrix with the distance values
 * @param {number} seed - seed for random number generation
 * @return {Array<Array<number>>} - Initial random points
 */
export function mostDistant(data, K, distanceMatrix, seed) {
  const random = new Random(seed);
  var ans = new Array(K);
  // chooses a random point as initial cluster
  ans[0] = Math.floor(random.random() * data.length);

  if (K > 1) {
    // chooses the more distant point
    var maxDist = { dist: -1, index: -1 };
    for (var l = 0; l < data.length; ++l) {
      if (distanceMatrix[ans[0]][l] > maxDist.dist) {
        maxDist.dist = distanceMatrix[ans[0]][l];
        maxDist.index = l;
      }
    }
    ans[1] = maxDist.index;

    if (K > 2) {
      // chooses the set of points that maximises the min distance
      for (var k = 2; k < K; ++k) {
        var center = { dist: -1, index: -1 };
        for (var m = 0; m < data.length; ++m) {
          // minimum distance to centers
          var minDistCent = { dist: Number.MAX_VALUE, index: -1 };
          for (var n = 0; n < k; ++n) {
            if (
              distanceMatrix[n][m] < minDistCent.dist &&
              ans.indexOf(m) === -1
            ) {
              minDistCent = {
                dist: distanceMatrix[n][m],
                index: m
              };
            }
          }

          if (
            minDistCent.dist !== Number.MAX_VALUE &&
            minDistCent.dist > center.dist
          ) {
            center = Object.assign({}, minDistCent);
          }
        }

        ans[k] = center.index;
      }
    }
  }

  return ans.map((index) => data[index]);
}

// Implementation inspired from scikit
export function kmeanspp(X, K, options = {}) {
  X = new Matrix(X);
  const nSamples = X.length;
  const random = new Random(options.seed);
  // Set the number of trials
  const centers = [];
  const localTrials = options.localTrials || 2 + Math.floor(Math.log(K));

  // Pick the first center at random from the dataset
  const firstCenterIdx = random.randInt(nSamples);
  centers.push(X[firstCenterIdx].slice());

  // Init closest distances
  let closestDistSquared = [X.map((x) => squaredEuclidean(x, centers[0]))];
  let cumSumClosestDistSquared = [cumSum(closestDistSquared[0])];
  const factor = 1 / cumSumClosestDistSquared[0][nSamples - 1];
  let probabilities = Matrix.mul(closestDistSquared, factor);

  // Iterate over the remaining centers
  for (let i = 1; i < K; i++) {
    const candidateIdx = random.choice(nSamples, {
      replace: true,
      size: localTrials,
      probabilities: probabilities[0]
    });

    const candidates = X.selection(candidateIdx, range(X[0].length));
    const distanceToCandidates = euclidianDistances(candidates, X);

    let bestCandidate;
    let bestPot;
    let bestDistSquared;

    for (let j = 0; j < localTrials; j++) {
      const newDistSquared = Matrix.min(closestDistSquared, [distanceToCandidates[j]]);
      const newPot = newDistSquared.sum();
      if (bestCandidate === undefined || newPot < bestPot) {
        bestCandidate = candidateIdx[j];
        bestPot = newPot;
        bestDistSquared = newDistSquared;
      }
    }
    centers[i] = X[bestCandidate].slice();
    closestDistSquared = bestDistSquared;
    cumSumClosestDistSquared = [cumSum(closestDistSquared[0])];
    probabilities = Matrix.mul(
      closestDistSquared,
      1 / cumSumClosestDistSquared[0][nSamples - 1]
    );
  }
  return centers;
}

function euclidianDistances(A, B) {
  const result = new Matrix(A.length, B.length);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B.length; j++) {
      result.set(i, j, squaredEuclidean(A.getRow(i), B.getRow(j)));
    }
  }
  return result;
}

function range(l) {
  let r = [];
  for (let i = 0; i < l; i++) {
    r.push(i);
  }
  return r;
}

function cumSum(arr) {
  let cumSum = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    cumSum[i] = cumSum[i - 1] + arr[i];
  }
  return cumSum;
}
