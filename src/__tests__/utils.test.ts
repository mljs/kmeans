import { squaredEuclidean } from 'ml-distance-euclidean';
import { describe, expect, it } from 'vitest';

import {
  calculateDistanceMatrix,
  hasConverged,
  updateCenters,
  updateClusterID,
} from '../utils.js';

describe('calculateDistanceMatrix', () => {
  it('Same points', () => {
    const data = [
      [1, 1, 1],
      [1, 2, 1],
      [1, 1, 1],
      [1, 2, 1],
    ];

    const ans = calculateDistanceMatrix(data, squaredEuclidean);

    expect(ans).toStrictEqual([
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0],
    ]);
  });

  it('Simple case', () => {
    const data = [
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
      [4, 4, 4],
    ];

    const ans = calculateDistanceMatrix(data, squaredEuclidean);

    expect(ans).toStrictEqual([
      [0, 3, 12, 27],
      [3, 0, 3, 12],
      [12, 3, 0, 3],
      [27, 12, 3, 0],
    ]);
  });
});

describe('updateClusterID', () => {
  it('Simple case', () => {
    const data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    const centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];
    const clusterID = [0, 0, 0, 0];

    const ans = updateClusterID(data, centers, clusterID, squaredEuclidean);

    expect(ans).toStrictEqual([0, 0, 1, 1]);
  });

  it('Bigger case', () => {
    const data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [100, 100, 100],
    ];
    const centers = [
      [1, 2, 1],
      [10, 20, 100],
      [-1, -1, -1],
    ];
    const clusterID = [0, 0, 0, 0];

    const ans = updateClusterID(data, centers, clusterID, squaredEuclidean);

    expect(ans).toStrictEqual([0, 0, 2, 1]);
  });
});

describe('updateCenters', () => {
  it('Simple case', () => {
    const data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    const clusterID = [0, 0, 1, 1];
    const prevCenters = [
      [0, 0, 0],
      [0, 0, 0],
    ];

    const ans = updateCenters(prevCenters, data, clusterID, 2);

    expect(ans).toStrictEqual([
      [1, 1.5, 1],
      [-1, -1, -1.25],
    ]);
  });
});

describe('converged', () => {
  it('Same points', () => {
    const centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];
    const oldCenters = [
      [1, 2, 1],
      [-1, -1, -1],
    ];

    const ans = hasConverged(centers, oldCenters, squaredEuclidean, 0.0005);

    expect(ans).toBe(true);
  });

  it('Different points', () => {
    const centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];
    const oldCenters = [
      [1, 2, 1],
      [-1, -1, -5],
    ];

    const ans = hasConverged(centers, oldCenters, squaredEuclidean, 0.0005);

    expect(ans).toBe(false);
  });
});
