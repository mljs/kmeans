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

[![NPM version][npm-image]][npm-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

</h3>

## Installation

`npm i ml-kmeans`

## [API Documentation](https://mljs.github.io/kmeans/)

## Example

```js
const kmeans = require('ml-kmeans');

let data = [
  [1, 1, 1],
  [1, 2, 1],
  [-1, -1, -1],
  [-1, -1, -1.5],
];
let centers = [
  [1, 2, 1],
  [-1, -1, -1],
];

let ans = kmeans(data, 2, { initialization: centers });
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

## Authors

- [Miguel Asencio](https://github.com/maasencioh)

## Sources

D. Arthur, S. Vassilvitskii, k-means++: The Advantages of Careful Seeding, in: Proc. of the 18th Annual
ACM-SIAM Symposium on Discrete Algorithms, 2007, pp. 1027–1035.
[Link to article](http://ilpubs.stanford.edu:8090/778/1/2006-13.pdf)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-kmeans.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-kmeans
[codecov-image]: https://img.shields.io/codecov/c/github/mljs/kmeans.svg?style=flat-square
[codecov-url]: https://codecov.io/github/mljs/kmeans
[download-image]: https://img.shields.io/npm/dm/ml-kmeans.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-kmeans
[k-means clustering]: https://en.wikipedia.org/wiki/K-means_clustering
