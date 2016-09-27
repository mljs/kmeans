'use strict';

const kmeans = require('..');
const init = require('../src/initialization');

describe('Initialization methods', function () {

    it('random in kmeans', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

        let ans = kmeans(data, 2, {initialization: 'random'});
        ans.centroids.length.should.be.equal(2);
    });

    it('random UT', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

        let ans = init.random(data, 2);
        ans.length.should.be.equal(2);
        ans[0].should.not.deepEqual(ans[1]);
    });

    it('mostDistant in kmeans', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

        let ans = kmeans(data, 2, {initialization: 'mostDistant'});
        ans.centroids.length.should.be.equal(2);
    });

    it('mostDistant UT', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];

        let ans = init.mostDistant(data, 3);
        ans.length.should.be.equal(3);
        ans[0].should.not.deepEqual(ans[1]);
        ans[0].should.not.deepEqual(ans[2]);

        let single = [[1, 1, 1]];

        let ansSingle = init.mostDistant(single, 1);
        ansSingle.length.should.be.equal(1);
        ansSingle[0].should.deepEqual([1, 1, 1]);
    });
});
