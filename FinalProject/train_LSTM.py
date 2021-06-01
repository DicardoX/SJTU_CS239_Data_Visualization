# train_LSTM.py

import numpy as np
import pandas as pd
import pypinyin
from tensorflow.keras.losses import mse
import tensorflow as tf
from matplotlib import pyplot as plt
import random
import os

from LSTM_class import LSTM_Network

# Cancel scientific counting
np.set_printoptions(suppress=True)


# Num of days in a train sample
sample_size = 7
# Batch size
batch_size = 16
# Learning rate
lr = 0.0001
# Dropout rate
dropout_rate = 0.3
# Num of features
n_features = 11
# Num of time steps in a sample
n_steps = 7
# Amount of test samples
n_test_samples = 100
# Total epochs for training
total_epochs = 100


# Get dataset of csv file
def get_input():
    csv_path = "./city_based_dataset/city_features/city_features.csv"
    df = pd.read_csv(csv_path, encoding="utf_8_sig")

    city_features_dict = {}

    # Max and min record for each type of pollutants
    max_record = [0.0 for i in range(n_features)]
    min_record = [1000000.0 for i in range(n_features)]

    # Traverse all rows
    for i in range(df.shape[0]):
        # Get city name
        city_name = df.loc[i].values[0]
        features_list = list(df.loc[i].values[1: len(df.loc[i].values)])

        for j in range(len(features_list)):
            features_list[j] = features_list[j].replace("[", "")
            features_list[j] = features_list[j].replace("]", "")
            features_list[j] = features_list[j].split(",")

            for k in range(len(features_list[j])):
                features_list[j][k] = float(features_list[j][k])
                # Update max and min
                if max_record[k] < features_list[j][k]:
                    max_record[k] = features_list[j][k]
                if min_record[k] > features_list[j][k]:
                    min_record[k] = features_list[j][k]
        city_features_dict[city_name] = np.array(features_list)

    return city_features_dict, max_record, min_record


# Construct samples
# First 7 days to predict the eighth day, the features of the eighth day is the label to all 7 days
# Input shape = [batch_size, n_steps, n_features] = [1, 7, 11]
def construct_samples(features_list):
    train_samples = []
    train_labels = []
    test_samples = []
    test_labels = []

    samples = []
    labels = []

    idx = [i for i in range(len(features_list) - sample_size)]
    random.shuffle(idx)

    for day in range(0, len(features_list) - sample_size, 1):
        # Shape of sample: [n_steps, n_features]
        sample = features_list[day:(day + sample_size)]
        label = features_list[day + sample_size]
        samples.append(sample)
        labels.append(label)

    for i in range(len(idx)):
        if i < len(idx) - n_test_samples:
            train_samples.append(samples[idx[i]])
            train_labels.append(labels[idx[i]])
        else:
            test_samples.append(samples[idx[i]])
            test_labels.append(labels[idx[i]])

    return np.array(train_samples), np.array(train_labels), np.array(test_samples), np.array(test_labels)


# Construct LSTM model
def construct_LSTM_model(input_shape, output_shape):
    # Construct sub LSTM network
    lstm_network = LSTM_Network(learning_rate=lr, dropout_rate=dropout_rate, learning_rate_decay=0.0,
                                input_shape=input_shape, output_shape=output_shape)
    # Get model of LSTM network
    model = lstm_network.get_model()
    return model


# LSTM Train based on city
def lstm_train_based_on_city(city_name, features_list):
    # Get Pin Yin of the city name
    pinyin_name = ""
    for letter in pypinyin.pinyin(city_name, style=pypinyin.NORMAL):
        pinyin_name += "".join(letter)
    city_name = pinyin_name

    # Construct batch
    print("--------------------------------------------------------------------")
    print("Constructing batches for training and test...")
    train_X, train_Y, test_X, test_Y = construct_samples(features_list)

    # Input shape = [time step, features num]
    input_shape = [n_steps, n_features]
    output_shape = [1, n_features]

    # Construct LSTM model
    print("--------------------------------------------------------------------")
    print("Constructing LSTM model...")
    model = construct_LSTM_model(input_shape, output_shape)

    # Loss list
    train_loss_list = []
    test_loss_list = []

    # Train model
    epoch = 0
    print("--------------------------------------------------------------------")
    print("Model training...")
    while epoch < total_epochs:
        # Shuffle the train_X
        new_train_X = []
        new_train_Y = []
        idx = [i for i in range(len(train_X))]
        random.shuffle(idx)
        for i in range(len(idx)):
            new_train_X.append(train_X[idx[i]])
            new_train_Y.append(train_Y[idx[i]])
        train_X = np.array(new_train_X.copy())
        train_Y = np.array(new_train_Y.copy())

        for idx in range(0, len(train_X) - batch_size, batch_size):
            train_loss = model.train_on_batch(train_X[idx:(idx + batch_size)], train_Y[idx:(idx + batch_size)])
            # train_loss_list.append(train_message.history["loss"][0])
            train_loss_list.append(train_loss)
            # print(train_loss)

        # Evaluate model
        loss = 0.0
        pred = model.predict(test_X)
        mse_error = mse(test_Y, pred)
        # Convert from tensor to numpy
        with tf.Session() as sess:
            loss_numpy = mse_error.eval()
            loss += np.mean(loss_numpy)

        # Cold start
        if epoch < 4:
            epoch += 1
            continue

        test_loss_list.append(loss)
        print("Iteration: %d/%d | MSE Error on test dataset: %6f ..." % (epoch + 1, total_epochs, loss))

        epoch += 1

    # Plot
    if city_name not in os.listdir("./output/figures"):
        os.mkdir("./output/figures/" + city_name)

    # Test loss
    plt.plot(test_loss_list)
    plt.title("Test Loss (MSE) Curve")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.ylim(bottom=0.)
    plt.savefig("./output/figures/" + city_name + "/test_loss")
    plt.show()
    # Train loss
    plt.plot(train_loss_list)
    plt.title("Train Loss (MSE) Curve")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.ylim(bottom=0.)
    plt.savefig("./output/figures/" + city_name + "/train_loss")
    plt.show()

    # Saving model
    print("------------------------------------------------------------------------------------")
    model_name = city_name + "_model.h5"
    model_path = "./models/" + model_name
    print("Saving trained model to path:", "\"" + model_path + "\"", "| Format: h5")
    model.save(model_path, save_format="h5")
    print("------------------------------------------------------------------------------------")


# Dataset normalization
def dataset_normalization(city_features_dict, max_record, min_record):
    for city_name in city_features_dict.keys():
        features_list = city_features_dict[city_name]
        for i in range(len(features_list)):
            for j in range(len(features_list[i])):
                features_list[i][j] = (features_list[i][j] - min_record[j]) / (max_record[j] - min_record[j])
    return city_features_dict


def main():
    # Get dataset
    print("--------------------------------------------------------------------")
    print("Dataset reading...")
    city_features_dict, max_record, min_record = get_input()

    # Normalization
    print("--------------------------------------------------------------------")
    print("Features normalization...")
    city_features_dict = dataset_normalization(city_features_dict, max_record, min_record)

    # Train
    lstm_train_based_on_city("合肥市", city_features_dict["合肥市"])


if __name__ == '__main__':
    main()
