# dataset_reshape.py

import numpy as np

# Cancel scientific counting
np.set_printoptions(suppress=True)


# Get dataset of npy file
def get_input(year, month):
    features_path = "./dataset/features/features_" + str(year) + "_" + str(month) + ".npy"
    locations_path = "./dataset/locations/locations_" + str(year) + "_" + str(month) + ".npy"
    # Features vectors: [[PM2.5, PM10, SO2, NO2, CO, O3, U(m/s), V(m/s), TEMP(K), RH(%), PSFC(Pa)], ...]
    features_vectors = np.load(features_path)
    # Location vectors: [[lat, lon, year, month, day], ...]
    locations_vectors = np.load(locations_path)

    print(features_vectors.shape)
    print(locations_vectors.shape)
    print(features_vectors[0])
    print(locations_vectors[0])


get_input(2013, 1)