<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String id=request.getParameter("id");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'download.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery.multiselect.css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	 <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
	<script type="text/javascript" src="<%=basePath%>common/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="<%=basePath%>common/js/jquery.multiselect.js"></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.ui.widget.js'></script>
	
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.iframe-transport.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-process.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-validate.js'></script>
	<script type='text/javascript' src='<%=basePath%>/pages/nsbd/fileInfo/download.js'></script>
  </head>
  <script>
  var id='<%=id%>';
  var basePath='<%=basePath%>';
  $(function(){
	selectYJFile(id);
});
  
  </script>
  
  <style>
html,body{ margin:0px; height:100%; width:100%;overflow: hidden;font-family:"微软雅黑","黑体";-webkit-text-size-adjust:none;}
 body {
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
	margin-left: 0px;
	font-size: 12px;	
	scrollbar-face-color: #E0E0E0;
	scrollbar-arrow-color: #828282; 
	scrollbar-3dlight-color: #c3c3c3; 
}
.topDiv{
	height: 92%;
	margin-top: 20px;
	margin-left:20px;
}
.bottomDiv{
	margin-right:15px;
	margin-top:5px;
	background-color:#eef3f6;
}

.titleDiv{
	text-align: center;
	height: 25px;
	width: 100%;
	vertical-align: middle;
	line-height: 25px;
	color: #000000;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: 2px;
}

.mainTableDiv{
	margin-top: 5px;
	width:98%;
	margin-left: auto;
	margin-right: auto;
}


.tableCss{
	font-size: 12px;border-right: #D5D5D5 2px solid;border-bottom:  #D5D5D5 2px solid;margin-top: 5px;table-layout:fixed;border-collapse: collapse;
}
.tableCss thead td {
	font-size: 13px;
	background-color: #E5E5E5;
	height: 28px;
	font-weight: bold;	
	border-left: #D5D5D5 2px solid;
	border-top: #D5D5D5 2px solid;
	text-align: center;
	white-space:nowrap;overflow:hidden;
}
.tableCss tbody td {
	font-size: 11px;
	height: 23px;
	border-left: #D5D5D5 2px solid;
	border-top: #D5D5D5 2px solid;
	text-align: center;
	white-space:nowrap;overflow:hidden;
}





.TitleDiv{
	letter-spacing: 1px;
	line-height: 20px;
	height: 20px;
	width:80px;
	background-color: #5DB5DB;
	float: left;
	color: #FFFFFF;
	text-align: center;	
}


.dialogtopDiv{
	width: 92%;
	height:30px;
	line-height: 30px;
	font-size: 14px;
	margin-top: 1px;
	margin-left: auto;
	margin-right: auto;
	color: #FFFFFF;
	letter-spacing: 1px;
	font-weight: bold;
	
}
.cancelDiv{
	float: right;
	margin-top: 5px;
}
/*
	关于弹出框中div的样式
*/
.tableDiv{
	width: 94%;
	font-size: 12px;
	margin-left: auto;
	margin-right: auto;
	background-color: white;
	color: #000000;
	overflow-y: auto;
	height: 80%
}
/*
	关于弹出框div内部的Table的样式
*/
.mainTable{
	width: 100%;
	border-top: none;
	border-left: none;
	border-bottom: #5DB5DB 1px solid;
	border-right: #5DB5DB 1px solid;
	border-collapse: collapse;
}
.mainTable td{
	border-top: #5DB5DB 1px solid;
	border-left: #5DB5DB 1px solid;
	border-right: #5DB5DB 1px solid;
}
.mainTable td input{
	border: none;
}
.textindent{
	text-indent: 10px;
}
.textalign{
	text-align: center;
	
}
table{table-layout:fixed;}
thead td{text-align:center;}
tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
</style>
  <body>
    <div  id="addWin"></div>
  </body>
</html>
