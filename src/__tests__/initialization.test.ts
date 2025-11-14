import { squaredEuclidean } from 'ml-distance-euclidean';
import { expect, test } from 'vitest';

import { kmeanspp, mostDistant, random } from '../initialization.js';
import { kmeans } from '../kmeans.js';
import { calculateDistanceMatrix } from '../utils.js';

test('random in kmeans', () => {
  const data = [
    [1, 1, 1],
    [1, 2, 1],
    [-1, -1, -1],
    [-1, -1, -1.5],
  ];

  const ans = kmeans(data, 2, { initialization: 'random' });

  expect(ans.centroids).toHaveLength(2);
});

test('random UT', () => {
  const data = [
    [1, 1, 1],
    [1, 2, 1],
    [-1, -1, -1],
    [-1, -1, -1.5],
  ];

  const ans = random(data, 2);

  expect(ans).toHaveLength(2);
  expect(ans[0]).not.toStrictEqual(ans[1]);
});

test('mostDistant in kmeans', () => {
  const data = [
    [1, 1, 1],
    [1, 2, 1],
    [-1, -1, -1],
    [-1, -1, -1.5],
  ];

  const ans = kmeans(data, 2, { initialization: 'mostDistant' });

  expect(ans.centroids).toHaveLength(2);
});

test('mostDistant UT', () => {
  const data = [
    [1, 1, 1],
    [1, 2, 1],
    [-1, -1, -1],
    [-1, -1, -1.5],
  ];
  const distanceMatrix = calculateDistanceMatrix(data, squaredEuclidean);
  const ans = mostDistant(data, 3, distanceMatrix);

  expect(ans).toHaveLength(3);
  expect(ans[0]).not.toStrictEqual(ans[1]);
  expect(ans[0]).not.toStrictEqual(ans[2]);

  const single = [[1, 1, 1]];

  const ansSingle = mostDistant(
    single,
    1,
    calculateDistanceMatrix(single, squaredEuclidean),
  );

  expect(ansSingle).toHaveLength(1);
  expect(ansSingle[0]).toStrictEqual([1, 1, 1]);
});

test('kmeans++', () => {
  const data = [
    [1, 0.75, 1.125],
    [1, 1.75, 1.125],
    [-1, -1.25, -0.875],
    [-1, -1.25, -1.375],
  ];
  const result = kmeanspp(data, 3, {
    seed: 10,
  });

  expect(result).toMatchSnapshot();
});
