# ChinaVis 2021数据可视化竞赛

#### Course Project of 2021 SJTU CS239 Data Visualization

[ChinaVis 2021 挑战赛官网](http://chinavis.org/2021/challenge.html)

​		目前，我国大气污染防治成效显著，这得益于我国逐渐完善的空气质量监测网。近年来，空气质量监测站收集到大量具有高维、时序特点的空气质量数据，如何利用此类数据，分析理解大气污染传输模式，并为决策者提供有效建议十分具有挑战性。利用大数据分析技术和可视化方法，能够分析大气污染问题及成因、监测大气污染发展趋势、分析大气污染的地域相关性，快速感知大气污染的时变规律，辅助工作人员因地制宜地制定防治策略。大数据可视分析与可视化将数据智能处理、视觉表征和交互分析有机地结合，使机器智能和人类智慧深度融合、优势互补，为大气污染防治工作的分析、指挥和决策提供有效手段和决策依据。第八届中国可视化与可视分析大会数据可视化竞赛向相关研究人员、高校师生、企业和数据可视分析爱好者、艺术家征集相关数据可视分析和艺术可视化作品。

​		参赛作品要求利用竞赛提供的2013–2018年中国高分辨率大气污染再分析开放数据集（http://naq.cicidata.top:10443/chinavis/opendata），利用可视分析技术与可视化方法，探索并发现空气质量大数据背后隐藏的模式和规律。该数据是覆盖全国范围的基于地理空间网格的空气质量再分析数据和对应的气象数据，包括六项常规污染物、风速、温度、气压、相对湿度和经纬度在内的13个属性（详细数据说明请登录开放数据集网站）。本次数据可视化竞赛分为两个赛道：

- **数据可视分析挑战赛赛道**，参赛选手可以选择但不限于以下主题：
  - 大气污染源分析：利用可视分析技术，识别主要大气污染源，分析关键污染成因。（可以根据自身情况联合其他数据辅助分析）
  - 大气污染时空态势分析：利用可视分析技术，分析大气污染时空分布模式、监控大气污染时空演变态势。
  - 大气污染传输模式分析：利用可视分析技术，比较各地大气污染物差异、大气污染传输模式、检测异常传输事件，制定传输防治策略。
  - 大气污染预测：利用可视分析技术，预测大气污染发展趋势、重污染天气预警。
  - 大气环境的改善：利用可视分析技术，展示大气污染治理过程中的大气环境状况、评估大气污染防治措施。
  - 自选主题，提炼分析需求，设置分析问题，并提供解决方案。

- **艺术可视化赛道，主题为“你我呼吸的空气”**，具体要求请移步艺术竞赛征稿通知主题2（http://chinavisap.net/comp-call-for-entries.html）。

-----



## 1. 基于 *Flask* 框架 的 *Python* 后端实现

### 1.1 City Based Dataset

- `./city_location_hash_table/hash_table.csv`：从 *location* 到 *city name* 的哈希映射
  - 格式为：
    - *City_name_1: [lat1, lon1], [lat2, lon2], ...*
    - *City_name_2: [lat1, lon1], [lat2, lon2], ...*
    - *...*
- `./city_central_location/central_location.csv`：所研究城市对应的中心 *location*，由所有位于该城市的 *location* 平均得到
  - 格式为：
    - *City_name_1: avg_lat, avg_lon*
    - *City_name_2: avg_lat, avg_lon*
    - *...*
- `./city_features/city_features.csv`：所研究城市每日各自对应的平均 *features* ，共 *1492* 天
  - 格式为：
    - *City_name_1: [features1], [features2], ...*
    - *City_name_2: [features1], [features2], ...*
    - *...*

### 1.2 百度地图 *API* 的调用

- 进入 [百度地图开放平台](https://lbsyun.baidu.com/apiconsole/key#/home) 官网，申请账号并进入控制台，创建应用，应用类型选择“服务端”，启用服务默认，请求校验方式选择 ***sn* 校验方式**，并记录 *sk*

- 核心 *python* 函数如下：

  ```python
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
  
      req = urllib.request.urlopen(url)
      res = req.read().decode()
  
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
  ```

  注意：

  - 中文地址名称转化成经纬度信息时：需要使用 **地址解析 *.../geocoding/v3/?address=[中文地址]...***：

    ```python
    # Address -> lat, lon (geocoding)
    query_str = '/geocoding/v3/?address={}&output=json&ak={}'.format("清华大学", my_ak)
    ```

  - 经纬度信息转化成中文地址名称时，需要使用 **逆地址解析 *.../reverse_geocoding/v3/?location=[lat],[lon]...***

    ```python
    # Lat, lon -> address (reverse_geocoding)
    query_str = '/reverse_geocoding/v3/?location={}&output=json&ak={}'.format(str(lat) + "," + str(lon), my_ak)
    ```

- 对于频繁调用百度 *API* 可能带来的报错 `urllib.error.URLError: <urlopen error [Errno 60] Operation timed out>`，可以考虑通过以下几种方式来解决：

  - 最有效：多次尝试

    ```python
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
    ```

  - ```python
    # Set global operation out time
    socket.setdefaulttimeout(120)
    ```

  - ```python
    if i % 100 == 0:
    		time.sleep(1)  # In case that banned by the API server due to the frequent visit
    		print("Traversed locations:", str(i) + "/" + str(len(locations_vectors)))
    ```


------



