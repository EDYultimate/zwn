<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>预警评估详情</title>
    
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/excel/excel-gen.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/FileSaver.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/jszip.js"></script>
        
    <script>var basePath = '<%=basePath%>';</script>
    <style>
    .bbTable>thead>tr>td, th {
   		 border-color: #e4e4e4;
  	  background: #F5F5F5;
	}
	.searchDiv {
    background-color: white;
	}
    
        table{table-layout:fixed;}
        
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        table tr:nth-child(even){
			background: #f3f8ff;
			}
			.titleItemDiv{    
			width: 24%;
		    height: 80%;
		    float: left;
		    border: 1px solid #efefef;
/* 		    text-align: center; */
		    line-height: 100px;
		    }
		.imgdiv>img{width:40px;height:40px;}
	.infotext{    
		    display: inline-block;
		    margin-left: 8px;
		    font-size: 15px;
		    }
	.infonum{font-size:26px;display: inline-block;}
	.imgdiv{display: inline-block;}

	
	.center_text{
		　display:inline-block;
　　width:500px;}

.scQuery_div {
/* 	width: 180px; */
	height: 40px;
/* 	text-align: center; */
/* 	background-color:white; */
/* 	border: 1px solid #aebac9; */
/* 	border-radius: 8px; */
	line-height: 2.7;
	display:inline-block;
}

.scQuery_div select {
	width: 100;
}

.query_input {
	height: 25;
    width: 70;
    border-radius: 8px;
    border: 1px solid #E1E1E1;
    background-color: #469dff;
    color: #FFFFFF;
    border-color: #7491d4;
    font-size: 16px;
    vertical-align: middle;
}

.conent {
    overflow-y: clip;
}
       </style>

  </head>
  
  <body>
   <div class="searchDiv">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
    &nbsp;&nbsp;
    <div class="scQuery_div" >
       	年份：<input id='nianFen' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
    </div>
    &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	印发机构: 
	      	<select id="yinFaJiGou"   >
				<option value="">全部</option>
				<option value="水利部">水利部</option>
				<option value="北京市">北京市</option>
				<option value="天津市">天津市</option>
				<option value="河北省">河北省</option>
				<option value="山西省">山西省</option>
			</select>
    </div>
   &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	河湖名称: 
	      	<select id="heHuMingCheng"   >
	      		<option value="">全部</option>
				<option value="白洋淀">白洋淀</option>
				<option value="七里海">七里海</option>
				<option value="滦河">滦河</option>
				<option value="永定河">永定河</option>
				<option value="北护城河">北护城河</option>
				<option value="清河">清河</option>
				<option value="十三陵水库">十三陵水库</option>
				<option value="昆明湖">昆明湖</option>
				<option value="七里海湿地（东）">七里海湿地（东）</option>
				<option value="洪泥河">洪泥河</option>
				<option value="龙凤河故道（104国道至北运河段）">龙凤河故道（104国道至北运河段）</option>
				<option value="滹沱河（河北段）">滹沱河（河北段）</option>
				<option value="滹沱河（河北段）">青龙河（河北段）</option>
				<option value="衡水湖">衡水湖</option>
				<option value="滹沱河">滹沱河</option>
				<option value="桑干河（山西段）">桑干河（山西段）</option>
				<option value="浊漳河">浊漳河</option>
				<option value="浊漳南源">浊漳南源</option>
				<option value="浊漳西源">浊漳西源</option>
			</select>
    </div>
   &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	断面类型: 
	      	<select id="duanPianLeiXing" >
	      		<option value="">全部</option>
				<option value="1">考核断面</option>
				<option value="2">管理断面</option>
				<option value="3">考核/管理断面</option>
				<option value="4">计算断面</option>
				
			</select>
    </div>
&nbsp;
      <div class="scQuery_div"  style="width: 200;">
      	断面名称:<input id="duanMianMingCheng" style="width: 120;" placeholder="名称"  >
      </div>

    <input type="button" value="查询" class="query_input" onclick="search()">
    
        <input type="button" value="打印" class="query_input" onclick="printpage()">
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>


<!-- overflow:hidden; -->
<center class="conent" style="padding-bottom:10px;height:100%">
    <div class="titleDiv" style="width:92%;height:100px;border: 0px;margin-top:5px">
	    <div class="titleItemDiv" style="">
	    	<div class="imgdiv"><img src="images/savewater/allicon.png"></div>
	    	<div class="infonum" id="totalSectionNum">0</div>处
	    	<div class="infotext" >断面总数</div>
	    </div>
	     <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/targeticon.png"></div>
	     	<div class="infonum" id="totalSectionCheckNum" >0</div>处
	    	<div class="infotext" >考核断面</div>
	    </div>
	    
	    <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/targeticon.png"></div>
	     	<div class="infonum" id="totalSectionManageNum" ></div>处
	    	<div class="infotext" >管理断面</div>
	    </div>
	    
	    <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/targeticon.png"></div>
	     	<div class="infonum" id="totalSectionComputeNum" ></div>处
	    	<div class="infotext" >计算断面</div>
	    </div>
	    
	    
	     <div class="titleItemDiv" style="margin-left: 270px;margin-top: 10px;" >
	     	<div class="imgdiv"><img src="images/savewater/watericon.png"></div>
	     	<div class="infonum" id="totalSectionCheckManageNum" >0</div>处
	    	<div class="infotext" >考核/管理断面</div>
	    </div>
	    <div class="titleItemDiv" style="margin-left: 35px;margin-top: 10px;">
	     	<div class="imgdiv"><img src="images/savewater/moneyicon.png"></div>
	     	<div class="infonum" id="totalDBnum">0</div>处
	    	<div class="infotext" id="totalDBrate" >考核断面保证程度100%</div>
	    </div>
    </div>
    <div >
	   		<span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 45%;padding: 15;">河湖生态流量达标评估汇总统计</span>
	   		
	  </div>
	  
<div style="height:350px;overflow-y: scroll;display: inline-block; margin-top: -20px;">

	<div id="dydiv">
	    <table id="dytable" class="bbTable" style="margin-top:20px;width:99%" >
	        <thead>
	        <tr>
	            <td style="width:40">序号</td>
	            <td >断面名称</td>
	            <td >所在河流</td>
	            <td style="width:110">印发机构</td>
	            <td >断面类型</td>
	            <td style="width:110">目标印发年份</td>
	            <td style="width:110">考核评价时长</td>
	            <td >考核期</td>
	            <td >全年考核时段数</td>
	            <td >目前考核时段数</td>
	            <td >达标时段数</td>
	            <td style="width:110">保证程度(%)</td>
	        </tr>
	        </thead>
	        <tbody id="TableData">	
	        </tbody>
	    </table>    
    </div>
    
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
    
</div>

</center>

  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/ecologyFlow/warnDetail/warnDetail.js"></script>

</html>
