'use strict';

const squaredDistance = require('ml-distance-euclidean').squared;

/**
 * Calculates the sum of squared errors
 * @ignore
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @param {Array<Array<Number>>} centers - the K centers in format [x,y,z,...]
 * @param {Array<Number>} clusterID - the cluster identifier for each data dot
 * @returns {Number} the sum of squared errors
 */
function computeSSE(data, centers, clusterID) {
    var sse = 0;
    var c = 0;
    for (var i = 0; i < data.length; i++) {
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
    const k = centers.length;
    var aux = 0;
    var clusterID = new Array(data.length);
    for (var index = 0; index < data.length; index++)
        clusterID[index] = 0;
    var d = new Array(data.length);
    for (var i = 0; i < data.length; i++) {
        d[i] = new Array(k);
        for (var j = 0; j < k; j++) {
            aux = squaredDistance(data[i], centers[j]);
            d[i][j] = [aux, j];
        }
        var min = d[i][0][0];
        var id = 0;
        for (var l = 0; l < k; l++) {
            if (d[i][l][0] < min) {
                min  = d[i][l][0];
                id = d[i][l][1];
            }
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
    const nDim = data[0].length;
    var centers = new Array(K);
    for (var i = 0; i < K; i++) {
        centers[i] = new Array(nDim);
        for (var j = 0; j < nDim; j++) {
            centers[i][j] = 0;
        }
    }

    for (var k = 0; k < K; k++) {
        var cluster = [];
        for (var l = 0; l < data.length; l++) {
            if (clusterID[l] === k) {
                cluster.push(data[l]);
            }
        }
        for (var d = 0; d < nDim; d++) {
            var x = [];
            for (var m = 0; m < data.length; m++) {
                if (clusterID[m] === k) {
                    x.push(data[m][d]);
                }
            }
            var sum = 0;
            for (var n = 0; n < x.length; n++) {
                sum += x[n];
            }
            centers[k][d] = sum / x.length;
        }
    }
    return centers;
}

exports.computeSSE = computeSSE;
exports.updateClusterID = updateClusterID;
exports.updateCenters = updateCenters;
