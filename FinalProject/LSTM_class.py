# LSTM_class.py

import os
import sys
import numpy as np
import tensorflow.keras as keras
from tensorflow.keras.layers import Dense, LSTM, Dropout, Flatten
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import Adadelta, Adam, Adagrad
from tensorflow.keras.utils import to_categorical


# Input shape: [batch_size, input_dim] = [32, 150]


class LSTM_Network(keras.Model):
    def __init__(self, learning_rate, learning_rate_decay, dropout_rate, input_shape, output_shape):
        super(LSTM_Network, self).__init__()
        self._lr = learning_rate
        self._decay = learning_rate_decay
        self._dropout_rate = dropout_rate
        self._input_shape = input_shape
        self._output_shape = output_shape
        # Model
        self.model = Sequential()
        # Build net
        self._build_net()

    def _build_net(self):
        # ------------------ Build LSTM Network ------------------
        # In the last LSTM layer, return_sequences should be False, else should be True
        # LSTM layer 1
        # self.model.add(LSTM(units=32, input_shape=self._input_shape, return_sequences=False, activation="tanh"))
        self.model.add(LSTM(units=64, input_shape=self._input_shape, recurrent_regularizer="l2",
                            return_sequences=False, recurrent_activation="softsign", activation="tanh"))
        # Dropout layer 1
        self.model.add(Dropout(rate=self._dropout_rate))
        # Dense layer
        self.model.add(Dense(units=32, input_shape=[self._input_shape[0], 64], activation="relu"))
        # # Dropout layer 3
        # self.model.add(Dropout(rate=self._dropout_rate))
        # Output layer
        self.model.add(Dense(units=self._output_shape[1], input_shape=[self._input_shape[0], 32], activation="tanh"))

        # # LSTM layer 1
        # self.model.add(LSTM(units=32, input_shape=self._input_shape, return_sequences=False, activation="relu"))
        # # Dense layer 1
        # self.model.add(Dense(units=11))

        # Model configuration
        self.model.compile(
            optimizer=Adam(lr=self._lr, decay=self._decay),
            loss="mse",
        )

    # Get model
    def get_model(self):
        return self.model
