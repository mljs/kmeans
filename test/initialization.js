'use strict';

const kmeans = require('..');
const init = require('../src/initialization');

describe('Initialization methods', function () {

    it('Random in kmeans', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

        let ans = kmeans(data, 2, {initialization: 'random'});
        ans.centroids.length.should.be.equal(2);
    });

    it('Random UT', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

        let rand = init.random(data, 2);
        rand.length.should.be.equal(2);
        rand[0].should.not.deepEqual(rand[1]);
    });
});
