import { xMean } from 'ml-spectra-processing';

import { updateClusterID } from './utils.ts';

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
   * @class
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
   * @param data - the [x,y,z,...] points to cluster
   * @returns - cluster id for each point
   */
  nearest(data: number[][]): number[] {
    const clusterID = new Array<number>(data.length);
    return updateClusterID(data, this.centroids, clusterID, this.distance);
  }

  /**
   * Returns the centroid, mean error, and size of each cluster.
   * The error of an empty cluster is `-1`.
   * @ignore
   * @param data - the [x,y,z,...] points to cluster
   * @returns for each cluster, its centroid, mean error, and size.
   */
  computeInformation(data: number[][]): CentroidWithInformation[] {
    const clusterDistances: number[][] = this.centroids.map(() => []);

    for (let i = 0; i < data.length; i++) {
      const clusterID = this.clusters[i];
      clusterDistances[clusterID].push(
        this.distance(data[i], this.centroids[clusterID]),
      );
    }

    return this.centroids.map((centroid, j) => {
      const distances = clusterDistances[j];
      return {
        centroid,
        error: distances.length > 0 ? xMean(distances) : -1,
        size: distances.length,
      };
    });
  }
}
