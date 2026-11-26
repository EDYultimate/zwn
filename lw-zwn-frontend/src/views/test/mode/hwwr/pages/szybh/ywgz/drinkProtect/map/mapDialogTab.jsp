<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String SWS_CD = request.getParameter("SWS_CD");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>地下水</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	  <script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/drinkProtect/map/mapDialogTab.js"></script>
	<script>
		var basePath = '<%=basePath%>';
		var SWS_CD = '<%=SWS_CD%>';

	</script>
  </head>
  <style>
	li.clickLiTab {
	    background-color: #fff9d6;
	    color: black;
	    border-radius: 5px;
	    border-color: #f4c86f;
	}
	.liTab {
	    color: #393939;
	    float: left;
	    list-style: none;
	    width: 110px;
/* 	    border: 1px solid #E1E1E1; */
	    text-align: center;
	    height: 30px;
	    cursor: pointer;
	    font-size: 16px;
	    font-family: "微软雅黑";
	    background-color: #fff;
	    border-radius: 5px;
	    margin-left: 30;
    	margin-top: 16;
	}

  </style>
  <body>
  	<div id="titleBasicInfoDiv"  style="height: 100; " >
  		<div style="margin-left:10px;height:55">
  			<img  style="margin-left:10;margin-top: 10;" src="images/savewater/setctionPic.png"> 
<!-- 			<span id="sectionNMspan " style="position: absolute; left: 0;font-weight:bold;color:#424242; -->
<!-- 			font-size: 25;font-family: STKaiti;margin-left: 80;margin-top: 16;">筛选条件</span> 	 -->
			<div id="sectionBasicInfoDiv" style="position: absolute;margin-left:30;margin-top:15;width:90%;height:35;font-size:16;display: inline;">
				位于天津市蓟州区下营镇，水源地类型：水库型，供水城市：天津市，供水人口：800万人，供水能力：100万m3/d，管理单位：于桥水库管理处，管理单位所属行业：水利。
			</div>
  		</div>
  		
<!--   		<div style="height:35; "> -->
<!-- 			<div id="sectionBasicInfoDiv" style="margin-left:78;width:70%;height:35;font-size:16;display: inline;"> -->
<!-- 				基本 -->
<!-- 			</div> -->
<!-- 			<div style="display: inline; margin-left: 850;"> -->
<!-- 				<span id="provienceSpan" style="font-weight:bold;color:#5588dc; -->
<!-- 					font-size: 16;font-family: STHeiti; "></span>河湖断面| -->
<!-- 					<span id="sectionTypeSpan" style="font-weight:bold;color:#5588dc; -->
<!-- 					font-size: 16;font-family: STHeiti; "></span>断面	 -->
<!-- 			</div>	 -->
<!--   		</div> -->
  	
  	</div>
  	
  	
  	<div style="width:100%;height:10;background-color: #f2f2f2;"></div>
  	
  	<div class="right_menu" style="margin-left:10px;height: 50;">
  		<ul>
  			<li id="szpj" class="liTab clickLiTab"><span>水质评价</span></li>
  			<li id="dbjsqk" class="liTab" ><span>达标建设情况</span></li>
  		</ul>
<!--   		<hr style="margin:0px;height:1px;border:0px;background-color:#D5D5D5;color:#D5D5D5;"/> -->
  	</div>
    		<div style="border-top:1px dashed #d7d7d7;height: 1px;overflow:hidden;margin-top: 15;"></div>
  
    <center class="conent">
	    <div class="frameDiv">
			<iframe id="iframe" src=""></iframe>			
		</div>
	</center> 
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>

</html>
