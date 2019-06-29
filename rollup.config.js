export default {
  input: 'src/kmeans.js',
  output: {
    file: 'kmeans.js',
    format: 'cjs'
  },
  external: ['ml-distance-euclidean', 'ml-nearest-vector', 'ml-random']
};
