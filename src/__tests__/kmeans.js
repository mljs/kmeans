import kmeans from '../kmeans';

describe('K-means', () => {
  it('Simple case', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    let centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];

    let ans = kmeans(data, 2, { initialization: centers });
    expect(ans.clusters).toStrictEqual([0, 0, 1, 1]);
    expect(ans.centroids[0].centroid).toStrictEqual([1, 1.5, 1]);
    expect(ans.centroids[1].centroid).toStrictEqual([-1, -1, -1.25]);
    expect(ans.converged).toBe(true);
    expect(ans.iterations).toBe(2);
  });

  it('Simple case `withIterations`', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    let centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];

    let ans = kmeans(data, 2, {
      initialization: centers,
      withIterations: true,
    });
    for (let val of ans) {
      expect(val.clusters).toStrictEqual([0, 0, 1, 1]);
      expect(val.centroids[0].centroid).toStrictEqual([1, 1.5, 1]);
      expect(val.centroids[1].centroid).toStrictEqual([-1, -1, -1.25]);
    }
  });

  it('Nearest points', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    let centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];

    let ans = kmeans(data, 2, { initialization: centers });
    expect(
      ans.nearest([
        [10, 10, 1],
        [-2, -2, -2],
      ]),
    ).toStrictEqual([0, 1]);
  });

  it('Passing empty data or more centers than data', () => {
    expect(kmeans.bind(null, [], 2)).toThrow(
      /K should be a positive integer smaller than the number of points/,
    );
    expect(kmeans.bind(null, [[1, 2]], 2)).toThrow(
      /K should be a positive integer smaller than the number of points/,
    );

    expect(kmeans.bind(null, [[1, 2]])).toThrow(
      /K should be a positive integer smaller than the number of points/,
    );
    expect(kmeans.bind(null, [[1, 2]], -1)).toThrow(
      /K should be a positive integer smaller than the number of points/,
    );
    expect(kmeans.bind(null, [[1, 2]], 1.5)).toThrow(
      /K should be a positive integer smaller than the number of points/,
    );
  });

  it('Passing wrong initialization parameter', () => {
    expect(
      kmeans.bind(
        null,
        [
          [1, 2],
          [1, 2],
          [1, 2],
        ],
        2,
        { initialization: [1] },
      ),
    ).toThrow(/The initial centers should have the same length as K/);
    expect(
      kmeans.bind(
        null,
        [
          [1, 2],
          [1, 2],
          [1, 2],
        ],
        2,
        {
          initialization: 'lol',
        },
      ),
    ).toThrow(/Unknown initialization method: "lol"/);
  });

  it('Exceed number of operations', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    let centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];

    let ans = kmeans(data, 2, { initialization: centers, maxIterations: 1 });
    expect(ans.clusters).toStrictEqual([0, 0, 1, 1]);
    expect(ans.centroids[0].centroid).toStrictEqual([1, 1.5, 1]);
    expect(ans.centroids[1].centroid).toStrictEqual([-1, -1, -1.25]);
    expect(ans.converged).toBe(false);
    expect(ans.iterations).toBe(1);
  });

  it('Non limited convergence', () => {
    let data = [
      [1, 1, 1],
      [1, 2, 1],
      [10, 11, 1],
      [-1, 20, 1],
      [1, 1, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    let centers = [
      [1, 2, 1],
      [-1, -1, -1],
    ];

    let ans = kmeans(data, 2, {
      initialization: centers,
      maxIterations: 0,
      seed: 0,
    });
    expect(ans.clusters).toStrictEqual([1, 1, 0, 0, 1, 1, 1]);
    expect(ans.centroids[0].centroid).toStrictEqual([4.5, 15.5, 1]);
    expect(ans.centroids[1].centroid).toStrictEqual([0.2, 0.4, 0.1]);
    expect(ans.converged).toBe(true);
    expect(ans.iterations).toBe(3);
  });

  it('empty clusters', () => {
    let data = [
      [1, 1],
      [1.1, 0.95],
      [0, 0],
      [-0.04, 0.02],
    ];
    const result = kmeans(data, 3, {
      seed: 19,
      initialization: [
        [0, 0],
        [1, 1],
        [0.5, 0.5],
      ],
    });

    expect(result.centroids[2].size).toBe(0);
    // The centroid should have the same value than at initialization
    expect(result.centroids[2].centroid).toStrictEqual([0.5, 0.5]);
    expect(result.centroids[2].error).toBe(-1);
  });
});
