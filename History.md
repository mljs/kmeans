<a name="4.2.1"></a>
## [4.2.1](https://github.com/mljs/kmeans/compare/v4.2.0...v4.2.1) (2018-08-15)



<a name="4.2.0"></a>
# [4.2.0](https://github.com/mljs/kmeans/compare/v4.1.0...v4.2.0) (2018-08-15)



<a name="4.1.0"></a>
# [4.1.0](https://github.com/mljs/kmeans/compare/v4.0.1...v4.1.0) (2018-08-11)



<a name="4.0.1"></a>
## [4.0.1](https://github.com/mljs/kmeans/compare/v4.0.0...v4.0.1) (2018-05-24)


### Bug Fixes

* keep initial value for empty centroids ([94b0de9](https://github.com/mljs/kmeans/commit/94b0de9))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/mljs/kmeans/compare/v3.1.0...v4.0.0) (2018-05-23)


### Features

* implement kmeans++ initialization algorithm ([007f3b1](https://github.com/mljs/kmeans/commit/007f3b1))


### BREAKING CHANGES

* kmeans++ is now the default initialization algorithm
instead of mostDistant



<a name="3.1.0"></a>
# [3.1.0](https://github.com/mljs/kmeans/compare/v3.0.1...v3.1.0) (2018-05-16)



<a name="3.0.1"></a>
## [3.0.1](https://github.com/mljs/kmeans/compare/v3.0.0...v3.0.1) (2018-05-04)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/mljs/kmeans/compare/v2.0.0...v3.0.0) (2016-10-07)


### Bug Fixes

* remove unneeded array creations in updateClusterID ([b2957d5](https://github.com/mljs/kmeans/commit/b2957d5))


### Features

* accepts distance function as parameter ([68993a1](https://github.com/mljs/kmeans/commit/68993a1))
* allows to compute a new array of points their cluster id ([254f9a9](https://github.com/mljs/kmeans/commit/254f9a9))
* return a generator in the withIterations option ([3b4c7c6](https://github.com/mljs/kmeans/commit/3b4c7c6))
* return the number of iteration done ([75fd42e](https://github.com/mljs/kmeans/commit/75fd42e))
* returns the error and the size of each cluster ([e85aab7](https://github.com/mljs/kmeans/commit/e85aab7))
* when maxIterations is 0, iterates until converge ([220c828](https://github.com/mljs/kmeans/commit/220c828))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/mljs/kmeans/compare/v1.0.0...v2.0.0) (2016-09-27)


### Features

* initialize the points as parameter ([fbe993d](https://github.com/mljs/kmeans/commit/fbe993d))
* **initialization:** moreDistant initialization ([d098f43](https://github.com/mljs/kmeans/commit/d098f43))
* **initialization:** random initialization ([9e58baf](https://github.com/mljs/kmeans/commit/9e58baf))


### BREAKING CHANGES

* instead of asking for a manual initialization, ask for k and the initialization method



<a name="1.0.0"></a>
# [1.0.0](https://github.com/mljs/kmeans/compare/v0.1.0...v1.0.0) (2016-09-15)


### Chores

* update package ([10dd6be](https://github.com/mljs/kmeans/commit/10dd6be))


### BREAKING CHANGES

* rename option variables to more understandable names



<a name="0.1.0"></a>
# 0.1.0 (2015-07-22)



