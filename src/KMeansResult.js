import { updateClusterID } from './utils';

const distanceSymbol = Symbol('distance');

export default class KMeansResult {
  /**
   * Result of the kmeans algorithm
   * @param {Array<number>} clusters - the cluster identifier for each data dot
   * @param {Array<Array<object>>} centroids - the K centers in format [x,y,z,...], the error and size of the cluster
   * @param {boolean} converged - Converge criteria satisfied
   * @param {number} iterations - Current number of iterations
   * @param {function} distance - (*Private*) Distance function to use between the points
   * @constructor
   */
  constructor(clusters, centroids, converged, iterations, distance) {
    this.clusters = clusters;
    this.centroids = centroids;
    this.converged = converged;
    this.iterations = iterations;
    this[distanceSymbol] = distance;
  }

  /**
   * Allows to compute for a new array of points their cluster id
   * @param {Array<Array<number>>} data - the [x,y,z,...] points to cluster
   * @return {Array<number>} - cluster id for each point
   */
  nearest(data) {
    const clusterID = new Array(data.length);
    const centroids = this.centroids.map(function (centroid) {
      return centroid.centroid;
    });
    return updateClusterID(data, centroids, clusterID, this[distanceSymbol]);
  }

  /**
   * Returns a KMeansResult with the error and size of the cluster
   * @ignore
   * @param {Array<Array<number>>} data - the [x,y,z,...] points to cluster
   * @return {KMeansResult}
   */
  computeInformation(data) {
    var enrichedCentroids = this.centroids.map(function (centroid) {
      return {
        centroid: centroid,
        error: 0,
        size: 0
      };
    });

    for (var i = 0; i < data.length; i++) {
      enrichedCentroids[this.clusters[i]].error += this[distanceSymbol](
        data[i],
        this.centroids[this.clusters[i]]
      );
      enrichedCentroids[this.clusters[i]].size++;
    }

    for (var j = 0; j < this.centroids.length; j++) {
      if (enrichedCentroids[j].size) {
        enrichedCentroids[j].error /= enrichedCentroids[j].size;
      } else {
        enrichedCentroids[j].error = null;
      }
    }

    return new KMeansResult(
      this.clusters,
      enrichedCentroids,
      this.converged,
      this.iterations,
      this[distanceSymbol]
    );
  }
}
