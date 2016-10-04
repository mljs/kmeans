'use strict';

const utils = require('./utils');
const init = require('./initialization');

const defaultOptions = {
    maxIterations: 100,
    tolerance: 1e-6,
    withIterations: false,
    initialization: 'mostDistant'
};

/**
 * K-means algorithm
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 * @param {Number} [options.maxIterations = 100] - Maximum of iterations allowed
 * @param {Number} [options.tolerance = 1e-6] - Error tolerance
 * @param {Boolean} [options.withIterations = false] - Store clusters and centroids for each iteration
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
    const matrixDistance = utils.calculateDistanceMatrix(data);
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
                centers = init.mostDistant(data, K, matrixDistance);
                break;
            default:
                throw new Error('Unknown initialization method: "' + options.initialization + '"');
        }
    }

    var clusterID = new Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        clusterID[i] = 0;
    }
    var lastDistance = Number.MAX_VALUE;
    var curDistance = 0;
    var iterations = [];
    for (var iter = 0; iter < options.maxIterations; ++iter) {
        clusterID = utils.updateClusterID(data, centers);
        centers = utils.updateCenters(data, clusterID, K);
        curDistance = utils.computeSSE(data, clusterID, matrixDistance);
        if (options.withIterations) {
            iterations.push({
                'clusters': clusterID,
                'centroids': centers
            });
        }

        if ((lastDistance - curDistance < options.tolerance) || ((lastDistance - curDistance) / lastDistance < options.tolerance)) {
            if (options.withIterations) {
                return {
                    'clusters': clusterID,
                    'centroids': centers,
                    'iterations': iterations
                };
            } else {
                return {
                    'clusters': clusterID,
                    'centroids': centers
                };
            }
        }
        lastDistance = curDistance;
    }

    // exceed number of iterations
    if (options.withIterations) {
        return {
            'clusters': clusterID,
            'centroids': centers,
            'iterations': iterations
        };
    } else {
        return {
            'clusters': clusterID,
            'centroids': centers
        };
    }
}

module.exports = kmeans;
