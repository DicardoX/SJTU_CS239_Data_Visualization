import pandas as pd

dataset = pd.read_json("./dataset/ted_all.json")

dataset.to_csv("./dataset/ted_all.csv", index=None, mode='a')


