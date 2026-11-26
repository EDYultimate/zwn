<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水质站</title>
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
			//var ids = parent.selcolids.split(',');
/* 			for (var i=0; i<$('td input').length; ++i) {
				var sid = $('td input')[i].id;
				if (ids.indexOf(sid)>-1 ) {
					$('td input')[i].checked = true;
				}
			} */
			
			getAllAUTO(function() {
				
			});
			
		})
		
		function getAllAUTO(callback) {
			// 列数
			var cols = 4;
			
			$.ajax({
				url: basePath+'cxfx/getAllAUTO',
				data:"",
				success: function(data){
					var rows = "<tr>";
					for (var i=0; i<data.length; ++i) {
						var str = '<td><input id="'+data[i].STCD+'"  type="radio" class="ckcol" name="zastcd"';
						
						if (parent.selstcd && parent.selstcd === data[i].STCD) {
							str+=" checked "
						}
						
						str+='></input></td><td><span>'+data[i].ST_NM+'</span></td>';
						if (i!=0 && i%cols==0) {
							str = '</tr><tr>'+str;
						}
						rows+=str;
					}
					rows +='</tr>';
					$('#zaDiv').append(rows);
					callback();
				}
			})
		}
		
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
			parent.setSelStcdId(ids, names);
			parent.layer.closeAll();
		}
		
		function cancel() {
			parent.layer.closeAll();
		}
	</script>
  </head>
  <body>
    <center class="conent" style="overflow:hidden;height:70%">
		<div>
			<table id="zaDiv">

			</table>
		</div>
	</center>
	<div style="height:30%">
		<button style="float:right;margin-right: 10px;"  onclick="confirm()">确定</button>
		<button style="float:right;margin-right: 10px;"  onclick="cancel()">取消</button>
	</div>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
</html>
