<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>水资源保护概况</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">

<style>
  body{background-color: #fff;}

  .topDivlayout{width:39%;height:40%;float:left;display:inline-block;margin:5% 5% 3% 5%;border:1px solid #efefef}
  .bottomDivlayout{width:88%;height:40%;float:left;display:inline-block;margin-left:5%;border:1px solid #efefef}
  .titleTextDiv{height:48px;width:100%;color:#237bff;text-align:center;font-size:20px;line-height:48px;font-weight: bold;background-color:#fbfafa}
  .imgDiv{width:30%;height:100%;float:left;border:1px solid #efefef}
  .textDiv{width:65%;float:left;margin-left:3%;padding: 30px 0;font-size: 14px;}
  .moreBtn{cursor:pointer;height:20px;text-align:right}
 li {line-height: 38px;font-size: 13px;list-style: none;} 
 li>img{margin-right: 10px;}
  label{color: #237bff;font-size: 20px;}
  .numlabel{font-weight: bold;margin-left: 10px;}
</style>
 </head>
 <script>var basePath = '<%=basePath%>';</script>
  <body>
   <div class="topDivlayout" >
   		<div class="titleTextDiv">
   			流域综述
   		</div>
   		<div style="height:calc(100% - 48px);width:100%">
   			<div class="imgDiv">
   				<img width="100%" height="100%" src="images/savewater/sxpic.jpg">
   			</div>
   			<div class="textDiv">
   				<div style="height: calc(100% - 60px);overflow: hidden;vertical-align: middle;line-height: 180%;">
   				<p>
   				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;海河流域东临渤海,西倚太行，南界黄河，北接蒙古高原。流域总面积31.82万k㎡，占全国总面积的3.3%。
   				</p>
   				<p>
   				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全流域总的地势是西北高东南低，大致分高原、山地及平原三种地貌类型。西部为山西高原和太行山区，北部为蒙古高原和燕山山区，面积18.94万k㎡，占60％；东部和东南部为平原，面积12.84万k㎡，占40％。
   				</p>
   				<p>
   				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;海河流域包括海河、滦河和徒骇马颊河3大水系、7大河系、10条骨干河流。其中，海河水系是主要水系，由北部的蓟运河、潮白河、北运河、永定河和南部的大清河、子牙河、漳卫河组成...
   				</p>
   				</div>
   				<div class="moreBtn"  onclick="openDetail(1)">
   				  查看更多>>
   				</div>
   			</div>
   		</div>
   </div>
   <div class="topDivlayout" >
   <div class="titleTextDiv">
   			河流水系
   		</div>
   		<div style="height:calc(100% - 48px);width:100%">
   		<div class="imgDiv">
   				<img width="100%" height="100%" src="images/savewater/sxpic.jpg">
   			</div>
   			<div class="textDiv">
   				<div style="height: calc(100% - 60px);overflow: hidden;vertical-align: middle;line-height: 180%;">
   				<p>
   				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;海河流域位于东经112°～120°，北纬35°～43°之间，东临渤海，南界黄河，
   				西靠云中、太岳山，北依蒙古高原。地跨8省、自治区、直辖市，包括北京、天津两市全部，河北省绝大部分，山西省东部，
   				河南、山东省北部，以及内蒙古自治区和辽宁省各一小部分，总面积31.8万k㎡，其中山地和高原面积18.9万k㎡，占60％；
   				平原面积12.9万k㎡，占40％。1998年流域共有31个地级市，2个盟，256个县（区），其中含35个县级市。
   				</p>
   				<p>
   				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;海河流域包括海河、滦河、徒骇马颊河三大水系。由蓟运河、潮白河、北运河、永定河（以上河系为海河北系）、大清河、子牙河、
   				漳卫南运河...
   				</p>
   				</div>
   				<div class="moreBtn" onclick="openDetail(2)">
   				  查看更多>>
   				</div>
   			</div>
   		</div>
   </div>
   
    <div class="bottomDivlayout">
    <div class="titleTextDiv">
   			海河流域水生态环境现状
   		</div>
   		<div style="height:calc(100% - 48px);width:100%">
   			<div class="imgDiv" style="width:46%;border:none;">
   				<div style="width:45%;display: inline-block;">
   				 <img width="100%" height="100%" src="images/savewater/pic2.png">
   				</div>
   				<div  style="width:53%;display: inline-block;height:100%">
   					<ul style="float:left;height:90%;width: 90%;border-right: 2px solid #efefef;overflow:auto;margin-left:20px;margin-top:20px">
   					<li><img src="images/savewater/icon1.png">多年平均水资源<label class="numlabel">370</label><label>亿m³</label></li>
   					<li><img src="images/savewater/icon1.png">人均水资源量<label  class="numlabel">270</label><label>亿m³</label></li>
   					<li><img src="images/savewater/icon1.png">水资源开发利用率<label  class="numlabel">106</label><label>%</label></li>
   					<li><img src="images/savewater/icon1.png">河流断面生态流量满足度<label  class="numlabel">63</label><label>%</label></li>
   					<li><img src="images/savewater/icon1.png">湿地生态水面满足度<label  class="numlabel">50</label><label>%</label></li>
   					<li><img src="images/savewater/icon1.png">地下水多年累计亏空<label  class="numlabel">1800</label><label>亿m³</label></li>
   					</ul>
   				</div>
   			</div>
   			<div class="textDiv" style="width:51%;">
   				<div style="height: calc(100% - 60px);overflow: hidden;padding: 0;vertical-align: middle;line-height: 180%;">
   				<p>
   				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流域多年平均水资源总量370亿m"，仅占全国的1.3%却承载着全国8%的耕地、
   				10%以上的人口和经济总量，“人地水”不平衡的矛盾突出。流域人均水资源量270m，仅为全国平均水平的18，是资源性严重缺水地区。
   				为支撑经济社会发展用水需求，流域现状水资源开发利用率已达到106%过度的水资源开发利用挤占了大量生态环境用水，河道内生态用水“分光吃净”，
   				地下水超采，引发了河流干涸断流、湖泊湿地萎缩、入海水量锐减、地面沉降等严重的生态环境间题。
   				</p>
   				<p>
   				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对海河流域39条河流、12个主要湿地2012—2016年期间的生态流量满足情况调查评估显示，
   				41个河流评价断面中有26个断面满足生态流量目标要求，满足度63%； 12个湿地中6个满足生态水面目标要求，满足度50%； 24条平原河流平均年干涸长度1158km，
   				 占总河长的29%。流域主要湿地水面比20世纪50年代减少72%，地下水多年来累计亏空1800亿m3，地下水战略储备濒临枯竭。近年来，海河流域在水资源保护、
   				 水污染防治与水生态修复等方面做出了巨大努力，局部河湖生态环境有所改善，但2019年生态用水仅为总用水量的14.4%，流域水资源保护和水生态修复工作还任重道远。</p>
   				</div>
   				
   			</div>
   		</div>
   </div>
  </body>
  	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
   <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/szybh/lygk/waterProtect.js"></script>
</html>
