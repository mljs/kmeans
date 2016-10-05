'use strict';

const utils = require('./utils');
const init = require('./initialization');
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
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array <Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 * @return {{clusters: (*|Array), centroids: (*|Array), converged: (*|boolean)}}
 */
function step(centers, data, clusterID, K, options) {
    clusterID = utils.updateClusterID(data, centers, clusterID, options.distanceFunction);
    var newCenters = utils.updateCenters(data, clusterID, K);
    var converged = utils.converged(newCenters, centers, options.distanceFunction, options.tolerance);
    return {
        clusters: clusterID,
        centroids: newCenters,
        converged: converged
    };
}

/**
 * Generator version for the algorithm
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array <Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 */
function* kmeansGenerator(centers, data, clusterID, K, options) {
    var converged = false;
    var stepNumber = 0;
    var stepResult;
    while (!converged && stepNumber < options.maxIterations) {
        yield stepResult = step(centers, data, clusterID, K, options);
        converged = stepResult.converged;
        centers = stepResult.centroids;
        stepNumber++;
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
 * @returns {Object} - Cluster identifier for each data dot and centroids with the following fields:
 *  * `'clusters'`: Array of indexes for the clusters.
 *  * `'centroids'`: Array with the resulting centroids.
 *  * `'iterations'`: Array with the state of 'clusters' and 'centroids' for each iteration.
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

    var clusterID = new Array(data.length);
    if (options.withIterations) {
        return kmeansGenerator(centers, data, clusterID, K, options);
    } else {
        var converged = false;
        var stepNumber = 0;
        var stepResult;
        while (!converged && stepNumber < options.maxIterations) {
            stepResult = step(centers, data, clusterID, K, options);
            converged = stepResult.converged;
            centers = stepResult.centroids;
            stepNumber++;
        }
        return stepResult;
    }
}

module.exports = kmeans;
