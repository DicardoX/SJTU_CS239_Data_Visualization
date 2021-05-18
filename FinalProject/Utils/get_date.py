# get_date.py

import datetime


# 获取某个日期后的第n天是哪一天
def get_date(year=2013, month=1, day=1, shift=0):
    the_date = datetime.datetime(year, month, day)
    result_date = the_date + datetime.timedelta(days=shift)
    date = result_date.strftime('%Y_%m_%d')
    return date
