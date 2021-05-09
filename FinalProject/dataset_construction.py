# dataset_construction.py

import pandas as pd
import numpy as np
import os

# Cancel scientific counting
np.set_printoptions(suppress=True)


# Get year, month, day
def get_date(file_name):
    str_list = file_name.split("-")
    date_message = str_list[3].split(".")[0]
    year = int(date_message[0:4])
    month = int(date_message[4:6])
    day = int(date_message[6:8])
    return year, month, day


# Extract features, operate classification and construct features vector
# Data format: PM2.5, PM10, SO2, NO2, CO, O3, U(m/s), V(m/s), TEMP(K), RH(%), PSFC(Pa), lat, lon
def pre_processing():
    # File counter
    file_counter = 0

    # Get all sub-dir names
    dir_names = os.listdir("ori_dataset")
    # Remove hidden file
    if ".DS_Store" in dir_names:
        dir_names.remove(".DS_Store")
    # Sort dir names
    dir_names.sort()
    # Read each sub-dir
    for dir_name in dir_names:
        # Get year, month
        year, month = dir_name[0: 4], dir_name[4:6]
        # Update file counter
        file_counter += 1
        # CSV counter
        csv_counter = 0

        # Read file names
        dir_path = "./ori_dataset/" + dir_name
        file_names = os.listdir(dir_path)
        # Remove hidden file
        if ".DS_Store" in file_names:
            file_names.remove(".DS_Store")
        # Sort file names
        file_names.sort()
        print("---------------------------------")
        print("Dir name: \"" + dir_name + "\" ...", "Iteration:", str(file_counter) + "/" + str(len(dir_names)))

        # Make dir in dataset folder based on year and month
        input_dir_name = str(year) + "_" + str(month)
        features_input_dir_path = "./dataset/features/" + input_dir_name
        locations_input_dir_path = "./dataset/locations/" + input_dir_name
        if input_dir_name not in os.listdir("dataset/features"):
            os.mkdir(features_input_dir_path)
        if input_dir_name not in os.listdir("dataset/locations"):
            os.mkdir(locations_input_dir_path)

        # Read each CSV file
        for file_name in file_names:
            # Features vector: [[PM2.5, PM10, SO2, NO2, CO, O3, U(m/s), V(m/s), TEMP(K), RH(%), PSFC(Pa)], ...]
            features_vectors = []
            # Location vector: [[lat, lon], ...]
            locations_vectors = []
            csv_counter += 1
            print("Read file:", file_name, "...", str(csv_counter) + "/" + str(len(file_names)))
            file_path = dir_path + "/" + file_name
            ori_csv_data = pd.read_csv(file_path)
            # Remove empty col
            ori_csv_data = ori_csv_data.drop([" "], axis=1)
            # Transfer from dataframe to ndarray
            ori_csv_data = ori_csv_data.values
            # Get date message
            year, month, day = get_date(file_name)

            # Traverse csv
            for i in range(len(ori_csv_data)):
                features_vector = []
                locations_vector = []
                for j in range(len(ori_csv_data[i])):
                    if j < 11:
                        features_vector.append(ori_csv_data[i][j])
                    else:
                        locations_vector.append(ori_csv_data[i][j])
                # # Add date into locations_vector
                # locations_vector = locations_vector + [year, month, day]
                # Add into vectors
                features_vectors.append(np.array(features_vector))
                locations_vectors.append(np.array(locations_vector))
            # Save as .npy file
            # print("Saving for npy files...")
            npy_file_name = str(year) + "_" + str(month) + "_" + str(day) + ".npy"
            np.save(features_input_dir_path + "/features_" + npy_file_name, features_vectors)
            np.save(locations_input_dir_path + "/locations_" + npy_file_name, locations_vectors)

    print("---------------------------------")
    print("Input construction completed!")


def main():
    # Data pre-processing
    pre_processing()


if __name__ == '__main__':
    main()
