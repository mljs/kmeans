# ml-kmeans

[K-means clustering][] aims to partition n observations into k clusters in which
each observation belongs to the cluster with the nearest mean.

<h3 align="center">

  <a href="https://www.zakodium.com">
    <img src="https://www.zakodium.com/brand/zakodium-logo-white.svg" width="50" alt="Zakodium logo" />
  </a>

  <p>
    Maintained by <a href="https://www.zakodium.com">Zakodium</a>
  </p>

[![NPM version](https://img.shields.io/npm/v/ml-kmeans.svg)](https://www.npmjs.com/package/ml-kmeans)
[![npm download](https://img.shields.io/npm/dm/ml-kmeans.svg)](https://www.npmjs.com/package/ml-kmeans)
[![test coverage](https://img.shields.io/codecov/c/github/mljs/kmeans.svg)](https://codecov.io/gh/mljs/kmeans)
[![license](https://img.shields.io/npm/l/ml-kmeans.svg)](https://github.com/mljs/kmeans/blob/main/LICENSE)

</h3>

## Installation

`npm i ml-kmeans`

## [API Documentation](https://mljs.github.io/kmeans/)

## Usage

```js
import { kmeans } from 'ml-kmeans';

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

const ans = kmeans(data, 2, { initialization: centers });
console.log(ans);
/*
KMeansResult {
  clusters: [ 0, 0, 1, 1 ],
  centroids: [ [ 1, 1.5, 1 ], [ -1, -1, -1.25 ] ],
  converged: true,
  iterations: 2,
  distance: [Function: squaredEuclidean]
}
*/

// Compute the error and size of each cluster.
console.log(ans.computeInformation(data));
/*
[
  { centroid: [ 1, 1.5, 1 ], error: 0.5, size: 2 },
  { centroid: [ -1, -1, -1.25 ], error: 0.125, size: 2 }
]
*/

// Assign new points to the clusters found above.
console.log(ans.nearest([[1, 2, 1]]));
// [ 0 ]
```

## API

### `kmeans(data, k, options)`

Runs the K-means algorithm and returns a `KMeansResult`.

- `data`: array of points to cluster, each in the format `[x, y, z, ...]`.
- `k`: number of clusters.
- `options`: an optional object with the following properties.

| Option             | Type                       | Default            | Description                                                                                                                                                       |
| ------------------ | -------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialization`   | `string` or `number[][]`   | `'kmeans++'`       | Either custom start centroids (`[x, y, z, ...]`), or one of the methods `'kmeans++'`, `'random'`, or `'mostDistant'`.                                              |
| `maxIterations`    | `number`                   | `100`              | Maximum number of iterations allowed. Set to `0` to iterate until convergence.                                                                                    |
| `tolerance`        | `number`                   | `1e-6`             | Error tolerance used as the convergence criterion.                                                                                                                |
| `distanceFunction` | `(p, q) => number`         | `squaredEuclidean` | Distance function to use between two points.                                                                                                                       |
| `seed`             | `number`                   | _(none)_           | Seed for the random number generator, used by the `'random'` and `'mostDistant'` initialization methods to make results reproducible.                             |

#### Initialization methods

- `'kmeans++'`: uses the [kmeans++][] seeding method.
- `'random'`: chooses `k` random distinct points.
- `'mostDistant'`: chooses the most distant points starting from a first random pick.

### `KMeansResult`

The object returned by `kmeans`.

- `clusters`: array with the cluster index of each input point.
- `centroids`: array with the resulting centroids.
- `converged`: whether the convergence criterion was satisfied.
- `iterations`: number of iterations performed.
- `result.nearest(points)`: returns the cluster index of each of the given new `points`.
- `result.computeInformation(data)`: returns the `centroid`, mean `error`, and `size` of each cluster.

### `kmeansGenerator(data, k, options)`

Generator variant of `kmeans` that yields the `KMeansResult` of each iteration, which is useful to observe the algorithm step by step.

## Authors

- [Miguel Asencio](https://github.com/maasencioh)

## Sources

D. Arthur, S. Vassilvitskii, k-means++: The Advantages of Careful Seeding, in: Proc. of the 18th Annual
ACM-SIAM Symposium on Discrete Algorithms, 2007, pp. 1027–1035.
[Link to article](http://ilpubs.stanford.edu:8090/778/1/2006-13.pdf)

## License

[MIT](./LICENSE)

[k-means clustering]: https://en.wikipedia.org/wiki/K-means_clustering
[kmeans++]: http://ilpubs.stanford.edu:8090/778/1/2006-13.pdf
