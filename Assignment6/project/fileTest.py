import pandas as pd


def read_csv(filepath):
    file = pd.read_csv(filepath)
    return file


file = read_csv("./static/data/hotel.csv")

print(file.shape)
array = file['female']
print(list(array))
