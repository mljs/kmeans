# clustering

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

K-means in JavaScript

## Installation

`npm install ml-kmeans`

## [API Documentation](https://mljs.github.io/kmeans/)

### kmeans(data, centers, [props])
Returns an object containing the following:

* `clusters`: array of [cluster indexes](https://en.wikipedia.org/wiki/K-means_clustering) for the training dots.
* `centroids`: array of calculated centroids.
* `iterations`: array of `clusters` and `centroids` calculated during each iteration. It's optional, only included when `withIter` is set to true (see below).

__Arguments__
* `data`: An array of the (x,y) points to cluster, represented also as an array.
* `centers`: An array of the K centers in format (x,y), represented also as an array.
* `props`: A property object that can be used to set some parameters:
   * `maxIter`: Maximum number of iterations allowed. Its default is 100.
   * `tol`: The numerical error tolerance. Its default is 1e-6.
   * `withIter`: If `true` it adds an `iterations` property in the returned object. Its default is false.

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
[download-image]: https://img.shields.io/npm/dm/ml-kmeans.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-kmeans
