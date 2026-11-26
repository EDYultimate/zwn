<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>机构设置</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  <style>
  body{background:#fff}
  table{font-size:15px}
      .tdborderDivsm{border-radius: 5px;border:1px solid #c5bbbb;width: 200px;text-align: center;display:inline-block;height: 28px;line-height: 28px;}
        .organgeModel{border:1px solid #ff8383;background:#f5c244;}
        .blueModel{background:#3ba2d7;color:#fff;width:260px}
        .comTr>td{text-align:center;padding: 25px 0 0;}
        .deptTr>td{height:100px;width:40px}
        .deptItemDiv{border:1px solid #48b4dc;width: 30px;height: 180px;text-align: center;margin-left:10px}
        .deptShortItemDiv{border:1px solid #48b4dc;width: 30px;height: 160px;text-align: center;margin-left:10px}
        .miniLeftline{display:inline-block;height:20px;border:2px solid #4d97d2;text-align:center;margin-left: 49%;}
        .minibottomline{width: 0px;margin: auto;height:20px;border:2px solid #4d97d2;text-align:center;}
        .textSpan{width: 25px;
				    margin: auto;
				    line-height: 30px;
				    display:inline-block;}
    .rightWidthTd{width: 30px;height: 200px;position: relative;}
     .rightWidthTd:before {
		content: "";
		position: absolute;
		left:50%;
		top:0;
		height: 2px;
		width: 65%;
		background-color: #4d97d2
		}
		.lineTd{border-top: 2px solid #4d97d2;}
	.leftWidthTd{width: 30px;height: 200px;position: relative;}
	 .leftWidthTd:before {
		content: "";
		position: absolute;
		right:49%;
		top:0;
		height: 2px;
		width: 54%;
		background-color: #4d97d2
		}
	.tdBottomBoder{border-bottom: 1px #ebb4b4 dashed;}
  </style>
  <body>
    <div style="width:100%;height:33%;min-height:270px;min-width: 1669px;">
    	<table style="min-width:1216px;width:100%;height:100%" cellpadding="0" cellspacing="0">
    		<tr class="comTr">
    			<td style="width:260px;padding: 0;font-size:16px"><div class="tdborderDivsm organgeModel" id="slb">部委水资源保护机构</div></td>
    			<td colspan='5' style="text-align:center;width: 233px;"><div class="tdborderDivsm blueModel">水利部</div>
    			<div class="minibottomline"></div></td>
    			<td colspan='7'><div class="tdborderDivsm blueModel">生态环境部</div><div class="minibottomline"></div></td>
    			<td colspan='7'><div class="tdborderDivsm blueModel">自然资源部</div><div class="minibottomline"></div></td>
    			<td colspan='5'><div class="tdborderDivsm blueModel">海河水利委员会</div><div class="minibottomline"></td>
    			<td colspan='1' style="width:100px"></td>
    		</tr>
    		<tr class="deptTr">
    			<td></td>
    		
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan">水资源管理司</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:34px">河湖管理司</span></div></td>
    			<td class="lineTd "></td>
    			<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:55px">水文司</span></div></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div>
    			<div class="deptItemDiv" style="width:70px">
    			<span class="textSpan " style="line-height:25px">中央生态环境</span>
    			<span class="textSpan " style="line-height:25px">保护督促办公室</span>
    			</div></td>
       			<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:55px">综合司</span></div></td>
       			<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan">水生态环境司</span></div></td>
       			<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 25px;">土壤生态环境司</span></div></td>
    			<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 25px;">生态环境监测司</span></div></td>
    			<td class=""></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 20px;">自然资源调查监测司</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
				<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 20px;">国土空间生态修复司</span></div></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 20px;">水资源节约与保护处</span></div></td>
				<td class="lineTd "></td>
				<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:34px">河湖管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:55px">水文局</span></div></td>
    		</tr>
    	</table>
    </div>
    
      <div style="width:100%;height:33%;min-height:270px;min-width: 1669px;">
    	<table style="min-width:1216px;width:100%;height:100%" cellpadding="0" cellspacing="0">
    		<tr class="comTr">
    			<td style="width:260px;padding: 0;font-size:16px"><div class="tdborderDivsm organgeModel" id="slb">省市水资源保护机构</div></td>
    			<td colspan='7' style="text-align:center;width: 233px;"><div class="tdborderDivsm blueModel">北京市水务局</div>
    			<div class="minibottomline"></div></td>
    			<td colspan='7'><div class="tdborderDivsm blueModel">天津市水务局</div><div class="minibottomline"></div></td>
    			<td colspan='7'><div class="tdborderDivsm blueModel">河北省水利厅</div><div class="minibottomline"></div></td>
    			<td colspan='5'><div class="tdborderDivsm blueModel">山西省水利厅</div><div class="minibottomline"></td>
    			<td colspan='1' style="width:100px"></td>
    		</tr>
    		<tr class="deptTr">
    			<td></td>
    		
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:30px">水资源管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan">地下水管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:20px">水土保持与水生态处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" >河长制工作处</span></div></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 25px;">水资源管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
				<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 35px;">河湖保护处</span></div></td>
    			<td class=""></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 25px;">水资源管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
				<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 35px;">河湖保护处</span></div></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height: 20px;">水文水资源管理处</span></div></td>
				<td class="lineTd "></td>
				<td class="lineTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:34px">河湖管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptItemDiv"><span class="textSpan" style="line-height:25px">河湖长制工作处</span></div></td>
    		</tr>
    	</table>
    </div>
      <div style="width:100%;height:30%;min-height:270px;min-width: 1669px;">
    	<table style="min-width:1216px;width:100%;height:100%" cellpadding="0" cellspacing="0">
    		<tr class="comTr">
    			<td style="width:260px;padding: 0;"></td>
    			<td colspan='5' style="text-align:center;width: 233px;"><div class="tdborderDivsm blueModel">河南省水利厅</div>
    			<div class="minibottomline"></div></td>
    			<td colspan='7'><div class="tdborderDivsm blueModel">山东省水利厅</div><div class="minibottomline"></div></td>
    			<td colspan='7'><div class="tdborderDivsm blueModel">内蒙古自治区水利厅</div><div class="minibottomline"></div></td>
    			<td colspan='5'><div class="tdborderDivsm blueModel">辽宁省水利厅</div><div class="minibottomline"></td>
    			<td colspan='1' style="width:100px"></td>
    		</tr>
    		<tr class="deptTr">
    			<td></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height:20px">水文水资源管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
    			<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height:20px">河湖长制工作处</span></div></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height: 25px;">水资源管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
				<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height: 25px;">河湖管理处</span></div></td>
    			<td class=""></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height: 25px;">水资源管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
				<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height: 25px;">河湖管理处</span></div></td>
    			<td class=""></td>
    			<td class=""></td>
    			<td class="rightWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height: 25px;">水资源管理处</span></div></td>
    			<td class="lineTd "></td>
    			<td class="lineTd "></td>
				<td class="leftWidthTd "><div class="miniLeftline"></div><div class="deptShortItemDiv"><span class="textSpan" style="line-height: 25px;">河湖管理处</span></div></td>
    			<td class=""></td>
    			</tr>
    	</table>
    </div>
  </body>
</html>
