import { squaredEuclidean } from 'ml-distance-euclidean';

import kmeans from '../kmeans';
import * as init from '../initialization';
import * as utils from '../utils';

describe('Initialization methods', function () {
  it('random in kmeans', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

    let ans = kmeans(data, 2, { initialization: 'random' });
    expect(ans.centroids).toHaveLength(2);
  });

  it('random UT', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

    let ans = init.random(data, 2);
    expect(ans).toHaveLength(2);
    expect(ans[0]).not.toEqual(ans[1]);
  });

  it('mostDistant in kmeans', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

    let ans = kmeans(data, 2, { initialization: 'mostDistant' });
    expect(ans.centroids).toHaveLength(2);
  });

  it('mostDistant UT', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
    const distanceMatrix = utils.calculateDistanceMatrix(
      data,
      squaredEuclidean
    );
    let ans = init.mostDistant(data, 3, distanceMatrix);
    expect(ans).toHaveLength(3);
    expect(ans[0]).not.toEqual(ans[1]);
    expect(ans[0]).not.toEqual(ans[2]);

    let single = [[1, 1, 1]];

    let ansSingle = init.mostDistant(
      single,
      1,
      utils.calculateDistanceMatrix(single, squaredEuclidean)
    );
    expect(ansSingle).toHaveLength(1);
    expect(ansSingle[0]).toStrictEqual([1, 1, 1]);
  });

  it('kmeans++', function () {
    let data = [
      [1, 0.75, 1.125],
      [1, 1.75, 1.125],
      [-1, -1.25, -0.875],
      [-1, -1.25, -1.375]
    ];
    let result = init.kmeanspp(data, 3, {
      seed: 10
    });
    expect(result).toMatchSnapshot();
  });
});
