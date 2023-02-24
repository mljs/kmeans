import { updateClusterID } from './utils';

export interface CentroidWithInformation {
  centroid: number[];
  error: number;
  size: number;
}
export class KMeansResult {
  /**
   * Result of the kmeans algorithm
   * @param clusters - the cluster identifier for each data dot
   * @param centroids - the K centers in format [x,y,z,...], the error and size of the cluster
   * @param converged - Converge criteria satisfied
   * @param iterations - Current number of iterations
   * @param distance - Distance function to use between the points
   * @constructor
   */

  public clusters: number[];
  public centroids: number[][];
  public converged: boolean;
  public iterations: number;
  public distance: (a: number[], b: number[]) => number;
  constructor(
    clusters: number[],
    centroids: number[][],
    converged: boolean,
    iterations: number,
    distance: (a: number[], b: number[]) => number,
  ) {
    this.clusters = clusters;
    this.centroids = centroids;
    this.converged = converged;
    this.iterations = iterations;
    this.distance = distance;
  }

  /**
   * Allows to compute for a new array of points their cluster id
   * @param {Array<Array<number>>} data - the [x,y,z,...] points to cluster
   * @return {Array<number>} - cluster id for each point
   */
  nearest(data: number[][]): number[] {
    const clusterID = new Array<number>(data.length);
    return updateClusterID(data, this.centroids, clusterID, this.distance);
  }

  /**
   * Returns the error and size of each cluster
   * @ignore
   * @param {Array<Array<number>>} data - the [x,y,z,...] points to cluster
   * @return {KMeansResult}
   */
  computeInformation(data: number[][]): CentroidWithInformation[] {
    let enrichedCentroids = this.centroids.map((centroid) => {
      return {
        centroid,
        error: 0,
        size: 0,
      };
    });

    for (let i = 0; i < data.length; i++) {
      enrichedCentroids[this.clusters[i]].error += this.distance(
        data[i],
        this.centroids[this.clusters[i]],
      );
      enrichedCentroids[this.clusters[i]].size++;
    }

    for (let j = 0; j < this.centroids.length; j++) {
      let error = enrichedCentroids[j].error;
      if (enrichedCentroids[j].size && error !== -1) {
        error /= enrichedCentroids[j].size;
      } else {
        enrichedCentroids[j].error = -1;
      }
    }

    return enrichedCentroids;
  }
}
