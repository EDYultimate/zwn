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
  <!-- 条件 -->
  		&nbsp;&nbsp;&nbsp;&nbsp;
  		<!-- 水源类别：<select id="sy_type">
  			<option value="">请选择</option>
  			<option value="地表水">地表水</option>
  			<option value="地下水">地下水</option>
  			<option value="再生水">再生水</option>
  			<option value="水库">水库</option>
  			<option value="煤矿疏干水">煤矿疏干水</option>
  			<option value="其它">其它</option>
  		</select>
  		&nbsp;&nbsp; -->
  		<div class="sc_div">
	  		取水用途：<select id="qs_way" class="sc_input">
	  			<option value="">全部</option>
	  			<option value="生活">生活</option>
	  			<option value="农业">农业</option>
	  			<option value="工业">工业</option>
	  			<option value="发电">发电</option>
	  			<option value="供热">供热</option>
	  			<option value="煤化工生产">煤化工生产</option>
	  		</select>
	  	</div>
  		&nbsp;&nbsp;
  		<!-- 发证年份：<input type="text" id="fz_year" name="fz_year" onClick="">  
   	 	&nbsp;&nbsp; -->
   	 	<div class="sc_div"  style="width:220px;">
   	 	取水户名称：<input type="text" id="qsh_user" name="qsh_user" 
   	 		placeholder="输入取水户名称" class="sc_input"  style="width: 107px;">
   	 	</div>
  		&nbsp;&nbsp;
   	<!-- 查询 -->
    <input type="button" value="查询" class="s_input" onclick="search()">
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script>
  $(function(){
	  // 发证年月
	  //initYear(); 
  });
  function initYear(){
	  jQuery.getJSON("/hwwr/message/rcgl/wfzgl/getQsz_Year",{"tp":""},function(data){
		  if(data!=null&&data.length>0){
			  $("#fz_year").val(data[0].YEAR);
			  $("#fz_year").attr("onClick","WdatePicker({dateFmt: 'yyyy',maxDate:'"+data[0].YEAR+"'})");
		  }
	  });
  }
  </script>
</html>
