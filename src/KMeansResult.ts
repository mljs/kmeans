import { updateClusterID } from './utils';

const distanceSymbol = Symbol('distance');

interface Centroid {
  centroid: number;
  error: number | null;
  size: number;
}
export default class KMeansResult {
  /**
   * Result of the kmeans algorithm
   * @param {Array<number>} clusters - the cluster identifier for each data dot
   * @param {Array<Centroid>} centroids - the K centers in format [x,y,z,...], the error and size of the cluster
   * @param {boolean} converged - Converge criteria satisfied
   * @param {number} iterations - Current number of iterations
   * @param {function} distance - (*Private*) Distance function to use between the points
   * @constructor
   */

  constructor(
    public clusters: Array<number>,
    public centroids: Array<Array<Centroid>>,
    public converged: boolean,
    public iterations: number,
    distance: (a: Array<number>, b: Array<number>) => number,
  ) {
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
  nearest(data: Array<Array<number>>): Array<number> {
    const clusterID = new Array<number>(data.length);
    const centroids = this.centroids.map((centroid) => {
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
  computeInformation(data: Array<Array<number>>): KMeansResult {
    let enrichedCentroids: Centroid = this.centroids.map((centroid) => {
      return {
        centroid,
        error: 0,
        size: 0,
      };
    });

    for (let i = 0; i < data.length; i++) {
      enrichedCentroids[this.clusters[i]].error += this[distanceSymbol](
        data[i],
        this.centroids[this.clusters[i]],
      );
      enrichedCentroids[this.clusters[i]].size++;
    }

    for (let j = 0; j < this.centroids.length; j++) {
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
      this[distanceSymbol],
    );
  }
}
