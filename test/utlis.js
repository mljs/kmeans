'use strict';

const utils = require('../src/utils');
const squaredDistance = require('ml-distance-euclidean').squared;

describe('Utils methods', function () {
    describe('computeDispersion', function () {
        it('Same points', function () {
            let data = [[1, 2, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1]];
            let centers = [[1, 2, 1], [-1, -1, -1]];
            let clusterID = [0, 0, 1, 1];

            let ans = utils.computeDispersion(data, centers, clusterID, squaredDistance);
            ans.should.deepEqual([0, 0]);
        });

        it('Simple case', function () {
            let data = [[1, 2, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -3]];
            let centers = [[1, 2, 1], [-1, -1, -1]];
            let clusterID = [0, 0, 1, 1];

            let ans = utils.computeDispersion(data, centers, clusterID, squaredDistance);
            ans.should.deepEqual([0, 2]);
        });
    });

    describe('calculateDistanceMatrix', function () {
        it('Same points', function () {
            let data = [[1, 1, 1], [1, 2, 1], [1, 1, 1], [1, 2, 1]];

            let ans = utils.calculateDistanceMatrix(data, squaredDistance);
            ans.should.deepEqual([
                [0, 1, 0, 1],
                [1, 0, 1, 0],
                [0, 1, 0, 1],
                [1, 0, 1, 0]
            ]);
        });

        it('Simple case', function () {
            let data = [[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4]];

            let ans = utils.calculateDistanceMatrix(data, squaredDistance);
            ans.should.deepEqual([
                [0, 3, 12, 27],
                [3, 0, 3, 12],
                [12, 3, 0, 3],
                [27, 12, 3, 0]
            ]);
        });
    });

    describe('updateClusterID', function () {
        it('Simple case', function () {
            let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
            let centers = [[1, 2, 1], [-1, -1, -1]];
            let clusterID = [0, 0, 0, 0];

            let ans = utils.updateClusterID(data, centers, clusterID, squaredDistance);
            ans.should.deepEqual([0, 0, 1, 1]);
        });

        it('Bigger case', function () {
            let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [100, 100, 100]];
            let centers = [[1, 2, 1], [10, 20, 100], [-1, -1, -1]];
            let clusterID = [0, 0, 0, 0];

            let ans = utils.updateClusterID(data, centers, clusterID, squaredDistance);
            ans.should.deepEqual([0, 0, 2, 1]);
        });
    });

    describe('updateCenters', function () {
        it('Simple case', function () {
            let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
            let clusterID = [0, 0, 1, 1];

            let ans = utils.updateCenters(data, clusterID, 2);
            ans.should.deepEqual([[1, 1.5, 1], [-1, -1, -1.25]]);
        });
    });

    describe('converged', function () {
        it('Same points', function () {
            let centers = [[1, 2, 1], [-1, -1, -1]];
            let oldCenters = [[1, 2, 1], [-1, -1, -1]];

            let ans = utils.converged(centers, oldCenters, squaredDistance, 0.0005);
            ans.should.be.equal(true);
        });

        it('Different points', function () {
            let centers = [[1, 2, 1], [-1, -1, -1]];
            let oldCenters = [[1, 2, 1], [-1, -1, -5]];

            let ans = utils.converged(centers, oldCenters, squaredDistance, 0.0005);
            ans.should.be.equal(false);
        });
    });
});
