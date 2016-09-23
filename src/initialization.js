'use strict';

const distance = require('ml-distance-euclidean');

/**
 * Choose K different random points from the original data
 * @ignore
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @return {Array<Array<Number>>} - Initial random points
 */
function random(data, K) {
    let len = data.length;
    let ans = new Array(K);

    for (let i = 0; i < K; ++i) {
        let rand = Math.floor(Math.random() * len);

        /* istanbul ignore next */
        while (ans.indexOf(rand) !== -1) {
            rand = Math.floor(Math.random() * len);
        }
        ans[i] = rand;
    }
    return ans.map((index) => data[index]);
}

/**
 * Chooses the more distant points to a first random pick
 * @ignore
 * @param {Array<Array<Number>>} data - Points in the format to cluster [x,y,z,...]
 * @param {Number} K - Number of clusters
 * @return {Array<Array<Number>>} - Initial random points
 */
function moreDistant(data, K) {
    let len = data.length;
    let ans = new Array(K);

    // chooses a random point as initial cluster
    ans[0] = Math.floor(Math.random() * len);

    // calculate distance matrix
    let distanceMatrix = new Array(len);
    for (let i = 0; i < len; ++i) {
        for (let j = i; j < len; ++j) {
            if (!distanceMatrix[i]) {
                distanceMatrix[i] = new Array(len);
            }
            if (!distanceMatrix[j]) {
                distanceMatrix[j] = new Array(len);
            }
            let dist = distance(data[i], data[j]);
            distanceMatrix[i][j] = dist;
            distanceMatrix[j][i] = dist;
        }
    }

    /* istanbul ignore else */
    if (K > 1) {
        // chooses the more distant point
        let maxDist = {dist: -1, index: -1};
        for (let i = 0; i < len; ++i) {
            if (distanceMatrix[ans[0]][i] > maxDist.dist) {
                maxDist.dist = distanceMatrix[ans[0]][i];
                maxDist.index = i;
            }
        }
        ans[1] = maxDist.index;

        if (K > 2) {
            // chooses the set of points that maximises the min distance
            for (let k = 2; k < K; ++k) {
                let center = {dist: -1, index: -1};
                for (let i = 0; i < len; ++i) {

                    // minimum distance to centers
                    let minDistCent = {dist: Number.MAX_VALUE, index: -1};
                    for (let j = 0; j < k; ++j) {
                        if (distanceMatrix[j][i] < minDistCent.dist && ans.indexOf(i) === -1) {
                            minDistCent = {
                                dist: distanceMatrix[j][i],
                                index: i
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
exports.moreDistant = moreDistant;
