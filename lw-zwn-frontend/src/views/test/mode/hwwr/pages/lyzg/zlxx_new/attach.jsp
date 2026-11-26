<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String type=request.getParameter("type")==null?"":request.getParameter("type");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>

<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">

<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>

<style type="text/css">
.MTable{
	border-collapse:collapse;
	border-spacing:0;
	border-left:1px solid #E1E1E1;
	border-top:1px solid #E1E1E1;
	border-bottom:1px solid #E1E1E1;
	font-family: "Microsoft YaHei","微软雅黑","sans-serif";
	width:100%;
	/* font: 14px Verdana, "Microsoft YaHei"; */
}
.MTable>thead>tr>td, th{
	height:25px;
	background-color: rgba(252, 252, 252, 1);
	border-right:1px solid #E1E1E1;
	padding:5px 15px;
	text-align: center;
	font-size: 15px;
	font-weight: bold;	
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.MTable>tbody>tr>td, th{
	height:25px;
	border:1px solid #E1E1E1;
	padding:5px 15px;
	font-size:14px;
	text-align: center;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	word-break:keep-all;
	
}
</style>

<script type="text/javascript">
	var type="<%=type%>";
	var basePath="<%=basePath%>";
	
	$(document).ready(function(){
		refresh();
	})
	
	
	function getattachtype() {
	$.get(basePath + 'sjtj/sjqk_new/getFileType', {},
			function(data) {
				if (data != null && data.length > 0) {
					var str = "";
					for (var i = 0; i < data.length; ++i) {
						str += "<tr><td>"+data[i].name+"</td><td><a href='javascript:del(\""+data[i].id+"\")'>删除</a></td>";
					}
					$('#content').append(str);
				}

			});
	}
	
	function refresh() {
		$('#content').empty();
		getattachtype();
	}
	
	function add() {
		var url = basePath+"/sjtj/sjqk_new/insertFileType";
		layer.prompt({
			  title: '项目类型',
			},
			function(value, index, elem){
			$.post(url+'?name='+value,{
				
			}, function(data){
				refresh();
			})
		  layer.close(index);
		});
	}
	
	function del(id) {
		var url = basePath+"/sjtj/sjqk_new/delFileType";
		$.post(url+'?id='+id,{
			
		}, function(data){
			refresh();
		})
	}
</script>

</head>
<body>
	<div class="searchDiv">
		<input type="button" value="添加" class="s_input" onclick="add()">
	</div>
	<div style="overflow-y: auto;height: 330px;">
		<table  class="MTable" >
			<thead>
				<tr>
					<td>附件类型</td>
					<td>操作</td>
				</tr>
			</thead>
			<tbody id="content">
			
			</tbody>
		</table>
	</div>
</body>
</html>