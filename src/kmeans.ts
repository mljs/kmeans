import { squaredEuclidean } from 'ml-distance-euclidean';

import { KMeansResult } from './KMeansResult';
import { assertUnreachable, validateKmeansInput } from './assert';
import { mostDistant, random, kmeanspp } from './initialization';
import {
  updateClusterID,
  updateCenters,
  hasConverged,
  calculateDistanceMatrix,
} from './utils';

const defaultOptions = {
  maxIterations: 100,
  tolerance: 1e-6,
  initialization: 'kmeans++' as InitializationMethod,
  distanceFunction: squaredEuclidean,
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

export type InitializationMethod = 'kmeans++' | 'random' | 'mostDistant';
export interface OptionsWithDefault {
  distanceFunction?: (p: number[], q: number[]) => number;
  tolerance?: number;
  initialization?: InitializationMethod | number[][];
  maxIterations?: number;
}

export interface OptionsWithoutDefault {
  seed?: number;
}

export type Options = OptionsWithDefault & OptionsWithoutDefault;
type DefinedOptions = Required<OptionsWithDefault> & OptionsWithoutDefault;

function step(
  centers: number[][],
  data: number[][],
  clusterID: number[],
  K: number,
  options: DefinedOptions,
  iterations: number,
): KMeansResult {
  clusterID = updateClusterID(
    data,
    centers,
    clusterID,
    options.distanceFunction,
  );
  let newCenters: number[][] = updateCenters(centers, data, clusterID, K);
  let converged = hasConverged(
    newCenters,
    centers,
    options.distanceFunction,
    options.tolerance,
  );
  return new KMeansResult(
    clusterID,
    newCenters,
    converged,
    iterations,
    options.distanceFunction,
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
export function* kmeansGenerator(
  data: number[][],
  K: number,
  options: Options,
) {
  const definedOptions = getDefinedOptions(options);
  validateKmeansInput(data, K);
  let centers = initializeCenters(data, K, definedOptions);
  let clusterID: number[] = new Array(data.length);

  let converged = false;
  let stepNumber = 0;
  let stepResult;
  while (!converged && stepNumber < definedOptions.maxIterations) {
    stepResult = step(
      centers,
      data,
      clusterID,
      K,
      definedOptions,
      ++stepNumber,
    );
    yield stepResult;
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
export function kmeans(data: number[][], K: number, options: Options) {
  const definedOptions = getDefinedOptions(options);

  validateKmeansInput(data, K);
  let centers = initializeCenters(data, K, definedOptions);

  // infinite loop until convergence
  if (definedOptions.maxIterations === 0) {
    definedOptions.maxIterations = Number.MAX_VALUE;
  }

  let clusterID: number[] = new Array(data.length);
  let converged = false;
  let stepNumber = 0;
  let stepResult;
  while (!converged && stepNumber < definedOptions.maxIterations) {
    stepResult = step(
      centers,
      data,
      clusterID,
      K,
      definedOptions,
      ++stepNumber,
    );
    converged = stepResult.converged;
    centers = stepResult.centroids;
  }
  if (!stepResult) {
    throw new Error('unreachable: no kmeans step executed');
  }
  return stepResult;
}

function initializeCenters(
  data: number[][],
  K: number,
  options: DefinedOptions,
) {
  let centers: number[][];
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
          options.seed,
        );
        break;
      default:
        assertUnreachable(
          options.initialization,
          'Unknown initialization method',
        );
    }
  }
  return centers;
}

function getDefinedOptions(options: Options): DefinedOptions {
  return { ...defaultOptions, ...options };
}
