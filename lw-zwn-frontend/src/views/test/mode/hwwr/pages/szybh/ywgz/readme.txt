华北地下水:
	http://10.3.34.159:8080/hwwr/szybh/ywgz/getSaveWaterGroundWaterNorthDetailInfoGIS 
	年累计补水量：HEJI
	计划补水量：NIANDUJIHUA
	河流编码：RV_CD
	河流名称：RV_NM
	
	
	
地下水位通报
	地图页：
		http://10.3.34.159:8080/hwwr/szybh/ywgz/getSaveWaterEcologyFlowWarnDetailInfoGis
		区域编码：AD_CD
		区域名称：AD_NM
		颜色值：TYPE (1、上升区  2、相对稳定区  3、相对下降区  4、严重下降区)
	弹框：
		调用 do_support(AD_NM,AD_CD)方法
	
	
重要水源地
	地图页：
		http://10.3.34.159:8080/hwwr/szybh/ywgz/getSaveWaterDrinkProtectGis
		水源地编码：SWS_CD
		水源地名称：SWS_NM
		水源地类型：SWS_TP(1、水库；2、地下水；3、河道)
		供水城市：SUPPLY_CITY
		水质类别：MAX_WQG (1、I 2、II  3、III  4、IV 5、V 6、劣V)
		抽查评估：ASSESS_RES
		年份：YR
		经度：LGTD
		纬度：LGTD
	弹框：
		调用 do_support(SWS_NM,SWS_CD)


地下水监测:
	http://10.3.34.159:8080/hwwr/szybh/ywgz/getSaveWaterWaterEnvBelowDetailGis
	所在行政区：ADDVCD
	水质类别：WQ_VAL
	日期：M_DATE
	经度：LGTD
	纬度：LGTD
	
	
地表水监测:
	http://10.3.34.159:8080/hwwr/szybh/ywgz/getSaveWaterWaterEnvAboveDetailGis
	所在行政区：ADDVCD
	水质类别：WQ_VAL
	日期：M_DATE
	经度：LGTD
	纬度：LGTD