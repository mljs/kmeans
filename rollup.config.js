export default {
  input: 'src/kmeans.js',
  output: {
    file: 'kmeans.js',
    format: 'cjs'
  },
  external: ['RandomSelection', 'ml-distance-euclidean', 'ml-nearest-vector']
};
