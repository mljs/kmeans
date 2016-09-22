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

exports.computeSSE = computeSSE;
exports.updateClusterID = updateClusterID;
exports.updateCenters = updateCenters;
