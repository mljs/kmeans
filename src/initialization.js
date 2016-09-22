'use strict';

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

exports.random = random;
