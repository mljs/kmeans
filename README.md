# kmeans

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][coveralls-image]][coveralls-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

> [K-means clustering](https://en.wikipedia.org/wiki/K-means_clustering) in JavaScript

K-means clustering aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean.

## Installation

`npm install ml-kmeans`

## [API Documentation](https://mljs.github.io/kmeans/)

## Example

```js
const kmeans = require('ml-kmeans');

let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
let centers = [[1, 2, 1], [-1, -1, -1]];

let ans = kmeans(data, 2, {initialization: centers});
console.log(ans);
/*
KMeansResult {
  clusters: [ 0, 0, 1, 1 ],
  centroids: 
   [ { centroid: [ 1, 1.5, 1 ], error: 0.25, size: 2 },
     { centroid: [ -1, -1, -1.25 ], error: 0.0625, size: 2 } ],
  converged: true,
  iterations: 1
}
*/
```

## Test

```bash
npm install
npm test
```

## Authors

  - [Miguel Asencio](https://github.com/maasencioh)

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-kmeans.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-kmeans
[travis-image]: https://img.shields.io/travis/mljs/kmeans/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/kmeans
[coveralls-image]: https://img.shields.io/coveralls/mljs/kmeans.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/mljs/kmeans
[david-image]: https://img.shields.io/david/mljs/kmeans.svg?style=flat-square
[david-url]: https://david-dm.org/mljs/kmeans
[download-image]: https://img.shields.io/npm/dm/ml-kmeans.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-kmeans
