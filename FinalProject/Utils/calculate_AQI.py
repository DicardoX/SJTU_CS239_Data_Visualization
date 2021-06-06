# calculate_AQI.py


# Pollution types:
pollution_types = ["PM2_5", "PM10", "SO2", "NO2", "CO", "O3"]

# Pollution dicts:
pollution_standard_dict = {
    "Ref": [[0, 50], [50, 100], [100, 150], [150, 200], [200, 300], [300, 400], [400, 500]],
    "PM2_5": [[0, 35], [35, 75], [75, 115], [115, 150], [150, 250], [250, 350], [350, 500]],
    "PM10": [[0, 50], [50, 150], [150, 250], [250, 350], [350, 420], [420, 500], [500, 600]],
    "SO2": [[0, 50], [50, 150], [150, 475], [470, 800], [800, 1600], [1600, 2100], [2100, 2620]],
    "NO2": [[0, 40], [40, 80], [80, 180], [180, 280], [280, 565], [565, 750], [750, 940]],
    "CO": [[0, 2], [2, 4], [4, 14], [14, 24], [24, 36], [36, 48], [48, 60]],
    "O3": [[0, 100], [100, 160], [160, 215], [215, 265], [265, 800], [800, 1000], [1000, 1200]]
}


# Calculate individual AQI (IAQI)
def calculate_IAQI(pollution_type, amount):
    standard_list = pollution_standard_dict[pollution_type]
    ref = pollution_standard_dict["Ref"]
    # Traverse
    idx = 0
    while idx < len(standard_list) - 1 and amount > standard_list[idx][1]:
        idx += 1

    # Calculate IAQI
    IAQI = (ref[idx][1] - ref[idx][0]) / (standard_list[idx][1] - standard_list[idx][0]) * (
                amount - standard_list[idx][0]) + ref[idx][0]
    return IAQI


# Calculate AQI: PM2.5, PM10, SO2, NO2, CO, O3.
# - First, calculate IAQI for each type of pollution
# - Second, AQI = max(IAQI_1, IAQI_2, ...)
# - Third, level the AQI into 6 levels: 0 ~ 50, 51 ~ 100, 101 ~ 150, 151 ~ 200, 201 ~ 300, > 300
# - AQI level ref: https://wenku.baidu.com/view/583bc0f384254b35eefd3452.html
def calculate_AQI(pollution_list):
    AQI = 0
    # Traverse each type of pollution
    for i in range(len(pollution_list)):
        # Current IAQI
        cur_IAQI = calculate_IAQI(pollution_types[i], pollution_list[i])
        # Update AQI
        if AQI < cur_IAQI:
            AQI = cur_IAQI
    return AQI


def calculate_IAQI_list(pollution_list):
    IAQI = []
    # Traverse each type of pollution
    for i in range(len(pollution_list)):
        # Current IAQI
        cur_IAQI = calculate_IAQI(pollution_types[i], pollution_list[i])
        IAQI.append(round(cur_IAQI, 2))
    return IAQI

