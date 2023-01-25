import { squaredEuclidean } from 'ml-distance-euclidean';

import * as init from '../initialization';
import { kmeans } from '../kmeans';
import * as utils from '../utils';

describe('Initialization methods', () => {
  it('random in kmeans', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];

    let ans = kmeans(data, 2, { initialization: 'random' });
    if (ans !== undefined) {
      expect(ans.centroids).toHaveLength(2);
    }
  });

  it('random UT', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];

    let ans = init.random(data, 2);
    expect(ans).toHaveLength(2);
    expect(ans[0]).not.toStrictEqual(ans[1]);
  });

  it('mostDistant in kmeans', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];

    let ans = kmeans(data, 2, { initialization: 'mostDistant' });

    if (ans !== undefined) {
      expect(ans.centroids).toHaveLength(2);
    }
  });

  it('mostDistant UT', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    const distanceMatrix = utils.calculateDistanceMatrix(
      data,
      squaredEuclidean,
    );
    let ans = init.mostDistant(data, 3, distanceMatrix);
    expect(ans).toHaveLength(3);
    expect(ans[0]).not.toStrictEqual(ans[1]);
    expect(ans[0]).not.toStrictEqual(ans[2]);

    let single = [[1, 1, 1]];

    let ansSingle = init.mostDistant(
      single,
      1,
      utils.calculateDistanceMatrix(single, squaredEuclidean),
    );
    expect(ansSingle).toHaveLength(1);
    expect(ansSingle[0]).toStrictEqual([1, 1, 1]);
  });

  it('kmeans++', () => {
    let data = [
      [1, 0.75, 1.125],
      [1, 1.75, 1.125],
      [-1, -1.25, -0.875],
      [-1, -1.25, -1.375],
    ];
    let result = init.kmeanspp(data, 3, {
      seed: 10,
    });
    expect(result).toMatchSnapshot();
  });
});
