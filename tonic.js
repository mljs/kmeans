'use strict';

const kmeans = require('ml-kmeans');

let data = [[1, 1, 1], [1,2,1], [-1, -1, -1], [-1,-1,-1.5]];
let centers = [[1,2,1], [-1, -1, -1]];

let ans = kmeans(data, 2, {initialization: centers});
console.log(ans.clusters);
console.log(ans.centroids);
