# clustering

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

K-means in JavaScript

## Installation

`npm install ml-kmeans`

## Methods
### kmeans(data, centers, [maxIter], [tol])
Returns an array of [cluster indexes](https://en.wikipedia.org/wiki/K-means_clustering) for the training dots.

__Arguments__
* `data`: An array of the (x,y) points to cluster, represented also as an array.
* `centers`: An array of the K centers in format (x,y), represented also as an array.
* `maxIter`: Maximum number of iterations allowed. Its default is 100.
* `tol`: The numerical error tolerance. Its default is 1e-6.

## Test

```js
$ npm install
$ npm test
```

## Authors

  - [Miguel Asencio](https://github.com/maasencioh)

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-kmeans.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-kmeans
[travis-image]: https://img.shields.io/travis/mljs/kmeans/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/kmeans
[david-image]: https://img.shields.io/david/mljs/kmeans.svg?style=flat-square
[david-url]: https://david-dm.org/mljs/kmeans
[download-image]: https://img.shields.io/npm/dm/ml-kmeans.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-kmeans
