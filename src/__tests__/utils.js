import { squaredEuclidean } from 'ml-distance-euclidean';

import {
  calculateDistanceMatrix,
  hasConverged,
  updateCenters,
  updateClusterID
} from '../utils';

describe('Utils methods', function () {
  describe('calculateDistanceMatrix', function () {
    it('Same points', function () {
      let data = [[1, 1, 1], [1, 2, 1], [1, 1, 1], [1, 2, 1]];

      let ans = calculateDistanceMatrix(data, squaredEuclidean);
      expect(ans).toStrictEqual([
        [0, 1, 0, 1],
        [1, 0, 1, 0],
        [0, 1, 0, 1],
        [1, 0, 1, 0]
      ]);
    });

    it('Simple case', function () {
      let data = [[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4]];

      let ans = calculateDistanceMatrix(data, squaredEuclidean);
      expect(ans).toStrictEqual([
        [0, 3, 12, 27],
        [3, 0, 3, 12],
        [12, 3, 0, 3],
        [27, 12, 3, 0]
      ]);
    });
  });

  describe('updateClusterID', function () {
    it('Simple case', function () {
      let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
      let centers = [[1, 2, 1], [-1, -1, -1]];
      let clusterID = [0, 0, 0, 0];

      let ans = updateClusterID(data, centers, clusterID, squaredEuclidean);
      expect(ans).toStrictEqual([0, 0, 1, 1]);
    });

    it('Bigger case', function () {
      let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [100, 100, 100]];
      let centers = [[1, 2, 1], [10, 20, 100], [-1, -1, -1]];
      let clusterID = [0, 0, 0, 0];

      let ans = updateClusterID(data, centers, clusterID, squaredEuclidean);
      expect(ans).toStrictEqual([0, 0, 2, 1]);
    });
  });

  describe('updateCenters', function () {
    it('Simple case', function () {
      let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
      let clusterID = [0, 0, 1, 1];
      let prevCenters = [[0, 0, 0], [0, 0, 0]];

      let ans = updateCenters(prevCenters, data, clusterID, 2);
      expect(ans).toStrictEqual([[1, 1.5, 1], [-1, -1, -1.25]]);
    });
  });

  describe('converged', function () {
    it('Same points', function () {
      let centers = [[1, 2, 1], [-1, -1, -1]];
      let oldCenters = [[1, 2, 1], [-1, -1, -1]];

      let ans = hasConverged(centers, oldCenters, squaredEuclidean, 0.0005);
      expect(ans).toBe(true);
    });

    it('Different points', function () {
      let centers = [[1, 2, 1], [-1, -1, -1]];
      let oldCenters = [[1, 2, 1], [-1, -1, -5]];

      let ans = hasConverged(centers, oldCenters, squaredEuclidean, 0.0005);
      expect(ans).toBe(false);
    });
  });
});
