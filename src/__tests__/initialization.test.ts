import { squaredEuclidean } from 'ml-distance-euclidean';
import { expect, test } from 'vitest';

import { kmeanspp, mostDistant, random } from '../initialization.ts';
import { kmeans } from '../kmeans.ts';
import { calculateDistanceMatrix } from '../utils.ts';

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

test('mostDistant always picks the spread-out points', () => {
  // 0 and 1 are the two extremes; 2, 3, 4 are near-duplicates of the middle.
  // Correct furthest-first seeding must always keep both extremes and never
  // select two of the near-identical middle points as separate centers.
  const data = [
    [0, 0],
    [100, 0],
    [50, 0],
    [50, 1],
    [50, -1],
  ];
  const distanceMatrix = calculateDistanceMatrix(data, squaredEuclidean);

  for (let seed = 0; seed < 20; seed++) {
    const centers = mostDistant(data, 3, distanceMatrix, seed);

    expect(centers).toContainEqual([0, 0]);
    expect(centers).toContainEqual([100, 0]);
  }
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
