<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String year = request.getParameter("year");
String sea = request.getParameter("sea");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>预警评估详情</title>
    
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/excel/excel-gen.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/FileSaver.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/jszip.js"></script>
            
    <link type="text/css" href="<%=basePath %>common/js/layui/seasonSel/new/css/layui.css" rel="stylesheet" />
	<script type="text/javascript" src="<%=basePath %>common/js/layui/seasonSel/new/layui.js"></script>
    
    <script>
    var basePath = '<%=basePath%>';    
	var year = '<%=year%>';
	var sea = '<%=sea%>';

    </script>
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
			
	
	
/* 	.center_text{ */
/* 		　display:inline-block; */
/* 　　width:500px;} */

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

.layui-hide {
    display: flex;
}
       </style>

  </head>
  
  <body>
   <div class="searchDiv">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
<!--     &nbsp;&nbsp; -->
<!--     <div class="scQuery_div" > -->
<!--        埋藏条件:  -->
<!-- 	      	<select id="maiCang"   > -->
<!-- 				<option value="1">浅层</option> -->
<!-- 				<option value="2">深层</option> -->
<!-- 			</select> -->
<!--     </div> -->
    &nbsp;
<!--     <div class="scQuery_div"  style="width: 170;"> -->
<!--       	行政区:  -->
<!-- 	      	<select id="xingZhengQu"   > -->
<!-- 				<option value="">全部</option> -->
<!-- 				<option value="北京市">北京市</option> -->
<!-- 				<option value="天津市">天津市</option> -->
<!-- 				<option value="河北省">河北省</option> -->
<!-- 				<option value="山西省">山西省</option> -->
<!-- 				<option value="内蒙古">内蒙古</option> -->
<!-- 				<option value="山东省">山东省</option> -->
<!-- 				<option value="河南省">河南省</option>				 -->
<!-- 			</select> -->
<!--     </div> -->
<!--    &nbsp; -->
<!--       <div class="scQuery_div"  style="width: 200;"> -->
<!--       	水源地名称:<input id="shuiYuanDiMingCheng" style="width: 120;" placeholder="名称"  > -->
<!--       </div> -->

<!--      &nbsp; &nbsp;<input type="button" value="查询" class="query_input" onclick="search()"> -->
    
<!--         <input type="button" value="打印" class="query_input"  onclick="printpage()"> -->
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>



<!-- <center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%"> -->
    
   	  <div style="width: 97%;">
	   	<span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 45%;">生态流量监测信息填报</span>
	   		
	  </div>
	  
	<div id="dydiv" style="width: 97%;height: 90%;padding: 20;">
	  
 		<table class="layui-hide" id="test"  escape: true lay-filter="test"></table> 
   	<div style="float: right;">
	    <input type="button" value="保存" style="background-color: #17BDB0;" class="query_input" onclick="saveGW()">	
	</div>
	</div>

<!-- </center> -->


  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/dataFill/ecologyFlow/EFFillListEditSFY.js"></script>

</html>
