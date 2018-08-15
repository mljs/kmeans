import { squaredEuclidean } from 'ml-distance-euclidean';

import {
  updateClusterID,
  updateCenters,
  hasConverged,
  calculateDistanceMatrix
} from './utils';
import { mostDistant, random, kmeanspp } from './initialization';
import KMeansResult from './KMeansResult';

const defaultOptions = {
  maxIterations: 100,
  tolerance: 1e-6,
  withIterations: false,
  initialization: 'kmeans++',
  distanceFunction: squaredEuclidean
};

/**
 * Each step operation for kmeans
 * @ignore
 * @param {Array<Array<number>>} centers - K centers in format [x,y,z,...]
 * @param {Array<Array<number>>} data - Points [x,y,z,...] to cluster
 * @param {Array<number>} clusterID - Cluster identifier for each data dot
 * @param {number} K - Number of clusters
 * @param {object} [options] - Option object
 * @param {number} iterations - Current number of iterations
 * @return {KMeansResult}
 */
function step(centers, data, clusterID, K, options, iterations) {
  clusterID = updateClusterID(
    data,
    centers,
    clusterID,
    options.distanceFunction
  );
  var newCenters = updateCenters(centers, data, clusterID, K);
  var converged = hasConverged(
    newCenters,
    centers,
    options.distanceFunction,
    options.tolerance
  );
  return new KMeansResult(
    clusterID,
    newCenters,
    converged,
    iterations,
    options.distanceFunction
  );
}

/**
 * Generator version for the algorithm
 * @ignore
 * @param {Array<Array<number>>} centers - K centers in format [x,y,z,...]
 * @param {Array<Array<number>>} data - Points [x,y,z,...] to cluster
 * @param {Array<number>} clusterID - Cluster identifier for each data dot
 * @param {number} K - Number of clusters
 * @param {object} [options] - Option object
 */
function* kmeansGenerator(centers, data, clusterID, K, options) {
  var converged = false;
  var stepNumber = 0;
  var stepResult;
  while (!converged && stepNumber < options.maxIterations) {
    stepResult = step(centers, data, clusterID, K, options, ++stepNumber);
    yield stepResult.computeInformation(data);
    converged = stepResult.converged;
    centers = stepResult.centroids;
  }
}

/**
 * K-means algorithm
 * @param {Array<Array<number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {number} K - Number of clusters
 * @param {object} [options] - Option object
 * @param {number} [options.maxIterations = 100] - Maximum of iterations allowed
 * @param {number} [options.tolerance = 1e-6] - Error tolerance
 * @param {boolean} [options.withIterations = false] - Store clusters and centroids for each iteration
 * @param {function} [options.distanceFunction = squaredDistance] - Distance function to use between the points
 * @param {number} [options.seed] - Seed for random initialization.
 * @param {string|Array<Array<number>>} [options.initialization = 'kmeans++'] - K centers in format [x,y,z,...] or a method for initialize the data:
 *  * You can either specify your custom start centroids, or select one of the following initialization method:
 *  * `'kmeans++'` will use the kmeans++ method as described by http://ilpubs.stanford.edu:8090/778/1/2006-13.pdf
 *  * `'random'` will choose K random different values.
 *  * `'mostDistant'` will choose the more distant points to a first random pick
 * @return {KMeansResult} - Cluster identifier for each data dot and centroids with the following fields:
 *  * `'clusters'`: Array of indexes for the clusters.
 *  * `'centroids'`: Array with the resulting centroids.
 *  * `'iterations'`: Number of iterations that took to converge
 */
export default function kmeans(data, K, options) {
  options = Object.assign({}, defaultOptions, options);

  if (K <= 0 || K > data.length || !Number.isInteger(K)) {
    throw new Error(
      'K should be a positive integer smaller than the number of points'
    );
  }

  var centers;
  if (Array.isArray(options.initialization)) {
    if (options.initialization.length !== K) {
      throw new Error('The initial centers should have the same length as K');
    } else {
      centers = options.initialization;
    }
  } else {
    switch (options.initialization) {
      case 'kmeans++':
        centers = kmeanspp(data, K, options);
        break;
      case 'random':
        centers = random(data, K, options.seed);
        break;
      case 'mostDistant':
        centers = mostDistant(
          data,
          K,
          calculateDistanceMatrix(data, options.distanceFunction),
          options.seed
        );
        break;
      default:
        throw new Error(
          `Unknown initialization method: "${options.initialization}"`
        );
    }
  }

  // infinite loop until convergence
  if (options.maxIterations === 0) {
    options.maxIterations = Number.MAX_VALUE;
  }

  var clusterID = new Array(data.length);
  if (options.withIterations) {
    return kmeansGenerator(centers, data, clusterID, K, options);
  } else {
    var converged = false;
    var stepNumber = 0;
    var stepResult;
    while (!converged && stepNumber < options.maxIterations) {
      stepResult = step(centers, data, clusterID, K, options, ++stepNumber);
      converged = stepResult.converged;
      centers = stepResult.centroids;
    }
    return stepResult.computeInformation(data);
  }
}
