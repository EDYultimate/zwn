<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String year=request.getParameter("year");
if (year==null) {
	year = "";
}
String type = request.getParameter("type");
if (type==null) {
	type="bas";
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>海河流域取水许可审批与发放统计表（按水资源分区汇总）</title>
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

	
<!-- 		<input id="chooseyear"  type="text"   onClick="WdatePicker({dateFmt:'yyyy',realDateFmt:'yyyy'})"/>
		<button style="margin-left:10px" onclick="querybyyear()">查询</button> -->
		
	<div class="searchDiv">
		&nbsp;&nbsp;
  	<div class="sc_div">
	  	范围：
		<select id="fw"  style="text-align-last: center;" class="sc_input">
  			<option value="bas">水资源分区</option>
  			<option value="ad">行政区</option>
  		</select>
  	</div>

  		&nbsp;&nbsp;
  	<div class="sc_div">
  		许可类型
  		<select id="xzqselect" style="text-align-last: center;"  class="sc_input">
	  		<option value="spff_1">新批</option>
	  		<option value="spff_2">新发</option>
	  		<option value="spff_3">变更</option>
	  		<option value="spff_4">延续</option>
	  		<option value="zxdx_1">注销</option>
	  		<option value="zxdx_2">吊销</option>
  		</select>
  	</div>

		&nbsp;&nbsp;
  	<div class="sc_div">
		时间：
		<input type="text"  id="chooseyear"  name="year" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy'})">
  	</div>
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="查询" class="s_input" onclick="querybyyear()">
	</div>
	
	<center  class="conent" style="width: 100%;height: calc(100% - 55px);">
		<div class="titleDiv" style="width:2500px">
			<span id="cyear"></span><span>年海河流域取水许可统计表</span>
		</div>
		<table id="table" class="bbTable" style="table-layout:fixed;width:2500px">
			<thead>
				<tr>
					<th rowspan="4" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="4" data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th rowspan="4" data-field="PERM_INT_TP" display="hide" style="display:none">PERM_INT_TP</th>
					<th rowspan="4" data-field="WRZ_NM"  style="width: 140px;">所属水<br>资源区</th>
					<th rowspan="4" data-field="P_NUM"  style="width: 50px;">项目<br>数量</th>
					<th rowspan="4" data-field="PERM_INT_NM"  style="width: 60px;">取水<br>许可<br>类型</th>
					<th colspan="14">河道外用水取水户(万m³)</th>
					<th colspan="2" style="width: 180px;">河道内用水取<br>水户许可水量(万m³)</th>
				</tr>
				<tr>
					<th colspan="6">许可水量（按水源分类）</th>
					<th colspan="8">许可水量（按用途分类）</th>
					<th rowspan="3" data-field="HP_PERM" >水力<br>发电</th>
					<th rowspan="3" data-field="OTHRW_PERM" >其他</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="SW_PERM" >地表水</th>
					<th colspan="3">地下水</th>
					<th rowspan="2" data-field="OTH_PERM" >其他</th>
					<th rowspan="2" data-field="WW_PERM" >合计</th>
					<th colspan="2">自来水</th>
					<th rowspan="2" data-field="SLF_PERM" >生活<br>自备水</th>
					<th colspan="2">工业 自备水</th>
					<th rowspan="2" data-field="AGR_PERM" >农业</th>
					<th rowspan="2" data-field="OTHU_PERM" >其他</th>
					<th rowspan="2" data-field="USE_PERM" >合计</th>
				</tr>
				<tr>
					<th data-field="GW_PERM" >小计</th>
					<th data-field="GEO_PERM" >其中:<br>地热水</th>
					<th data-field="MS_PERM" >矿泉水</th>
					<th data-field="TAP_PERM" >小计</th>
					<th data-field="TAP_LF_PERM" >其中:<br>生活</th>
					<th data-field="IND_PERM" >小计</th>
					<th data-field="FNP_PERM" >其中:直<br>流火核电</th>
				</tr>
			</thead>
			<thead id="realth"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th data-field="PERM_INT_TP" display="hide" style="display:none">PERM_INT_TP</th>
					<th data-field="WRZ_NM" >所属水<br>资源区</th>
					<th data-field="P_NUM" >项目<br>数量</th>
					<th data-field="PERM_INT_NM" >取水<br>许可<br>类型</th>
					<th data-field="SW_PERM" >地表水</th>
					<th data-field="GW_PERM" >小计</th>
					<th data-field="GEO_PERM" >其中:<br>地热水</th>
					<th data-field="MS_PERM" >矿泉水</th>
					<th data-field="OTH_PERM" >其他</th>
					<th data-field="WW_PERM" >合计</th>
					<th data-field="TAP_PERM" >小计</th>
					<th data-field="TAP_LF_PERM" >其中:<br>生活</th>
					<th data-field="SLF_PERM" >生活<br>自备水</th>
					<th data-field="IND_PERM" >小计</th>
					<th data-field="FNP_PERM" >其中:直<br>流火核电</th>
					<th data-field="AGR_PERM" >农业</th>
					<th data-field="OTHU_PERM" >其他</th>
					<th data-field="USE_PERM" >合计</th>
					<th data-field="HP_PERM" >水力<br>发电</th>
					<th data-field="OTHRW_PERM" >其他</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		
		<table id="table1" class="bbTable" style="table-layout:fixed;width:100%; display:none;">
			<thead>
				<tr>
					<th rowspan="4" data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th rowspan="4" data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th rowspan="4" data-field="RLW_TP" display="hide" style="display:none">RLW_TP</th>
					<th rowspan="4" data-field="WRZ_NM"  style="width: 40px;">所属水<br>资源区</th>
					<th rowspan="4" data-field="P_NUM"  style="width: 35px;">项目<br>数量</th>
					<th rowspan="4" data-field="RLW_NM"  style="width: 35px;">类型</th>
					<th colspan="14">河道外用水取水户</th>
					<th colspan="2" style="width: 80px;">河道内用水取<br>水户许可水量</th>
					<th rowspan="4" data-field="RLW_REAS"  style="width: 15px;">备<br>注</th>
				</tr>
				<tr>
					<th colspan="6">许可水量（按水源分类）</th>
					<th colspan="8">许可水量（按用途分类）</th>
					<th rowspan="3" data-field="HP_RLW" >水力<br>发电</th>
					<th rowspan="3" data-field="OTHRW_RLW" >其他</th>
				</tr>
				<tr>
					<th rowspan="2" data-field="SW_RLW" >地表水</th>
					<th colspan="3">地下水</th>
					<th rowspan="2" data-field="GW_OTH_RLW" >其他</th>
					<th rowspan="2" data-field="SUM1" >合计</th>
					<th colspan="2">自来水</th>
					<th rowspan="2" data-field="SLF_RLW" >生活<br>自备水</th>
					<th colspan="2">工业 自备水</th>
					<th rowspan="2" data-field="AGR_RLW" >农业</th>
					<th rowspan="2" data-field="OTH_RLW" >其他</th>
					<th rowspan="2" data-field="SUM2" >合计</th>
				</tr>
				<tr>
					<th data-field="GW_RLW" >小计</th>
					<th data-field="GW_GEO_RLW" >其中:<br>地热水</th>
					<th data-field="GW_MSW_RLW" >矿泉水</th>
					<th data-field="TAP_RLW" >小计</th>
					<th data-field="TAP_LF_RLW" >其中:<br>生活</th>
					<th data-field="IND_RLW" >小计</th>
					<th data-field="FNP_RLW" >其中:直<br>流火核电</th>
				</tr>
			</thead>
			<thead id="realth1"  style="visibility: hidden; display: none;">
				<tr>
					<th data-field="RPCD" display="hide" style="display:none">RPCD</th>
					<th data-field="WRZ_CD" display="hide" style="display:none">WRZ_CD</th>
					<th data-field="RLW_TP" display="hide" style="display:none">RLW_TP</th>
					<th data-field="WRZ_NM" >取水地点<br>所属<br>水资源区</th>
					<th data-field="P_NUM" >项目<br>数量</th>
					<th data-field="RLW_NM" >类型</th>
					<th data-field="SW_RLW" >地表水</th>
					<th data-field="GW_RLW" >小计</th>
					<th data-field="GW_GEO_RLW" >其中:<br>地热水</th>
					<th data-field="GW_MSW_RLW" >矿泉水</th>
					<th data-field="GW_OTH_RLW" >其他</th>
					<th data-field="SUM1" >合计</th>
					<th data-field="TAP_RLW" >小计</th>
					<th data-field="TAP_LF_RLW" >其中:<br>生活</th>
					<th data-field="SLF_RLW" >生活<br>自备水</th>
					<th data-field="IND_RLW" >小计</th>
					<th data-field="FNP_RLW" >其中:直<br>流火核电</th>
					<th data-field="AGR_RLW" >农业</th>
					<th data-field="OTH_RLW" >其他</th>
					<th data-field="SUM2" >合计</th>
					<th data-field="HP_RLW" >水力<br>发电</th>
					<th data-field="OTHRW_RLW" >其他</th>
					<th data-field="RLW_REAS" >备<br>注</th>
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
hwwr.option.year = "<%=year%>";
hwwr.option.type = "<%=type%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/kfly/qsxk/qsxk/spff/dfbstt.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</html>