<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String year=request.getParameter("year");
if (year==null) {
	year = "";
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>海河流域年终保有有效取水许可证统计表</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<style type="text/css">
.bbTable > tbody > tr > td, th {
	padding: 0px
}


</style>
</head>
<body>
	
	<div class="searchDiv">
		&nbsp;&nbsp;
  	<div class="sc_div">
	  	范围：
		<select id="fw"  class="sc_input">
  			<option value="bas">水资源分区</option>
  			<option value="ad">行政区</option>
  		</select>
  	</div>

		&nbsp;&nbsp;
  	<div class="sc_div">
		时间：
		<input type="text"  id="chooseyear"  name="year"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
  	</div>
		
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	
	<center   class="conent" style="width: 100%;height: calc(100% - 55px);">
		<div id="titleDiv1" class="titleDiv" style="width:3000px">
			<span id="cyear1"></span><span>年海河流域年终保有有效取水许可证统计表</span>
		</div>
		<table id="table1" class="bbTable"   style="width:3000px">
			<thead>
				<tr>
					<th rowspan="5" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="5" data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th rowspan="5" data-field="ORG_G" display="hide" style="display:none">ORG_G</th>
					<th rowspan="5" data-field="WRZ_NM" >水资源<br>分区名称</th>
					<th colspan="27" >河道外用水取水户(亿m³)</th>
					<th colspan="4" >河道内用水取水户(亿m³)</th>
				</tr>
				<tr>
					<th colspan="12">年终保有有效证数和许可水量(按水源分类)</th>
					<th colspan="15">年终保有有效证数和许可水量(按用途分类)</th>
					<th rowspan="2" colspan="2">水力发电</th>
					<th rowspan="2" colspan="2">其他</th>
				</tr>
				<tr>
					<th colspan="2">地表水</th>
					<th colspan="6">地下水</th>
					<th colspan="2">其他</th>
					<th colspan="2">合计</th>
					<th colspan="3">自来水</th>
					<th colspan="2">生活自备水</th>
					<th colspan="4">工业自备水</th>
					<th colspan="2">农业</th>
					<th colspan="2">其他</th>
					<th colspan="2">合计</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="SW_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="SW_PERM" >水量</th>
					<th rowspan="2" data-field="GW_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="GW_PERM" >水量</th>
					<th colspan="2">地热水</th>
					<th colspan="2">矿泉水</th>
					<th rowspan="2" data-field="OTHW_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="OTHW_PERM" >水量</th>
					<th rowspan="2" data-field="SUM1_NUM" >证数</th>
					<th rowspan="2" data-field="SUM1_PERM" >水量</th>
					<th rowspan="2" data-field="TAP_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="TAP_PERM" >水量</th>
					<th rowspan="2" data-field="LF_PERM" >其中:<br>生活<br>水量</th>
					<th rowspan="2" data-field="SLF_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="SLF_PERM" >水量</th>
					<th rowspan="2" data-field="IND_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="IND_PERM" >水量</th>
					<th colspan="2">其中:直流火核电</th>
					<th rowspan="2" data-field="AGR_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="AGR_PERM" >水量</th>
					<th rowspan="2" data-field="OTHUW_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="OTHUW_PERM" >水量</th>
					<th rowspan="2" data-field="SUM2_NUM" >证数</th>
					<th rowspan="2" data-field="SUM2_PERM" >水量</th>
					<th rowspan="2" data-field="HP_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="HP_PERM" >水量</th>
					<th rowspan="2" data-field="OTHRW_LIC_NUM" >证数</th>
					<th rowspan="2" data-field="OTHRW_PERM" >水量</th>
				</tr>
				<tr>
					<th data-field="GE_LIC_NUM" >证数</th>
					<th data-field="GE_PERM" >水量</th>
					<th data-field="MS_LIC_NUM" >证数</th>
					<th data-field="MS_PERM" >水量</th>
					<th data-field="FNP_LIC_NUM" >证数</th>
					<th data-field="FNP_PERM" >水量</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th data-field="ORG_G" display="hide" style="display:none">ORG_G</th>
					<th data-field="WRZ_NM" >水资源<br>分区名称</th>
					<th data-field="SW_LIC_NUM" >证数</th>
					<th data-field="SW_PERM" >水量</th>
					<th data-field="GW_LIC_NUM" >证数</th>
					<th data-field="GW_PERM" >水量</th>
					<th data-field="GE_LIC_NUM" >证数</th>
					<th data-field="GE_PERM" >水量</th>
					<th data-field="MS_LIC_NUM" >证数</th>
					<th data-field="MS_PERM" >水量</th>
					<th data-field="OTHW_LIC_NUM" >证数</th>
					<th data-field="OTHW_PERM" >水量</th>
					<th data-field="SUM1_NUM" >证数</th>
					<th data-field="SUM1_PERM" >水量</th>
					<th data-field="TAP_LIC_NUM" >证数</th>
					<th data-field="TAP_PERM" >水量</th>
					<th data-field="LF_PERM" >其中:<br>生活<br>水量</th>
					<th data-field="SLF_LIC_NUM" >证数</th>
					<th data-field="SLF_PERM" >水量</th>
					<th data-field="IND_LIC_NUM" >证数</th>
					<th data-field="IND_PERM" >水量</th>
					<th data-field="FNP_LIC_NUM" >证数</th>
					<th data-field="FNP_PERM" >水量</th>
					<th data-field="AGR_LIC_NUM" >证数</th>
					<th data-field="AGR_PERM" >水量</th>
					<th data-field="OTHUW_LIC_NUM" >证数</th>
					<th data-field="OTHUW_PERM" >水量</th>
					<th data-field="SUM2_NUM" >证数</th>
					<th data-field="SUM2_PERM" >水量</th>
					<th data-field="HP_LIC_NUM" >证数</th>
					<th data-field="HP_PERM" >水量</th>
					<th data-field="OTHRW_LIC_NUM" >证数</th>
					<th data-field="OTHRW_PERM" >水量</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
	</center>
	
	<center>
		<div id="chart" style="width: 700px;height:500px;"></div>
	</center>
	
</body>
<script type="text/javascript">
var hwwr = {};
hwwr.basePath = "<%=basePath%>";
hwwr.option = {};
hwwr.option.year = "<%=year%>"
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/kfly/qsxk/qsxk/nzby/lcnystt.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>