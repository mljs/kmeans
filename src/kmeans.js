'use strict';

/**
 * Calculates the squared distance between two vectors
 * @param {Array<number>} vec1 - the x vector
 * @param {Array<number>} vec2 - the y vector
 * @returns {number} sum - the calculated distance
 */
function squaredDistance(vec1, vec2) {
    var sum = 0;
    var dim = vec1.length;
    for (var i = 0; i < dim; i++)
        sum += (vec1[i] - vec2[i]) * (vec1[i] - vec2[i]);
    return sum;
}

/**
 * Calculates the sum of squared errors
 * @param {Array <Array <number>>} data - the (x,y) points to cluster
 * @param {Array <Array <number>>} centers - the K centers in format (x,y)
 * @param {Array <number>} clusterID - the cluster identifier for each data dot
 * @returns {number} the sum of squared errors
 */
function computeSSE(data, centers, clusterID) {
    var sse = 0;
    var nData = data.length;
    var c = 0;
    for (var i = 0; i < nData;i++) {
        c = clusterID[i];
        sse += squaredDistance(data[i], centers[c]);
    }
    return sse;
}

/**
 * Updates the cluster identifier based in the new data
 * @param {Array <Array <number>>} data - the (x,y) points to cluster
 * @param {Array <Array <number>>} centers - the K centers in format (x,y)
 * @returns {Array} the cluster identifier for each data dot
 */
function updateClusterID (data, centers) {
    var nData = data.length;
    var k = centers.length;
    var aux = 0;
    var clusterID = new Array(nData);
    for (var i = 0; i < nData; i++)
        clusterID[i] = 0;
    var d = new Array(nData);
    for (var i = 0; i < nData; i++) {
        d[i] = new Array(k);
        for (var j = 0; j < k; j++) {
            aux = squaredDistance(data[i], centers[j]);
            d[i][j] = new Array(2);
            d[i][j][0] = aux;
            d[i][j][1] = j;
        }
        var min = d[i][0][0];
        var id = 0;
        for (var j = 0; j < k; j++)
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
 * @param {Array <Array <number>>} data - the (x,y) points to cluster
 * @param {Array <number>} clusterID - the cluster identifier for each data dot
 * @param K - number of clusters
 * @returns {Array} he K centers in format (x,y)
 */
function updateCenters(data, clusterID, K) {
    var nDim = data[0].length;
    var nData = data.length;
    var centers = new Array(K);
    for (var i = 0; i < K; i++) {
        centers[i] = new Array(nDim);
        for (var j = 0; j < nDim; j++)
            centers[i][j] = 0;
    }

    for (var k = 0; k < K; k++) {
        var cluster = [];
        for (var i = 0; i < nData;i++)
            if (clusterID[i] == k)
                cluster.push(data[i]);
        for (var d = 0; d < nDim; d++) {
            var x = [];
            for (var i = 0; i < nData; i++)
                if (clusterID[i] == k)
                    x.push(data[i][d]);
            var sum = 0;
            var l = x.length;
            for (var i = 0; i < l; i++)
                sum += x[i];
            centers[k][d] = sum / l;
        }
    }
    return centers;
}

/**
 * K-means algorithm
 * @param {Array <Array <number>>} data - the (x,y) points to cluster
 * @param {Array <Array <number>>} centers - the K centers in format (x,y)
 * @param {number} maxIter - maximum of iterations allowed
 * @param {number} tol - the error tolerance
 * @returns {Array <number>} the cluster identifier for each data dot
 */
function kmeans(data, centers, maxIter, tol) {
    maxIter = (typeof maxIter === "undefined") ? 100 : maxIter;
    tol = (typeof tol === "undefined") ? 1e-6 : tol;

    var nData = data.length;
    if (nData == 0) {
        return [];
    }
    var K = centers.length;
    var clusterID = new Array(nData);
    for (var i = 0; i < nData; i++)
        clusterID[i] = 0;
    if (K >= nData) {
        for (var i = 0; i < nData; i++)
            clusterID[i] = i;
        return clusterID;
    }
    var lastDistance;
    lastDistance = 1e100;
    var curDistance = 0;
    for (var iter = 0; iter < maxIter; iter++) {
        clusterID = updateClusterID(data, centers);
        centers = updateCenters(data, clusterID, K);
        curDistance = computeSSE(data, centers, clusterID);
        if ((lastDistance - curDistance < tol) || ((lastDistance - curDistance)/lastDistance < tol))
            return clusterID;
        lastDistance = curDistance;
    }
    return clusterID;
}

module.exports = kmeans;