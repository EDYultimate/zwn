<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>新闻动态页面</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  <script>var basePath = '<%=basePath%>';</script>
  </head>
  <style>
  body{background-color:#fbfbfb}
  .topDivlayout {
    width: 45%;
    height: 35%;
    float: left;
    display: inline-block;
    margin: 10px 20px 10px 30px;
    border: 1px solid #efefef;
    background-color:#fff;
    min-width:500px;
    min-height:300px;
    color:#5a5a5a
	}
.titleTextDiv{
    height: 48px;
    width: 100%;
    font-size: 18px;
    line-height: 48px;
    font-weight: bold;
    background-color: #f5f5f5;
    color:#5a5a5a
}
img{width:20px;height:20px;margin-left:10px;margin-right:10px;}
.moreTextDiv{float:right;font-size:16px;font-weight: 400;cursor:pointer}
.linews_titleDiv{float:left;display:inline-block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width: 80%;}
.linews_tmDiv{float:right;display:inline-block;}
ul{
	line-height: 180%;
    padding: 0px 30px 0 40px;
    width: calc(100% - 50px);
}
li{line-height:35px;list-style-type: disclosure-closed;cursor: pointer;}
.outDiv{width:100%;height:37%;min-width:1123px}
.linkBtnDiv{
	color: #5a5a5a;
    text-align: center;
    width: 150px;
    height: 35px;
    font-size: 16;
    display: inline-block;
    border: 2px solid #ebebeb;
    background-color: #fff;
    font-weight: bold;
    margin-top: 20px;
    line-height: 35px;
    margin-left: 30px;
    cursor:pointer
}
.linkBtnDivClick{
    background: #7cb6f9;
    color: #fff;
    }
.linkItemDiv{
	width: 150px;
    float: left;
    height: 100%;
    font-size: 14px;
    margin-left: 30px;
    margin-top: 30px;
    cursor:pointer
}
  </style>
  <body>

    <div class="outDiv" >
    <div class="topDivlayout" >
   		<div class="titleTextDiv">
   			<img src="images/savewater/new_2.png">水利部要闻
   			<div class="moreTextDiv" onclick="morePage('6')">更多》</div>
   		</div>
   		<div style="height:calc(100% - 48px);width:100%">
   		<ul id="slb_news">
   				
   		</ul>
   		</div>
   </div>
   <div class="topDivlayout" >
   		<div class="titleTextDiv">
   			<img src="images/savewater/new_3.png">海委要闻
   			<div class="moreTextDiv" onclick="morePage('a')">更多》</div>
   		</div>
   		<div style="height:calc(100% - 48px);width:100%">
   		<ul id="hw_news">
   				
   		</ul>
   		</div>
   </div>
    </div>
    
     <div class="outDiv" >
    <div class="topDivlayout" >
   		<div class="titleTextDiv">
   			<img src="images/savewater/new_4.png">地方动态
   			<div class="moreTextDiv" onclick="morePage('8')">更多》</div>
   		</div>
   		<div style="height:calc(100% - 48px);width:100%">
   		<ul id="df_news">
   				
   		</ul>
   		</div>
   </div>
    <div class="topDivlayout" >
   		<div class="titleTextDiv">
   			<img src="images/savewater/new_5.png">环保部门动态
   			<div class="moreTextDiv" onclick="morePage('9')">更多》</div>
   		</div>
   		<div style="height:calc(100% - 48px);width:100%">
   		<ul id="hb_news">
   				
   		</ul>
   		</div>
   </div>
   </div>
   <div style="width:100%;height:15%;margin-top:30px;border-top:3px solid #5aa2d7;float:left">
	   	<div style="width:100%;height:50%">
		   	<div id="slb_btn" class="linkBtnDiv linkBtnDivClick" onclick="changeTab('slb')">水利部</div>
		   	<div id="df_btn" class="linkBtnDiv" onclick="changeTab('df')">地方水利厅</div>
		   	<div id="sthj_btn" class="linkBtnDiv" onclick="changeTab('sthj')">生态环境部</div>
		   	<div id="zrzy_btn" class="linkBtnDiv" onclick="changeTab('zrzy')">自然资源部</div>
	   	</div>
	   	
	   	<div class="tabClassContent" id="df" style="width:100%;height:50%;display:none">
	   		<div class="linkItemDiv" onclick="openlink('http://swj.beijing.gov.cn')">北京市水务局</div>
	   		<div  class="linkItemDiv"  onclick="openlink('http://swj.tj.gov.cn/')">天津市水务局</div>
	   		<div class="linkItemDiv"  onclick="openlink('http://slt.hebei.gov.cn/')">河北省水利厅</div>
	   		<div class="linkItemDiv"  onclick="openlink('http://slt.shanxi.gov.cn/')">山西省水利厅</div>
	   		<div class="linkItemDiv"  onclick="openlink('http://wr.shandong.gov.cn/')">山东省水利厅</div>
	   		<div class="linkItemDiv"  onclick="openlink('http://slt.henan.gov.cn/')">河南省水利厅</div>
	   		<div class="linkItemDiv"  onclick="openlink('http://slt.nmg.gov.cn/')">内蒙古自治区水利厅</div>
	   		<div class="linkItemDiv"  onclick="openlink('http://slt.ln.gov.cn/')">辽宁省水利厅</div>
	   	</div>
	   	<div class="tabClassContent" id="slb" style="width:100%;height:50%;">
	   		<div class="linkItemDiv" onclick="openlink('http://szy.mwr.gov.cn/')">水利部水资源司</div>	   		
	   	</div>
	   	<div class="tabClassContent" id="sthj" style="width:100%;height:50%;display:none">
	   		<div class="linkItemDiv" onclick="openlink('http://www.mee.gov.cn/')">生态环境部</div>	   		
	   		<div class="linkItemDiv" style="width:350px" onclick="openlink('https://hhbhjg.mee.gov.cn/')">生态环境部海河流域北海海域生态环境监督管理局</div>	   		
	   	</div>
	   	<div class="tabClassContent" id="zrzy" style="width:100%;height:50%;display:none">
	   		<div class="linkItemDiv" onclick="openlink('http://www.mnr.gov.cn/')">自然资源部</div>	   		
	   	</div>
   </div>
  </body>
    	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
   <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/szybh/lygk/newInfo/newsInfo.js"></script>
</html>
