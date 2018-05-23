from sklearn.cluster import KMeans
# from sklearn import datasets
from scipy import random

r = random.random()

# iris = datasets.load_iris()
X = [[1.,  0.75,  1.125],
     [1.,  1.75,  1.125],
     [-1., -1.25, -0.875],
     [-1., -1.25, -1.375]]
# X = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]]
print(X)
kmeans = KMeans(n_clusters=2, random_state=10,
                max_iter=1).fit(X)
# print(kmeans.cluster_centers_)
