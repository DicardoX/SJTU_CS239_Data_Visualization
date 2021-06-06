# generate_city_based_dataset.py

import requests
import json
import numpy as np
import urllib
import hashlib
import pandas as pd
import socket
import time
import os

from Utils.get_csv_input import get_csv_input
from Utils.calculate_AQI import calculate_AQI, calculate_IAQI_list

# Cancel scientific counting
np.set_printoptions(suppress=True)

# Set global operation out time
socket.setdefaulttimeout(120)

my_sk = "dmB6gv2A4cDno5L6H0oAnDSDHPWF29hH"
my_ak = "GaKdk3SoyEwL1TcGoDu1ZGluI3gVQhY8"


# Transfer lat and lon into city name
def get_city_name(lat, lon):
    # Address -> lat, lon (geocoding)
    # query_str = '/geocoding/v3/?address={}&output=json&ak={}'.format("清华大学", my_ak)
    # Lat, lon -> address (reverse_geocoding)
    query_str = '/reverse_geocoding/v3/?location={}&output=json&ak={}'.format(str(lat) + "," + str(lon), my_ak)
    # 对queryStr进行转码，safe内的保留字符不转换
    encoded_str = urllib.parse.quote(query_str, safe="/:=&?#+!$,;'@()*[]")
    # 在最后追加sk
    raw_str = encoded_str + my_sk
    # 计算sn
    sn = (hashlib.md5(urllib.parse.quote_plus(raw_str).encode("utf8")).hexdigest())
    # 由于URL里面含有中文，所以需要用parse.quote进行处理，然后返回最终可调用的url
    url = urllib.parse.quote("http://api.map.baidu.com" + query_str + "&sn=" + sn, safe="/:=&?#+!$,;'@()*[]")
    # print('URL:', url)

    maxTryNum = 10
    for tries in range(maxTryNum):
        try:
            req = urllib.request.urlopen(url)
            res = req.read().decode()
            break
        except:
            if tries < (maxTryNum - 1):
                continue
            else:
                print("Has tried %d times to access url %s, all failed!", maxTryNum, url)
                break

    # Parse data, get city name
    city_name = ""
    try:
        # 将 JSON 对象转换为 Python 字典
        json_data = json.loads(res)
        # print(json_data)
    except:
        json_data = None

    if not json_data or 'status' not in json_data or json_data['status'] != 0:
        print('json数据获取失败')
    else:
        # 输出Json数据
        # res = json.dumps(json_data, indent=4, ensure_ascii=False) # 转化为字符串
        city_name = json_data["result"]["addressComponent"]["city"]

    return city_name


# Get dataset of npy file
def get_input(year, month, day, type):
    features_path = "./dataset/features/" + str(year) + "_" + str(month).zfill(2) + "/features_" + str(
        year) + "_" + str(month) \
                    + "_" + str(day) + ".npy"
    locations_path = "./dataset/locations/" + str(year) + "_" + str(month).zfill(2) + "/locations_" + str(
        year) + "_" + str(month) \
                     + "_" + str(day) + ".npy"
    # Features vectors: [[PM2.5, PM10, SO2, NO2, CO, O3, U(m/s), V(m/s), TEMP(K), RH(%), PSFC(Pa)], ...]
    features_vectors = np.load(features_path)
    # Location vectors: [[lat, lon], ...]
    locations_vectors = np.load(locations_path)

    if type == 0:
        return features_vectors, locations_vectors

    ret_dict = {}

    for i in range(len(features_vectors)):
        key = "[" + str(locations_vectors[i][0]) + ", " + str(locations_vectors[i][1]) + "]"
        ret_dict[key] = list(features_vectors[i])

    return ret_dict


# Observed city list
observed_city_name = ["上海", "上海市",
                      "北京", "北京市",
                      "天津", "天津市",
                      "重庆", "重庆市",
                      "哈尔滨", "哈尔滨市", "大庆", "大庆市", "齐齐哈尔", "齐齐哈尔市",
                      "长春", "长春市", "吉林", "吉林市", "四平", "四平市",
                      "大连", "大连市", "沈阳", "沈阳市", "铁岭", "铁岭市",
                      "呼和浩特", "呼和浩特市", "包头", "包头市", "鄂尔多斯", "鄂尔多斯市",
                      "石家庄", "石家庄市", "唐山", "唐山市", "保定", "保定市", "承德", "承德市",
                      "太原", "太原市", "大同", "大同市", "临汾", "临汾市",
                      "青岛", "青岛市", "济南", "济南市", "烟台", "烟台市", "威海", "威海市",
                      "郑州", "郑州市", "洛阳", "洛阳市", "开封", "开封市",
                      "南京", "南京市", "苏州", "苏州市", "扬州", "扬州市", "徐州", "徐州市",
                      "合肥", "合肥市", "黄山", "黄山市", "芜湖", "芜湖市",
                      "武汉", "武汉市", "襄阳", "襄阳市", "宜昌", "宜昌市", "荆州", "荆州市",
                      "长沙", "长沙市", "岳阳", "岳阳市", "张家界", "张家界市",
                      "南昌", "南昌市", "九江", "九江市", "景德镇", "景德镇市",
                      "杭州", "杭州市", "宁波", "宁波市", "温州", "温州市", "舟山", "舟山市",
                      "厦门", "厦门市", "泉州", "泉州市", "福州", "福州市",
                      "广州", "广州市", "深圳", "深圳市", "珠海", "珠海市",
                      "桂林", "桂林市", "南宁", "南宁市", "北海", "北海市",
                      "三亚", "三亚市", "海口", "海口市", "文昌", "文昌市",
                      "遵义", "遵义市", "贵阳", "贵阳市", "安顺", "安顺市",
                      "昆明", "昆明市", "丽江", "丽江市", "大理", "大理市",
                      "成都", "成都市", "绵阳", "绵阳市", "宜宾", "宜宾市", "乐山", "乐山市",
                      "西安", "西安市", "延安", "延安市", "咸阳", "咸阳市",
                      "兰州", "兰州市", "天水", "天水市", "敦煌", "敦煌市",
                      "银川", "银川市", "中卫", "中卫市", "吴忠", "吴忠市",
                      "西宁", "西宁市", "格尔木", "格尔木市", "海东", "海东市",
                      "乌鲁木齐", "乌鲁木齐市", "吐鲁番", "吐鲁番市", "喀什", "喀什市", "哈密", "哈密市",
                      "拉萨", "拉萨市", "林芝", "林芝市",
                      "台北", "台北市", "高雄", "高雄市", "桃园", "桃园市", "台南", "台南市", "花莲", "花莲市"]


# Generate city list (from locations to city) based on observed_city_list
def generate_city_list():
    observed_city_dict = {}

    # Get input
    features_vectors, locations_vectors = get_input(2013, 1, 1, 0)

    for i in range(len(locations_vectors)):
        if i % 100 == 0:
            time.sleep(1)  # In case that banned by the API server due to the frequent visit
            print("Traversed locations:", str(i) + "/" + str(len(locations_vectors)))
        city_name = get_city_name(locations_vectors[i][0], locations_vectors[i][1])
        # Record only observed city data
        # Part of the address does not contain city name
        if city_name != "" and city_name in observed_city_name:
            print("City name:", city_name, " | Lat:", locations_vectors[i][0], " | Lon:", locations_vectors[i][1], " |",
                  (len(locations_vectors) - i - 1), "locations remaining...")
            if city_name in observed_city_dict.keys():
                observed_city_dict[city_name].append([locations_vectors[i][0], locations_vectors[i][1]])
            else:
                observed_city_dict[city_name] = [[locations_vectors[i][0], locations_vectors[i][1]]]

    # Write to csv file by pd.to_csv(), encoding with "utf_8_sig" to save Chinese correctly
    new_df = pd.DataFrame.from_dict(observed_city_dict, orient='index')  # Write by rows: row1: city_name1 xx, xx, ...
    # | row2: city_name2 xx, xx, ...
    new_df.to_csv('./city_based_dataset/city_location_hash_table/hash_table.csv', encoding="utf_8_sig")


# Get the central lat and lon of a city in observed city list
def get_central_location_of_city():
    # City central location dict
    city_central_dict = {}

    # Read city - location hash table
    csv_path = "./city_based_dataset/city_location_hash_table/hash_table.csv"
    df = pd.read_csv(csv_path, encoding="utf_8_sig")
    # Replace nan with integer 0
    df.fillna(0, inplace=True)
    # Traverse all rows
    for i in range(df.shape[0]):
        # Get city name
        city_name = df.loc[i].values[0]
        locations_list = list(df.loc[i].values[1: len(df.loc[i].values)])
        # Remove all 0
        while 0 in locations_list:
            locations_list.remove(0)
        # Calculate average lat and lon for this city
        avg_lat, avg_lon = 0.0, 0.0
        for location in locations_list:
            # Transfer str to list
            location = json.loads(location)
            avg_lat += location[0]
            avg_lon += location[1]
        avg_lat /= float(len(locations_list))
        avg_lon /= float(len(locations_list))

        city_central_dict[city_name] = [round(avg_lat, 2), round(avg_lon, 2)]

    # Write to csv file by pd.to_csv(), encoding with "utf_8_sig" to save Chinese correctly
    new_df = pd.DataFrame.from_dict(city_central_dict, orient='index')  # Write by rows: row1: city_name1 xx, xx, ...
    # | row2: city_name2 xx, xx, ...
    new_csv_path = "./city_based_dataset/city_central_location/central_location.csv"
    new_df.to_csv(new_csv_path, encoding="utf_8_sig")


# Generate city based dataset: features
def generate_city_dataset():
    # City-location hash table
    hash_table = {}
    # Read city - location hash table
    csv_path = "./city_based_dataset/city_location_hash_table/hash_table.csv"
    df = pd.read_csv(csv_path, encoding="utf_8_sig")
    # Replace nan with integer 0
    df.fillna(0, inplace=True)

    # Traverse all rows
    for i in range(df.shape[0]):
        # # Get city name
        city_name = df.loc[i].values[0]
        locations_list = list(df.loc[i].values[1: len(df.loc[i].values)])
        # Remove all 0
        while 0 in locations_list:
            locations_list.remove(0)
        hash_table[city_name] = locations_list

    # Date range
    years = [2013, 2014, 2015, 2016, 2017, 2018]
    months = [i + 1 for i in range(12)]

    avg_city_features_dict = {}

    # Counter
    counter = 0

    # Traverse the npy files
    for year in years:
        for month in months:
            dir_path = "./dataset/features/" + str(year) + "_" + str(month).zfill(2)
            days = [i + 1 for i in range(len(os.listdir(dir_path)))]
            for day in days:
                print("Traverse in", str(year) + ",", str(month).zfill(2) + ",", str(day).zfill(2), "...")
                locations_features_dict = get_input(year, month, day, 1)

                # Traverse hash_table
                for city_name in hash_table.keys():
                    for location in hash_table[city_name]:
                        features = locations_features_dict[location]
                        # If not found this city_name in avg_city_features_dict
                        if city_name not in avg_city_features_dict.keys():
                            avg_city_features_dict[city_name] = []
                        else:
                            if len(avg_city_features_dict[
                                       city_name]) == counter + 1:  # Already update at least once
                                for i in range(0, len(features)):
                                    avg_city_features_dict[city_name][counter][i] += features[i]
                            else:
                                avg_city_features_dict[city_name].append(features)
                # Average
                for city_name in avg_city_features_dict.keys():
                    for i in range(len(avg_city_features_dict[city_name][counter])):
                        avg_city_features_dict[city_name][counter][i] = round(
                            avg_city_features_dict[city_name][counter][i]
                            / len(hash_table[city_name]), 2)
                counter += 1

    # Write to csv file by pd.to_csv(), encoding with "utf_8_sig" to save Chinese correctly
    new_df = pd.DataFrame.from_dict(avg_city_features_dict,
                                        orient='index')  # Write by rows: row1: city_name1 [features], [features], ...
    # | row2: city_name2 [features], [features], ...
    new_df.to_csv('./city_based_dataset/city_features/city_features.csv', encoding="utf_8_sig")

    return


# Generate city based AQI
def generate_city_based_AQI():
    print("Generating city based AQI...")
    city_AQI_dict = {}

    # Get input
    features_dict = get_csv_input("city_features.csv")

    # Traverse cities
    for key in features_dict.keys():
        city_name = key
        features_vectors_list = features_dict[city_name]
        city_AQI_dict[city_name] = []
        for i in range(len(features_vectors_list)):
            AQI = round(calculate_AQI(features_vectors_list[i][0:6]), 2)
            city_AQI_dict[city_name].append(AQI)

    # Write to csv file by pd.to_csv(), encoding with "utf_8_sig" to save Chinese correctly
    new_df = pd.DataFrame.from_dict(city_AQI_dict, orient='index')
    new_df.to_csv('./city_based_dataset/city_based_AQI/city_based_AQI.csv', encoding="utf_8_sig")


# Generate city based IAQI
def generate_city_based_IAQI():
    print("Generating city based IAQI...")
    city_AQI_dict = {}

    # Get input
    features_dict = get_csv_input("city_features.csv")

    # Traverse cities
    for key in features_dict.keys():
        city_name = key
        features_vectors_list = features_dict[city_name]
        city_AQI_dict[city_name] = []
        for i in range(len(features_vectors_list)):
            IAQI_list = calculate_IAQI_list(features_vectors_list[i][0:6])
            print(IAQI_list)
            city_AQI_dict[city_name].append(IAQI_list)

    # Write to csv file by pd.to_csv(), encoding with "utf_8_sig" to save Chinese correctly
    new_df = pd.DataFrame.from_dict(city_AQI_dict, orient='index')
    new_df.to_csv('./city_based_dataset/city_based_AQI/city_based_IAQI.csv', encoding="utf_8_sig")


if __name__ == '__main__':
    # # Generate city list (from locations to city) based on observed_city_list
    # # Call for Baidu Map API
    # generate_city_list()

    # # Get central location of cities
    # get_central_location_of_city()

    # Generate city based dataset: features
    # generate_city_dataset()

    # Generate city based AQI
    # generate_city_based_AQI()

    # Generate city based IAQI
    generate_city_based_IAQI()



