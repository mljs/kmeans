import kmeans from '../kmeans';

describe('K-means', function () {
  it('Simple case', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
    let centers = [[1, 2, 1], [-1, -1, -1]];

    let ans = kmeans(data, 2, { initialization: centers });
    expect(ans.clusters).toEqual([0, 0, 1, 1]);
    expect(ans.centroids[0].centroid).toEqual([1, 1.5, 1]);
    expect(ans.centroids[1].centroid).toEqual([-1, -1, -1.25]);
    expect(ans.converged).toBe(true);
    expect(ans.iterations).toBe(2);
  });

  it('Simple case `withIterations`', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
    let centers = [[1, 2, 1], [-1, -1, -1]];

    let ans = kmeans(data, 2, {
      initialization: centers,
      withIterations: true
    });
    for (var val of ans) {
      expect(val.clusters).toEqual([0, 0, 1, 1]);
      expect(val.centroids[0].centroid).toEqual([1, 1.5, 1]);
      expect(val.centroids[1].centroid).toEqual([-1, -1, -1.25]);
    }
  });

  it('Nearest points', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
    let centers = [[1, 2, 1], [-1, -1, -1]];

    let ans = kmeans(data, 2, { initialization: centers });
    expect(ans.nearest([[10, 10, 1], [-2, -2, -2]])).toEqual([0, 1]);
  });

  it('Passing empty data or more centers than data', function () {
    expect(kmeans.bind(null, [], 2)).toThrow(
      /K should be a positive integer smaller than the number of points/
    );
    expect(kmeans.bind(null, [[1, 2]], 2)).toThrow(
      /K should be a positive integer smaller than the number of points/
    );

    expect(kmeans.bind(null, [[1, 2]])).toThrow(
      /K should be a positive integer smaller than the number of points/
    );
    expect(kmeans.bind(null, [[1, 2]], -1)).toThrow(
      /K should be a positive integer smaller than the number of points/
    );
    expect(kmeans.bind(null, [[1, 2]], 1.5)).toThrow(
      /K should be a positive integer smaller than the number of points/
    );
  });

  it('Passing wrong initialization parameter', function () {
    expect(
      kmeans.bind(null, [[1, 2], [1, 2], [1, 2]], 2, { initialization: [1] })
    ).toThrow(/The initial centers should have the same length as K/);
    expect(
      kmeans.bind(null, [[1, 2], [1, 2], [1, 2]], 2, {
        initialization: 'lol'
      })
    ).toThrow(/Unknown initialization method: "lol"/);
  });

  it('Exceed number of operations', function () {
    let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
    let centers = [[1, 2, 1], [-1, -1, -1]];

    let ans = kmeans(data, 2, { initialization: centers, maxIterations: 1 });
    expect(ans.clusters).toEqual([0, 0, 1, 1]);
    expect(ans.centroids[0].centroid).toEqual([1, 1.5, 1]);
    expect(ans.centroids[1].centroid).toEqual([-1, -1, -1.25]);
    expect(ans.converged).toBe(false);
    expect(ans.iterations).toBe(1);
  });

  it('Non limited convergence', function () {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [10, 11, 1],
      [-1, 20, 1],
      [1, 1, 1],
      [-1, -1, -1],
      [-1, -1, -1.5]
    ];
    let centers = [[1, 2, 1], [-1, -1, -1]];

    let ans = kmeans(data, 2, { initialization: centers, maxIterations: 0 });
    expect(ans.clusters).toEqual([1, 1, 0, 0, 1, 1, 1]);
    expect(ans.centroids[0].centroid).toEqual([4.5, 15.5, 1]);
    expect(ans.centroids[1].centroid).toEqual([0.2, 0.4, 0.1]);
    expect(ans.converged).toBe(true);
    expect(ans.iterations).toBe(3);
  });
});
