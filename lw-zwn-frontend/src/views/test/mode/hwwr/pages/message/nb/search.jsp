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
  	&nbsp;&nbsp;&nbsp;&nbsp;
  	范围：<select id="fw">
  			<option value="">全部</option>
  			<option value="040000">水资源分区</option>
  			<option value="C000000">行政区</option>
  			<option value="A000000">Ⅲ级区</option>
  		</select>
  		&nbsp;&nbsp;&nbsp;&nbsp;
   	 时间：<input type="text" id="year" name="year" onClick="WdatePicker({ dateFmt: 'yyyy'})">  
   	 &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script>
  $(function(){
	  initYear(); 
  });
  function initYear(){
	  jQuery.getJSON("/hwwr/message/gb/getSzyGb_Year",{"tp":"002"},function(data){
		  if(data!=null&&data.length>0){
			  $("#year").val(data[0].YEAR);
			  $("#t_year").html(data[0].YEAR);
		  }
	  });
  }
  </script>
</html>
