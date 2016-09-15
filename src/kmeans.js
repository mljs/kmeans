'use strict';

const squaredDistance = require('ml-euclidean-distance').squared;

/**
 * Calculates the sum of squared errors
 * @param {Array <Array <Number>>} data - the (x,y) points to cluster
 * @param {Array <Array <Number>>} centers - the K centers in format (x,y)
 * @param {Array <Number>} clusterID - the cluster identifier for each data dot
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
 * @param {Array <Array <Number>>} data - the (x,y) points to cluster
 * @param {Array <Array <Number>>} centers - the K centers in format (x,y)
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
 * @param {Array <Array <Number>>} data - the (x,y) points to cluster
 * @param {Array <Number>} clusterID - the cluster identifier for each data dot
 * @param {Number} K - Number of clusters
 * @returns {Array} he K centers in format (x,y)
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
    withIterations: false
};

/**
 * K-means algorithm
 * @param {Array <Array <Number>>} data - the (x,y) points to cluster
 * @param {Array <Array <Number>>} centers - the K centers in format (x,y)
 * @param {Object} options - properties
 * @param {Number} options.maxIterations - maximum of iterations allowed
 * @param {Number} options.tolerance - the error tolerance
 * @param {boolean} options.withIterations - store clusters and centroids for each iteration
 * @returns {Object} the cluster identifier for each data dot and centroids
 */
function kmeans(data, centers, options) {
    if (!options) options = defaultOptions;
    let maxIterations = options.maxIterations || defaultOptions.maxIterations;
    let tolerance = options.tolerance || defaultOptions.tolerance;
    let withIterations = options.withIterations || defaultOptions.withIterations;

    let nData = data.length;
    if (nData === 0) {
        return [];
    }
    let K = centers.length;
    let clusterID = new Array(nData);
    for (let i = 0; i < nData; i++)
        clusterID[i] = 0;
    if (K >= nData) {
        for (let i = 0; i < nData; i++)
            clusterID[i] = i;
        return clusterID;
    }
    let lastDistance;
    lastDistance = 1e100;
    let curDistance = 0;
    let iterations = [];
    for (let iter = 0; iter < maxIterations; iter++) {
        clusterID = updateClusterID(data, centers);
        centers = updateCenters(data, clusterID, K);
        curDistance = computeSSE(data, centers, clusterID);
        if (withIterations) {
            iterations.push({
                'clusters': clusterID,
                'centroids': centers
            });
        }

        if ((lastDistance - curDistance < tolerance) || ((lastDistance - curDistance) / lastDistance < tolerance)) {
            if (withIterations) {
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
    if (withIterations) {
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
