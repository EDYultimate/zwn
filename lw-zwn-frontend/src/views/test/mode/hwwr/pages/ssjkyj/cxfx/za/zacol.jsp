<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水质指标</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
	<link rel="stylesheet" href ="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
	<style>
	body{padding:0;margin:0}
	.ckcol {
	    height: 15px;
    	width: 15px;
	}
	</style>
	<script type="text/javascript">
		$(document).ready(function(){
			var ids = parent.selcolids.split(',');
			for (var i=0; i<$('td input').length; ++i) {
				var sid = $('td input')[i].id;
				if (ids.indexOf(sid)>-1 ) {
					$('td input')[i].checked = true;
				}
			}
		})
		
		function confirm() {
			var cols =$('td input');
			var ids = "";
			var names = "";
			var step = "";
			for (var i=0; i<cols.length; ++i) {
				var sid = $('td input')[i].id;
				var sname = $($('td span')[i]).text();
				if (ids) {
					step = ",";
				}
				if ($('td input')[i].checked) {
					ids += step+sid;
					names += step+sname;
				}
			}
			parent.setSelCol(ids, names);
			parent.layer.closeAll();
		}
		
		function cancel() {
			parent.layer.closeAll();
		}
		
		function ckall() {
			var ids = parent.selcolids.split(',');
			var isallcked = true;
			for (var i=0; i<$('td input').length; ++i) {
				var sid = $('td input')[i].id;
				if (ids.indexOf(sid)>-1 ) {
					if (!$('td input')[i].checked) {
						isallcked = false;
						break;
					}
				}
			}
			if (isallcked) {
				for (var i=0; i<$('td input').length; ++i) {
					var sid = $('td input')[i].id;
					if (ids.indexOf(sid)>-1 ) {
						$('td input')[i].checked = false;
					}
				}
			}
			else {
				for (var i=0; i<$('td input').length; ++i) {
					var sid = $('td input')[i].id;
					if (ids.indexOf(sid)>-1 ) {
						$('td input')[i].checked = true;
					}
				}
			}
		}
	</script>
  </head>
  <body>
    <center class="conent" style="overflow:hidden;height:80%">
		<div>
			<table>
				<tr>
					<td><input id="WT"  type="checkbox" class="ckcol"></input></td><td><span>水温</span></td>
					<td><input id="PH"  type="checkbox" class="ckcol"></input></td><td><span>PH值</span></td>
					<td><input id="DOX"  type="checkbox" class="ckcol"></input></td><td><span>溶解氧</span></td>
					<td><input id="CODMN"  type="checkbox" class="ckcol"></input></td><td><span>高锰酸盐</span></td>
					<td><input id="CODCR"  type="checkbox" class="ckcol"></input></td><td><span>化学需氧量</span></td>
				</tr>
				<tr>
					<td><input id="BOD5"  type="checkbox" class="ckcol"></input></td><td><span>五日生化需氧量</span></td>
					<td><input id="NH3N"  type="checkbox" class="ckcol"></input></td><td><span>氨氮</span></td>
					<td><input id="TP"  type="checkbox" class="ckcol"></input></td><td><span>总磷</span></td>
					<td><input id="TN"  type="checkbox" class="ckcol"></input></td><td><span>总氮</span></td>
					<td><input id="F"  type="checkbox" class="ckcol"></input></td><td><span>氟化物</span></td>
				</tr>
				<tr>
					<td><input id="CN"  type="checkbox" class="ckcol"></input></td><td><span>氰化物</span></td>
					<td><input id="S2"  type="checkbox" class="ckcol"></input></td><td><span>硫化物</span></td>
					<td><input id="CU"  type="checkbox" class="ckcol"></input></td><td><span>铜</span></td>
					<td><input id="ZN"  type="checkbox" class="ckcol"></input></td><td><span>锌</span></td>
					<td><input id="SE"  type="checkbox" class="ckcol"></input></td><td><span>硒</span></td>
				</tr>
				<tr>
					<td><input id="ARS"  type="checkbox" class="ckcol"></input></td><td><span>砷</span></td>
					<td><input id="HG"  type="checkbox" class="ckcol"></input></td><td><span>汞</span></td>
					<td><input id="CD"  type="checkbox" class="ckcol"></input></td><td><span>镉</span></td>
					<td><input id="PB"  type="checkbox" class="ckcol"></input></td><td><span>铅</span></td>
					<td><input id="CR6"  type="checkbox" class="ckcol"></input></td><td><span>铬</span></td>
				</tr>
				<tr>
					<td><input id="VLPH"  type="checkbox" class="ckcol"></input></td><td><span>挥发酚</span></td>
					<td><input id="FCG"  type="checkbox" class="ckcol"></input></td><td><span>粪大肠菌群</span></td>
					<td><input id="LAS"  type="checkbox" class="ckcol"></input></td><td><span>阳离子表面活性剂</span></td>
				</tr>
			</table>
		</div>
	</center>
	<div style="height:10%">
		<button style="float:right;margin-right: 10px;"  onclick="confirm()">确定</button>
		<button style="float:right;margin-right: 10px;"  onclick="cancel()">取消</button>
		<button style="float:right;margin-right: 10px;"  onclick="ckall()">全选</button>
	</div>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
</html>
