'use strict';

const utils = require('./utils');
const distanceSymbol = Symbol('distance');

/**
 * Result of the kmeans algorithm
 * @param {Array<Number>} clusterID - the cluster identifier for each data dot
 * @param {Array<Array<Number>>} centroids - the K centers in format [x,y,z,...]
 * @param {Boolean} converged - Converge criteria satisfied
 * @param {Number} iterations - Current number of iterations
 * @param {Function} distance - Distance function to use between the points
 * @constructor
 */
function KMeansResult(clusterID, centroids, converged, iterations, distance) {
    this.clusters = clusterID;
    this.centroids = centroids;
    this.converged = converged;
    this.iterations = iterations;
    this[distanceSymbol] = distance;
}

/**
 * Allows to compute for a new array of points their cluster id
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @return {Array<Number>} - cluster id for each point
 */
KMeansResult.prototype.nearest = function (data) {
    var clusterID = new Array(data.length);
    return utils.updateClusterID(data, this.centroids, clusterID, this[distanceSymbol]);
};

module.exports = KMeansResult;
