'use strict';

const kmeans = require('..');

describe('K-means', function () {

    it('Simple case', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
        let centers = [[1, 2, 1], [-1, -1, -1]];

        let ans = kmeans(data, 2, {initialization: centers});
        ans.should.deepEqual({
            clusters: [0, 0, 1, 1],
            centroids: [ [1, 1.5, 1], [-1, -1, -1.25] ]
        });
    });

    it('Simple case `withIterations`', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
        let centers = [[1, 2, 1], [-1, -1, -1]];

        let ans = kmeans(data, 2, {initialization: centers, withIterations: true});
        ans.clusters.should.deepEqual([0, 0, 1, 1]);
        ans.centroids.should.deepEqual([ [1, 1.5, 1], [-1, -1, -1.25] ]);
        ans.iterations.length.should.be.equal(2);
    });

    it('Passing empty data or more centers than data', function () {
        kmeans.bind(null, [], 2).should.throw('K should be a positive integer bigger than the number of points');
        kmeans.bind(null, [ [1, 2] ], 2).should.throw('K should be a positive integer bigger than the number of points');
        kmeans.bind(null, [ [1, 2] ]).should.throw('K should be a positive integer bigger than the number of points');
        kmeans.bind(null, [ [1, 2] ], -1).should.throw('K should be a positive integer bigger than the number of points');
        kmeans.bind(null, [ [1, 2] ], 1.5).should.throw('K should be a positive integer bigger than the number of points');
    });

    it('Passing wrong initialization parameter', function () {
        kmeans.bind(null, [ [1, 2], [1, 2], [1, 2] ], 2, {initialization: [1]}).should.throw('The initial centers should have the same length as K');
        kmeans.bind(null, [ [1, 2], [1, 2], [1, 2] ], 2, {initialization: 'n\'importe quoi'}).should.throw('Unknown initialization method: "n\'importe quoi"');
    });

    it('Exceed number of operations', function () {
        let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
        let centers = [[1, 2, 1], [-1, -1, -1]];

        kmeans(data, 2, {initialization: centers, maxIterations: 0}).should.deepEqual({
            clusters: [0, 0, 1, 1],
            centroids: centers
        });

        kmeans(data, 2, {initialization: centers, maxIterations: 0, withIterations: true}).should.deepEqual({
            clusters: [0, 0, 1, 1],
            centroids: centers,
            iterations: []
        });
    });
});
