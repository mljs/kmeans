'use strict';

const distance = require('ml-distance-euclidean');
const Picker = require('RandomSelection').Picker;

/**
 * Choose K different random points from the original data
 * @ignore
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @return {Array<Array<Number>>} - Initial random points
 */
function random(data, K) {
    const rand = new Picker(data);
    var ans = new Array(K);

    for (var i = 0; i < K; ++i) {
        ans[i] = rand.pick();
    }
    return ans;
}

/**
 * Chooses the most distant points to a first random pick
 * @ignore
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @return {Array<Array<Number>>} - Initial random points
 */
function mostDistant(data, K) {
    var ans = new Array(K);

    // chooses a random point as initial cluster
    ans[0] = Math.floor(Math.random() * data.length);

    // calculate distance matrix
    var distanceMatrix = new Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        for (var j = i; j < data.length; ++j) {
            if (!distanceMatrix[i]) {
                distanceMatrix[i] = new Array(data.length);
            }
            if (!distanceMatrix[j]) {
                distanceMatrix[j] = new Array(data.length);
            }
            const dist = distance(data[i], data[j]);
            distanceMatrix[i][j] = dist;
            distanceMatrix[j][i] = dist;
        }
    }

    if (K > 1) {
        // chooses the more distant point
        var maxDist = {dist: -1, index: -1};
        for (var l = 0; l < data.length; ++l) {
            if (distanceMatrix[ans[0]][l] > maxDist.dist) {
                maxDist.dist = distanceMatrix[ans[0]][l];
                maxDist.index = l;
            }
        }
        ans[1] = maxDist.index;

        if (K > 2) {
            // chooses the set of points that maximises the min distance
            for (var k = 2; k < K; ++k) {
                var center = {dist: -1, index: -1};
                for (var m = 0; m < data.length; ++m) {

                    // minimum distance to centers
                    var minDistCent = {dist: Number.MAX_VALUE, index: -1};
                    for (var n = 0; n < k; ++n) {
                        if (distanceMatrix[n][m] < minDistCent.dist && ans.indexOf(m) === -1) {
                            minDistCent = {
                                dist: distanceMatrix[n][m],
                                index: m
                            };
                        }
                    }

                    if (minDistCent.dist !== Number.MAX_VALUE && minDistCent.dist > center.dist) {
                        center = Object.assign({}, minDistCent);
                    }
                }

                ans[k] = center.index;
            }
        }
    }

    return ans.map((index) => data[index]);
}

exports.random = random;
exports.mostDistant = mostDistant;
