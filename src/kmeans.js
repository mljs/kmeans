'use strict';

const squaredDistance = require('ml-euclidean-distance').squared;

/**
 * Calculates the sum of squared errors
 * @ignore
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Number>} clusterID - the cluster identifier for each data dot
 * @returns {Number} the sum of squared errors
 */
function computeSSE(data, centers, clusterID) {
    let sse = 0;
    let nData = data.length;
    let c = 0;
    for (let i = 0; i < nData; i++) {
        c = clusterID[i];
        sse += squaredDistance(data[i], centers[c]);
    }
    return sse;
}

/**
 * Updates the cluster identifier based in the new data
 * @ignore
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @returns {Array} the cluster identifier for each data dot
 */
function updateClusterID(data, centers) {
    let nData = data.length;
    let k = centers.length;
    let aux = 0;
    let clusterID = new Array(nData);
    for (let i = 0; i < nData; i++)
        clusterID[i] = 0;
    let d = new Array(nData);
    for (let i = 0; i < nData; i++) {
        d[i] = new Array(k);
        for (let j = 0; j < k; j++) {
            aux = squaredDistance(data[i], centers[j]);
            d[i][j] = new Array(2);
            d[i][j][0] = aux;
            d[i][j][1] = j;
        }
        let min = d[i][0][0];
        let id = 0;
        for (let j = 0; j < k; j++)
            if (d[i][j][0] < min) {
                min  = d[i][j][0];
                id = d[i][j][1];
            }
        clusterID[i] = id;
    }
    return clusterID;
}

/**
 * Update the center values based in the new configurations of the clusters
 * @ignore
 * @param {Array <Array <Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array <Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @returns {Array} he K centers in format [x,y,z,...]
 */
function updateCenters(data, clusterID, K) {
    let nDim = data[0].length;
    let nData = data.length;
    let centers = new Array(K);
    for (let i = 0; i < K; i++) {
        centers[i] = new Array(nDim);
        for (let j = 0; j < nDim; j++)
            centers[i][j] = 0;
    }

    for (let k = 0; k < K; k++) {
        let cluster = [];
        for (let i = 0; i < nData; i++)
            if (clusterID[i] === k)
                cluster.push(data[i]);
        for (let d = 0; d < nDim; d++) {
            let x = [];
            for (let i = 0; i < nData; i++)
                if (clusterID[i] === k)
                    x.push(data[i][d]);
            let sum = 0;
            let l = x.length;
            for (let i = 0; i < l; i++)
                sum += x[i];
            centers[k][d] = sum / l;
        }
    }
    return centers;
}

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
                centers = []; // TODO
                break;
            default:
                throw new Error('Unknown initialization method');
        }
    }

    if (K > nData) {
        throw new Error('The numbers in data should be bigger than the k value');
    }

    let clusterID = new Array(nData);
    for (let i = 0; i < nData; ++i) {
        clusterID[i] = 0;
    }
    let lastDistance = 1e100;
    let curDistance = 0;
    let iterations = [];
    for (let iter = 0; iter < options.maxIterations; ++iter) {
        clusterID = updateClusterID(data, centers);
        centers = updateCenters(data, clusterID, K);
        curDistance = computeSSE(data, centers, clusterID);
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
