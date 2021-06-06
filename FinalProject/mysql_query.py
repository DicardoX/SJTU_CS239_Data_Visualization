# mysql_query.py

import pymysql

# Name of database:
DATABASE_NAME = "ChinaVis"

# Configurations
config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'XUE9508286011sz',
    'db': DATABASE_NAME,
    'local_infile': 1
}


# Query from table
def query_from_table(my_table_name, my_targets, my_operators, my_amounts):
    sql = """SELECT * FROM %s
             WHERE """ % my_table_name

    for i in range(len(my_targets)):
        if (my_table_name == "city_features" and (my_targets[i] == "date" or my_targets[i] == "city_name")) or (
                my_table_name == "central_location" and my_targets[i] == "city_name") or (
                my_table_name == "city_based_AQI"
                and (my_targets[i] == "date" or my_targets[i] == "city_name")) or (my_table_name == "city_based_IAQI"
                                                                                   and (my_targets[i] == "date" or
                                                                                        my_targets[i] == "city_name")):
            sql += "%s %s '%s' and " % (my_targets[i], my_operators[i], my_amounts[i]) if i < len(my_targets) - 1 \
                else "%s %s '%s'" % (my_targets[i], my_operators[i], my_amounts[i])
        else:
            sql += "%s %s %s and " % (my_targets[i], my_operators[i], my_amounts[i]) if i < len(my_targets) - 1 \
                else "%s %s %s" % (my_targets[i], my_operators[i], my_amounts[i])

    print(sql)

    try:
        cursor.execute(sql)
        m_results = cursor.fetchall()
        return m_results
    except SyntaxError as e:
        print("Error occurred when fetching data from database...")


# Query for central location
def query_central_location(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "central_location"
    print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
          (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results


# Query for city features
def query_city_features(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_features"
    print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
          (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results


# Query for city based AQI
def query_city_based_AQI(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_based_AQI"
    print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
          (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results


# Query for city based IAQI
def query_city_based_IAQI(my_targets, my_operators, my_amounts):
    if not (len(my_targets) == len(my_operators) == len(my_amounts) and len(my_targets) > 0):
        print("Error occurred when checking the length of list, please confirm the input...")
        return ()
    table_name = "city_based_IAQI"
    print("Querying table: %s | Targets: %s | Operators: %s | Amounts: %s" %
          (table_name, str(my_targets), str(my_operators), str(my_amounts)))
    m_results = query_from_table(table_name, my_targets, my_operators, my_amounts)
    return m_results


if __name__ == '__main__':
    # Establish database connection
    db_connection = pymysql.connect(**config)
    # Create cursor
    cursor = db_connection.cursor()

    # --------------------------- Query Part ----------------------------

    # # --------------- Option 1: Query for central location --------------
    # # Input settings. Note: Multiple conditions are supported
    # # - City_name: seen in generate_city_based_dataset.py
    # # - Lat (0.0 ~ 90.0)
    # # - Lon (0.0 ~ 180.0)
    # targets, operators, amounts = ["city_name", "lat"], ['=', '>'], ["合肥市", 30.0]
    # # Query
    # op1_results = query_central_location(my_targets=targets, my_operators=operators, my_amounts=amounts)
    # # print(op1_results)

    # # ---------------- Option 2: Query for city features ----------------
    # # Input settings. Note: Multiple conditions are supported
    # # - City_name: seen in generate_city_based_dataset.py
    # # - Date: "2013_01_01" ~ "2018_12_31"
    # # - Other features: PM2_5, PM10, SO2, NO2, CO, O3, U(m/s), V(m/s), TEMP(K), RH(%), PSFC(Pa)
    # targets, operators, amounts = ["city_name", "NO2"], ['=', '<'], ["合肥市", 5.0]
    # # Query
    # op2_results = query_city_features(my_targets=targets, my_operators=operators, my_amounts=amounts)
    # print(op2_results)

    # # ---------------- Option 3: Query for city based AQI ----------------
    # # Input settings. Note: Multiple conditions are supported
    # # - City_name: seen in generate_city_based_dataset.py
    # # - Date: "2013_01_01" ~ "2018_12_31"
    # # - AQI: 0 ~ 700
    # targets, operators, amounts = ["city_name", "date"], ['=', '='], ["合肥市", "2018_12_31"]
    # # Query
    # op3_results = query_city_based_AQI(my_targets=targets, my_operators=operators, my_amounts=amounts)
    # print(op3_results)

    # ---------------- Option 4: Query for city based IAQI ----------------
    # Input settings. Note: Multiple conditions are supported
    # - City_name: seen in generate_city_based_dataset.py
    # - Date: "2013_01_01" ~ "2018_12_31"
    # - IAQI: 0 ~ 700
    targets, operators, amounts = ["city_name", "date"], ['=', '='], ["合肥市", "2018_12_31"]
    # Query
    op4_results = query_city_based_IAQI(my_targets=targets, my_operators=operators, my_amounts=amounts)
    print(op4_results)

    # Close database connection
    db_connection.close()
