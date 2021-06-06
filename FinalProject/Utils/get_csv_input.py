# get_csv_input.py

import pandas as pd


# 获取csv file的相对路径
def get_csv_file_path(file_name):
    if file_name == "central_location.csv":
        return "./city_based_dataset/city_central_location/" + file_name
    if file_name == "city_features.csv":
        return "./city_based_dataset/city_features/" + file_name
    if file_name == "city_location_hash_table.csv":
        return "./city_based_dataset/city_location_hash_table/hash_table.csv"
    if file_name == "city_based_AQI.csv" or file_name == "city_based_IAQI.csv":
        return "./city_based_dataset/city_based_AQI/" + file_name


# 读取csv文件，并保存为dict形式返回. file_name 形如 "central_location.csv"
def get_csv_input(file_name):
    ret_dict = {}

    # Central location
    if file_name == "central_location.csv":
        csv_path = get_csv_file_path(file_name)
        df = pd.read_csv(csv_path, encoding="utf_8_sig")
        # Replace nan with integer 0
        df.fillna(0, inplace=True)
        # Traverse all rows
        for i in range(df.shape[0]):
            # Get city name
            city_name = df.loc[i].values[0]
            contents = list(df.loc[i].values[1: len(df.loc[i].values)])
            ret_dict[city_name] = contents
        # Format: {city_name: [lat, lon], ....}
        return ret_dict
    # City-location hash table
    if file_name == "city_location_hash_table.csv":
        csv_path = get_csv_file_path(file_name)
        df = pd.read_csv(csv_path, encoding="utf_8_sig")
        # Replace nan with integer 0
        df.fillna(0, inplace=True)
        # Traverse all rows
        for i in range(df.shape[0]):
            # Get city name
            city_name = df.loc[i].values[0]
            # Remove all 0
            contents = list(df.loc[i].values[1: len(df.loc[i].values)])
            while 0 in contents:
                contents.remove(0)
            # Transfer from str to list
            for j in range(len(contents)):
                str_list = contents[j]
                str_list = str_list.replace("[", "")
                str_list = str_list.replace("]", "")
                str_list = str_list.split(",")
                for k in range(len(str_list)):
                    str_list[k] = float(str_list[k])
                contents[j] = str_list
            ret_dict[city_name] = contents
        # Format: {city_name: [[lat, lon], ...], ....}
        return ret_dict
    # City features
    if file_name == "city_features.csv":
        csv_path = get_csv_file_path(file_name)
        df = pd.read_csv(csv_path, encoding="utf_8_sig")
        # Replace nan with integer 0
        df.fillna(0, inplace=True)
        # Traverse all rows
        for i in range(df.shape[0]):
            # Get city name
            city_name = df.loc[i].values[0]
            # Remove all 0
            contents = list(df.loc[i].values[1: len(df.loc[i].values)])
            while 0 in contents:
                contents.remove(0)
            # Transfer from str to list
            for j in range(len(contents)):
                str_list = contents[j]
                str_list = str_list.replace("[", "")
                str_list = str_list.replace("]", "")
                str_list = str_list.split(",")
                for k in range(len(str_list)):
                    str_list[k] = float(str_list[k])
                contents[j] = str_list

            ret_dict[city_name] = contents
        # Format: {city_name: [[features_vector], [features_vector]], ....}
        return ret_dict
    # City based AQI
    if file_name == "city_based_AQI.csv":
        csv_path = get_csv_file_path(file_name)
        df = pd.read_csv(csv_path, encoding="utf_8_sig")
        # Replace nan with integer 0
        df.fillna(0, inplace=True)
        # Traverse all rows
        for i in range(df.shape[0]):
            # Get city name
            city_name = df.loc[i].values[0]
            contents = list(df.loc[i].values[1: len(df.loc[i].values)])
            # Transfer from str to float
            for j in range(len(contents)):
                contents[j] = float(contents[j])

            ret_dict[city_name] = contents
        # Format: {city_name: [AQI_1, AQI_2, ...], ....}
        return ret_dict
    # City based IAQI
    if file_name == "city_based_IAQI.csv":
        csv_path = get_csv_file_path(file_name)
        df = pd.read_csv(csv_path, encoding="utf_8_sig")
        # Replace nan with integer 0
        df.fillna(0, inplace=True)
        # Traverse all rows
        for i in range(df.shape[0]):
            # Get city name
            city_name = df.loc[i].values[0]
            contents = list(df.loc[i].values[1: len(df.loc[i].values)])
            # Transfer from str to list
            for j in range(len(contents)):
                str_list = contents[j]
                str_list = str_list.replace("[", "")
                str_list = str_list.replace("]", "")
                str_list = str_list.split(",")
                for k in range(len(str_list)):
                    str_list[k] = float(str_list[k])
                contents[j] = str_list

            ret_dict[city_name] = contents
        # Format: {city_name: [AQI_1, AQI_2, ...], ....}
        return ret_dict
