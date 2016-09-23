'use strict';

const utils = require('./utils');
const init = require('./initialization');

const defaultOptions = {
    maxIterations: 100,
    tolerance: 1e-6,
    withIterations: false,
    initialization: 'random'
};

/**
 * K-means algorithm
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @param {Object} [options] - Option object
 * @param {Number} [options.maxIterations = 100] - Maximum of iterations allowed
 * @param {Number} [options.tolerance = 1e-6] - Error tolerance
 * @param {Boolean} [options.withIterations = false] - Store clusters and centroids for each iteration
 * @param {String|Array<Array<Number>>} [options.initialization = 'random'] - K centers in format [x,y,z,...] or a method for initialize the data
 * @returns {Object} Cluster identifier for each data dot and centroids
 */
function kmeans(data, K, options) {
    options = Object.assign({}, defaultOptions, options);

    let nData = data.length;

    if (K > nData) {
        throw new Error('The numbers in data should be bigger than the k value');
    }

    let centers;
    if (Array.isArray(options.initialization)) {
        if (options.initialization.length !== K) {
            throw new Error('The initial centers should have the same length than K');
        } else {
            centers = options.initialization;
        }
    } else {
        switch (options.initialization) {
            case 'random':
                centers = init.random(data, K);
                break;
            case 'moreDistant':
                centers = init.moreDistant(data, K);
                break;
            default:
                throw new Error('Unknown initialization method');
        }
    }

    let clusterID = new Array(nData);
    for (let i = 0; i < nData; ++i) {
        clusterID[i] = 0;
    }
    let lastDistance = 1e100;
    let curDistance = 0;
    let iterations = [];
    for (let iter = 0; iter < options.maxIterations; ++iter) {
        clusterID = utils.updateClusterID(data, centers);
        centers = utils.updateCenters(data, clusterID, K);
        curDistance = utils.computeSSE(data, centers, clusterID);
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
