'use strict';

const utils = require('./utils');
const init = require('./initialization');
const KMeansResult = require('./KMeansResult');
const squaredDistance = require('ml-distance-euclidean').squared;

const defaultOptions = {
    maxIterations: 100,
    tolerance: 1e-6,
    withIterations: false,
    initialization: 'mostDistant',
    distanceFunction: squaredDistance
};

/**
 * Each step operation for kmeans
 * @ignore
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 * @param {Number} iterations - Current number of iterations
 * @return {KMeansResult}
 */
function step(centers, data, clusterID, K, options, iterations) {
    clusterID = utils.updateClusterID(data, centers, clusterID, options.distanceFunction);
    var newCenters = utils.updateCenters(data, clusterID, K);
    var converged = utils.converged(newCenters, centers, options.distanceFunction, options.tolerance);
    return new KMeansResult(clusterID, newCenters, converged, iterations, options.distanceFunction);
}

/**
 * Generator version for the algorithm
 * @ignore
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 */
function* kmeansGenerator(centers, data, clusterID, K, options) {
    var converged = false;
    var stepNumber = 0;
    var stepResult;
    while (!converged && (stepNumber < options.maxIterations)) {
        stepResult = step(centers, data, clusterID, K, options, ++stepNumber);
        yield stepResult.computeInformation(data);
        converged = stepResult.converged;
        centers = stepResult.centroids;
    }
}

/**
 * K-means algorithm
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 * @param {Number} [options.maxIterations = 100] - Maximum of iterations allowed
 * @param {Number} [options.tolerance = 1e-6] - Error tolerance
 * @param {Boolean} [options.withIterations = false] - Store clusters and centroids for each iteration
 * @param {Function} [options.distanceFunction = squaredDistance] - Distance function to use between the points
 * @param {String|Array<Array<Number>>} [options.initialization = 'moreDistant'] - K centers in format [x,y,z,...] or a method for initialize the data:
 *  * `'random'` will choose K random different values.
 *  * `'mostDistant'` will choose the more distant points to a first random pick
 * @returns {KMeansResult} - Cluster identifier for each data dot and centroids with the following fields:
 *  * `'clusters'`: Array of indexes for the clusters.
 *  * `'centroids'`: Array with the resulting centroids.
 *  * `'iterations'`: Number of iterations that took to converge
 */
function kmeans(data, K, options) {
    options = Object.assign({}, defaultOptions, options);

    if (K <= 0 || K > data.length || !Number.isInteger(K)) {
        throw new Error('K should be a positive integer bigger than the number of points');
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
            case 'random':
                centers = init.random(data, K);
                break;
            case 'mostDistant':
                centers = init.mostDistant(data, K, utils.calculateDistanceMatrix(data, options.distanceFunction));
                break;
            default:
                throw new Error('Unknown initialization method: "' + options.initialization + '"');
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
        while (!converged && (stepNumber < options.maxIterations)) {
            stepResult = step(centers, data, clusterID, K, options, ++stepNumber);
            converged = stepResult.converged;
            centers = stepResult.centroids;
        }
        return stepResult.computeInformation(data);
    }
}

module.exports = kmeans;
