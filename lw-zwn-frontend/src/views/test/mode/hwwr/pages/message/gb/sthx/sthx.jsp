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
<title>三条红线</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath %>common/js/jquery-easyui-1.3.1/themes/icon.css" type="text/css"></link>
<link id="easyuiTheme" rel="stylesheet" href="<%=basePath %>common/js/jquery-easyui-1.3.1/themes/default/easyui.css" type="text/css"></link>

</head>
<body style="overflow: auto;">
		<table id="grid">
		</table>
		<div id="buttons" style="padding-left:10px;display:none;">
			时间:  &nbsp; <input id="chooseyear"  type="text"   onClick="WdatePicker({dateFmt:'yyyy',realDateFmt:'yyyy'})"/>
			 &nbsp; <button class="easyui-linkbutton" data-options="iconCls:'icon-search'"  onclick="search()">查询</button>
			 &nbsp; <button class="easyui-linkbutton" data-options="iconCls:'icon-edit'"  onclick="addDialog()">添加</button>
			 &nbsp; <button class="easyui-linkbutton"   onclick="chartDialog()">趋势图</button>
		</div>
		
		<div id="addDialog"  style="font-size:14px">
			<div style="margin-top:10px;padding-left: 15px;">
			时间: &nbsp; <input id="dialogyear"  type="text"  style="padding: 0px;height:23px" onClick="WdatePicker({onpicked:popDialog(),dateFmt:'yyyy',realDateFmt:'yyyy'})"   />
			行政区: &nbsp; <select id="dialogad"   style="font-size:14px;height:23px"  onchange="popDialog()">
									  		<option value="110000">北京市</option>
											<option value="120000">天津市</option>
											<option value="130000">河北省</option>
											<option value="140000">山西省</option>
											<option value="410000">河南省</option>
											<option value="370000">山东省</option>
											<option value="150000">内蒙古自治区</option>
											<option value="210000">辽宁省</option>
								  		</select>
			</div>
			<table style="margin-top:10px;width: 100%;padding-left: 15px;font-size:14px">
			<tr style="display:none;">
				<td>年度考核结果报告代码</td>
				<td><input id="ANN_ASS_CD"  /></td>
			</tr>
			<tr style="display:none;">
				<td>水资源计算分区代码</td>
				<td><input id="WRCS_CD"  /></td>
			</tr>
			<tr style="display:none;">
				<td>考核时段类型</td>
				<td><input id="ASS_PT"  /></td>
			</tr>
			<tr>
				<td>用水总量年度目标值</td>
				<td><input id="TOTW_TAR"  /></td>
			</tr>
			<tr>
				<td>用水总量实际值</td>
				<td><input id="TOTW_ACT"  /></td>
			</tr>
			<tr>
				<td>用水总量评分</td>
				<td><input id="TOTW_SCO"  /></td>
			</tr>
			<tr>
				<td>用水总量扣分原因说明</td>
				<td><input id="TOTW_DEC"  /></td>
			</tr>
			<tr>
				<td>万元工业增加值用水量年度目标值</td>
				<td><input id="ADD_TAR_IND"  /></td>
			</tr>
			<tr>
				<td>万元工业增加值用水量实际值</td>
				<td><input id="ADD_ACT_IND"  /></td>
			</tr>
			<tr>
				<td>万元工业增加值用水量评分</td>
				<td><input id="ADD_SCO_IND"  /></td>
			</tr>
			<tr>
				<td>万元工业增加值用水量扣分原因说明</td>
				<td><input id="ADD_DEC_IND"  /></td>
			</tr>
			<tr>
				<td>农田灌溉水有效利用系数年度目标值</td>
				<td><input id="TAR_IRR"  /></td>
			</tr>
			<tr>
				<td>农田灌溉水有效利用系数实际值</td>
				<td><input id="ACT_IRR"  /></td>
			</tr>
			<tr>
				<td>农田灌溉水有效利用系数评分</td>
				<td><input id="SSCO_IRR"  /></td>
			</tr>
			<tr>
				<td>农田灌溉水有效利用系数扣分原因说明</td>
				<td><input id="DEC_IRR"  /></td>
			</tr>
			<tr>
				<td>水功能区水质达标率年度目标值</td>
				<td><input id="TAR_WFUNC"  /></td>
			</tr>
			<tr>
				<td>水功能区水质达标率实际值</td>
				<td><input id="ACT_WFUNC"  /></td>
			</tr>
			<tr>
				<td>水功能区水质达标率评分</td>
				<td><input id="SCO_WFUNC"  /></td>
			</tr>
			<tr>
				<td>水功能区水质达标率扣分原因说明</td>
				<td><input id="DEC_WFUNC"  /></td>
			</tr>
			</table>
		</div>
		
		<div id="chartDialog"  >
			<div id="sthxyszlDiv"  style="width:400px;height:300px;float:left;padding-top: 5px;"></div>
			<div id="sthxgyysDiv" style="width:400px;height:300px;float:left;padding-top: 5px;"></div>
			<div id="sthxnyblDiv" style="width:400px;height:300px;float:left;padding-top: 25px;"></div>
			<div id="sthxsgnqdbDiv" style="width:400px;height:300px;float:left;padding-top: 25px;"></div>
		</div>
		
		
</body>
<script type="text/javascript">
var hwwr = {};
hwwr.basePath = "<%=basePath%>";
hwwr.option = {};
hwwr.option.year = "<%=year%>"
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/message/gb/sthx/sthx.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>

<script type="text/javascript" src="<%=basePath %>common/js/jquery-easyui-1.3.1/jquery.easyui.min.js" charset="utf-8"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery-easyui-1.3.1/easyloader.js" charset="utf-8"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery-easyui-1.3.1/locale/easyui-lang-zh_CN.js" charset="utf-8"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>

</html>
