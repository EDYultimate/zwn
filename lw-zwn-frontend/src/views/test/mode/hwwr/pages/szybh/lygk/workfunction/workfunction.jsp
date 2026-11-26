<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>工作职能</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.css" type="text/css">
  </head>
  <style>
  body{background-color: #fff;overflow-x: auto;}
/*   .titleDiv{    
  	width: 280px;
    height: 40px;
    text-align: center;
    background: #169bd5;
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    border-radius: 5px;
    margin-left: 100px;} */
    
    .titleDiv {
     width: 230px;
    height: 25px;
    text-align: center;
    color: #000;
    font-size: 16px;
    line-height: 40px;
    margin-left: 50px;
    border-bottom: 5px solid #bddeea;
    border-left: 0px;
    border-right: 0px;
    border-top: 0px;
    }
    
    
    tr{height:25px}
    .tdborderDivsm{border-radius: 5px;border:1px solid #c5bbbb;width: 150px;text-align: center;display:inline-block}
    .tdborderDivmid{border-radius: 5px;border:1px solid #c5bbbb;width:220px;text-align: center;display:inline-block}
    .tdborderDivlarge{border-radius: 5px;border:1px solid #c5bbbb;width:670px;text-align: left;white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 500px;
    padding:0 0 0 20px}
    .organgeModel{border:1px solid #ff8383;background:#f5c244;}
    .blueModel{background:#5dbadc;color:#fff}
    .emptyModel{border:1px solid #5dbadc;}
    .line{display:inline-block;width:100px;border:2px solid #4d97d2}
    .minline{display:inline-block;width:100px;border:1px solid #5dbadc}
    .miniLeftline{display:inline-block;width:20px;border:2px solid #4d97d2}
    .minWidth{width:260px;border-right: 2px solid #4d97d2;}
    .midWidthTd{width:290px;position: relative;}
    .midWidthTd:before {
		content: "";
		position: absolute;
		left: -2px;
		top:58%;
		width: 2px;
		height: 50%;
		background-color: #4d97d2
		}
		
	.bottomTd{width:290px;position: relative;}
	.bottomTd:before {
		content: "";
		position: absolute;
		left: -2px;
		bottom:35%;
		width: 2px;
		height: 65%;
		background-color: #4d97d2
		}
		.infotextDiv{
			    width: calc(100% - 100px);
			    border: 1px solid #cdcdcd;
			    background: #f7f7f7;
			    font-size: 15px;
			    line-height: 35px;
			    padding: 20;
			    margin-left: 50px;
			    height: calc(100% - 140px);
			    overflow:auto;
			    margin-top:20px;
		}
		.layui-layer-tips .layui-layer-content{color:#000 !important;border: 1px solid #ff8383;}
  </style>
  <body>
   <div style="height:55%;width:100%;min-height:360px">
   	<div class="titleDiv">水资源保护工作部委职能分工</div>
   	<div  style="width:90%;height: calc(100% - 40px);margin: auto;">
   <!-- 	<div id="main" style="height:100%;width:100%;"></div> -->
<table style="min-width:1216px;width:100%;height:100%" cellpadding="0" cellspacing="0">
   		<tr>
   			<td ></td>
   			<td class="midWidthTd"><div class="miniLeftline"></div><div class="tdborderDivsm blueModel">水资源管理司</div><div class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="指导河湖生态流量水量管理。组织编制水资源保护规划，指导饮用水水源保护有关工作。参与编制水功能区划和指导入河排污口设置管理工作。">指导河湖生态流量水量管理。组织编制水资源保护规划，指导饮用水水源保护有关工作。参与编制水功能区划和指导入河排污口设置管理工作。</div></td>
   		</tr>
   		<tr>
   			<td class="minWidth"><div class="tdborderDivsm organgeModel tips" id="slb">水利部</div><div class="line"></div></td>
   			<td><div class="miniLeftline"></div><div class="tdborderDivsm blueModel">河湖管理司</div><div class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="指导水域及其岸线的管理和保护，指导河湖水生态保护与修复以及河湖水系连通工作。">指导水域及其岸线的管理和保护，指导河湖水生态保护与修复以及河湖水系连通工作。</div></td>
   		</tr>
   		<tr>
   			<td></td>
   			<td class="bottomTd"><div class="miniLeftline"></div><div class="tdborderDivsm blueModel">水文司</div><div class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="负责水文水资源（含水位、流量、水质等要素）监测工作，组织实施江河湖库和地下水监测。发布水文水资源信息、情报预报。">负责水文水资源（含水位、流量、水质等要素）监测工作，组织实施江河湖库和地下水监测。发布水文水资源信息、情报预报。</div></td>
   		</tr>
   		<tr>
   		<td></td><td></td><td></td>
   		</tr>
   		<tr>
   			<td></td>
   			<td  class="midWidthTd"><div class="miniLeftline"></div><div class="tdborderDivmid blueModel">中央生态环境保护督察办公室</div><div style="width:30px" class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="承担中央生态环境保护督察组织协调工作。承担国务院生态环境保护督察工作领导小组日常工作">承担中央生态环境保护督察组织协调工作。承担国务院生态环境保护督察工作领导小组日常工作</div></td>
   		</tr>
   		<tr>
   			<td class="minWidth"><div class="tdborderDivsm organgeModel tips"  id="sthjb">生态环境部</div><div class="line"></div></td>
   			<td><div class="miniLeftline"></div><div class="tdborderDivsm blueModel">综合司</div><div class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="承担污染物排放总量控制综合协调和管理工作，拟订生态环境保护年度目标和考核计划。">承担污染物排放总量控制综合协调和管理工作，拟订生态环境保护年度目标和考核计划。</div></td>
   		</tr>
   		<tr>
   			<td class="minWidth"></td>
   			<td><div class="miniLeftline"></div><div class="tdborderDivsm blueModel">水生态环境司</div><div class="minline"></div></td>
   			<td>
   			<div class="tdborderDivlarge emptyModel" title="负责全国地表水生态环境监管工作，拟订和监督实施国家重点流域生态环境规划，建立和组织实施跨省（国）界水体断面，水质考核制度，监督管理饮用水水源地生态环境保护工作，指导入河排污口设置。">负责全国地表水生态环境监管工作，拟订和监督实施国家重点流域生态环境规划，建立和组织实施跨省（国）界水体断面，水质考核制度，监督管理饮用水水源地生态环境保护工作，指导入河排污口设置。</div>
   			</td>
   		</tr>
   		<tr>
   			<td class="minWidth"></td>
   			<td><div class="miniLeftline"></div><div class="tdborderDivsm blueModel">土壤生态环境司</div><div class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="负责全国土壤、地下水等污染防治和生态保护的监督管理。">负责全国土壤、地下水等污染防治和生态保护的监督管理。</div></td>
   		</tr>
   		<tr>
   			<td ></td>
   			<td class="bottomTd"><div class="miniLeftline"></div><div class="tdborderDivsm blueModel">生态环境监测司</div><div class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="组织开展生态环境监测，调查评估全国生态环境质量状况并进行预测预警，承担国家护生态环境监测网建设和管理工作。">组织开展生态环境监测，调查评估全国生态环境质量状况并进行预测预警，承担国家护生态环境监测网建设和管理工作。</td>
   		</tr>
   		<tr>
   		<td></td><td></td><td></td>
   		</tr>
   		<tr>
   			<td></td>
   			<td  class="midWidthTd"><div class="miniLeftline"></div><div class="tdborderDivmid blueModel">自然资源调查监测司</div><div style="width:30px" class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="开展水、森空间林、草原、湿地资源和地理国情等专项调查监测评价工作。">开展水、森空间林、草原、湿地资源和地理国情等专项调查监测评价工作。</div></td>
   		</tr>
   		<tr>
   			<td class="minWidth"><div class="tdborderDivsm organgeModel tips" id="zrzyb">自然资源部</div><div class="line"></div></td>
   			<td></td>
   			<td></td>
   		</tr>
   		<tr>
   			<td></td>
   			<td class="bottomTd"><div class="miniLeftline"></div><div class="tdborderDivmid blueModel">国土空间生态修复司</div><div style="width:30px" class="minline"></div></td>
   			<td><div class="tdborderDivlarge emptyModel" title="承担生态保护补偿相关工作。">承担生态保护补偿相关工作。</div></td>
   		</tr>
   	</table> 
   	</div>
   	
   </div>
   <div style="height:45%;width:100%;">
   	<div class="titleDiv">海委水资源保护工作定位及思路</div>
   <div class="infotextDiv">
    		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    		海委水资源保护工作定位及思路海委水资源保护工作定位就是“当好水利部的参谋、助手”，
    		履行好河湖代言人职责。海委“三定”方案尚未批复，根据水利部“三定”职能和工作部署，
    		目前海委水资源保护工作内容主要是按照水利部授权，做好河湖生态流量保障、地下水超采综合治理、
    		饮用水水源保护、水污染应对、水质(水文要素)监测等。</p>
    		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    		总体工作思路是以习近平新时代中国特色社会主义思想、党的十九大和十九届二中、三中、四中、五中全会精神为指导，
    		遵循习总书记提出的“节水优先、空间均衡、系统治理、两手发力”治水思路，贯彻落实好总书记在黄河流域生态保护和高质量发展座谈会、
    		全面推动长江经济带发展座谈会上的重要讲话精神以及水利改革发展总基调，坚持“重在保护，要在治理”战略，着力补齐行业管理和社会管理中的短板，
    		大力提升治理体系和治理能力现代化水平，实现“在发展中保护、在保护中发展”，助力构建水生态文明体系，为打造“幸福海河”提供有力支撑。
    		</p>
    		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    		近期具体举措:以打造“幸福海河”为工作目标，坚持水资源保护、水环境治理、水生态修复并重，以项目实施为支撑，抓好华北地区地下水超采综合治理、
    		河湖生态流量保障饮用水水源保护等重点工作，建立健全水环境评基础数据体系，完善水资源监控系统相关功能模块，全面提升海河流域水资源保护能力和水平。
    		</p>
   
   </div>
   </div>
  </body>

	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>pages/szybh/lygk/workfunction/echarts-2.x.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
     <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
   <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>/pages/szybh/lygk/workfunction/workfunction.js"></script></html>
