'use strict';

const utils = require('./utils');
const distanceSymbol = Symbol('distance');

/**
 * Result of the kmeans algorithm
 * @param {Array<Number>} clusters - the cluster identifier for each data dot
 * @param {Array<Array<Object>>} centroids - the K centers in format [x,y,z,...], the error and size of the cluster
 * @param {Boolean} converged - Converge criteria satisfied
 * @param {Number} iterations - Current number of iterations
 * @param {Function} distance - (*Private*) Distance function to use between the points
 * @constructor
 */
function KMeansResult(clusters, centroids, converged, iterations, distance) {
    this.clusters = clusters;
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
    var centroids = this.centroids.map(function (centroid) {
        return centroid.centroid;
    });
    return utils.updateClusterID(data, centroids, clusterID, this[distanceSymbol]);
};

/**
 * Returns a KMeansResult with the error and size of the cluster
 * @ignore
 * @param {Array<Array<Number>>} data - the [x,y,z,...] points to cluster
 * @return {KMeansResult}
 */
KMeansResult.prototype.computeInformation = function (data) {
    var enrichedCentroids = this.centroids.map(function (centroid) {
        return {
            centroid: centroid,
            error: 0,
            size: 0
        };
    });

    for (var i = 0; i < data.length; i++) {
        enrichedCentroids[this.clusters[i]].error += this[distanceSymbol](data[i], this.centroids[this.clusters[i]]);
        enrichedCentroids[this.clusters[i]].size++;
    }

    for (var j = 0; j < this.centroids.length; j++) {
        enrichedCentroids[j].error /= enrichedCentroids[j].size;
    }

    return new KMeansResult(this.clusters, enrichedCentroids, this.converged, this.iterations, this[distanceSymbol]);
};

module.exports = KMeansResult;
