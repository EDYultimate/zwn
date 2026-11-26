<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  </head>
  <body>


   	 	<div class="sc_div"  style="width:220px;">
   	 	取水户名称：<input type="text" id="qsh_user" name="qsh_user" 
   	 		placeholder="输入取水户名称" class="sc_input"  style="width: 107px;">
   	 	</div>
  		&nbsp;&nbsp;

  		<div class="sc_div" style="width:280px">
	   	 	时间：
	   	 	<input type="text" id="btm" name="datemonth"  class="sc_input sc_input_fix"   onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
		   	--
		   	<input type="text" id="etm" name="datemonth"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
	   	</div>
	   	&nbsp;&nbsp;&nbsp;&nbsp;
   	<!-- 查询 -->
    <input type="button" value="查询" class="s_input" onclick="search()">
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script>
  $(function(){
	   $("#btm").val(getCurrentYM());
	   $("#etm").val(getCurrentYMD());
 });

 
//获取当月第一天
function getCurrentYM(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		if(month.toString().length==1){
			month="0"+month;
		}
		return year+"-"+month+"-01";
}
 
//获取当前天
function getCurrentYMD(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		if(month.toString().length==1){
			month="0"+month;
		}
		if(day.toString().length==1){
			day="0"+day;
		}
		return year+"-"+month+"-"+day;
}
 
  
  
  </script>
</html>
