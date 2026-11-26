<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/common.js"></script>
<script>
	var basePath = '<%=basePath%>';
	$(function(){
		  // 发证年月
		  initYear();
		  // 行政区
		  initXzq();
	});
	function initYear(){
	 jQuery.getJSON("/hwwr/message/rcgl/ssfzgl/getQsz_Year",{"tp":""},function(data){
	  if(data!=null&&data.length>0){
		  $("#fz_year").val(data[0].YEAR);
		  $("#fz_year").attr("onClick","WdatePicker({dateFmt: 'yyyy',maxDate:'"+data[0].YEAR+"'})");
	  }
	 });
	}
	function initXzq(){
		 jQuery.getJSON("/hwwr/message/rcgl/ssfzgl/getSsfzglXzq",{},function(data){
		  if(data!=null&&data.length>0){
			  var str = "<option value=''>全部</option>"
			  for(var i=0;i< data.length;i++){
				  str+="<option value='"+ data[i].XZQ +"'>"+ data[i].ADNM +"</option>";
			  }
			  $("#qs_xzq").html(str);
		  }
		 });
	}
</script>
<title>取用水户</title>
<style type="text/css">
	tr {
	    cursor: auto;
	}
	tbody>tr>td {
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	    /* text-align:left !important; */
	}
</style>
</head>
<body>
	<div class="searchDiv">
		<!-- 条件 -->
  		&nbsp;&nbsp;
		<div class="sc_div">
  			行政区：<select id="qs_xzq" class="sc_input"></select>
  		</div>
  		&nbsp;&nbsp;
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
  			取水用途：<select id="qs_way"  class="sc_input">
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
   	 	<div class="sc_div"  style="width:260px;">
	   	 	取水户名称：<input type="text" id="qsh_user" name="qsh_user" 
	   	 		placeholder="输入取水权人名称或代码"  class="sc_input"  style="width:162px;" >
	   	 </div>
  		&nbsp;&nbsp;
   		<!-- 查询 -->
    	<input type="button" value="查询" class="s_input" onclick="search()">	
	</div>
	<center class="conent">
		<div class="titleDiv">
			<!-- <span id="t_year"></span> --><span>取用水户信息表</span>
		</div>
		<table class="bbTable" id="oneTable" style="table-layout: fixed;">
			<thead>
				<tr>
					<td style="width:15%;">取水户名称</td>
					<td style="width:10%;">所在行政区</td>
					<td style="width:10%;">取水方式</td>
					<td >取水地点</td>
					<td style="width:8%;">许可水量<br>(万m³)</td>
					<td style="width:10%;">取水用途</td>
					<td style="width:10%;">累计取水量<br>(万m³)</td>
				</tr>
			</thead>
			<tbody id="tbody">
				
			</tbody>
		</table>
	</center>
</body>
<script type="text/javascript"
	src="<%=basePath%>common/js/layer/layer.js"></script>
<script type="text/javascript"
	src="<%=basePath%>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script 
	src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript"
	src="<%=basePath%>pages/rcgl/ssfzgl/qysh/qysh.js"></script>
</html>