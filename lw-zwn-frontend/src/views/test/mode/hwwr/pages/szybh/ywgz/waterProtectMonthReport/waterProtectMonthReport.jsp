<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>湖生态补水详情</title>
    
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/excel/excel-gen.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/FileSaver.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/jszip.js"></script>
        
    <script>var basePath = '<%=basePath%>';</script>
    <style>
	table{table-layout:fixed;}
	
	.bbTable>thead>tr>td, th {
   		border-color: #e4e4e4;
  	  background: #F5F5F5;
	}
				        
				        
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        table tbody tr:nth-child(even){
			background: #f3f8ff;
			}

		.scQuery_div {
			height: 40px;
			line-height: 2.7;
			margin: 20 0 0 40;
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
       </style>

  </head>
  
  <body style="background-color: #fbfbfb;">
	   <div class="scQuery_div" >
	       	时间：<input id='nianFen' type='text'  style="width: 80;border: 1px solid #cccccc;background-color: #f5f5f5;" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})"/>
	       <input type="button" value="查询" class="query_input" onclick="search()">    	       	
	    </div>
 

<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%;background-color: #fbfbfb;">

  	 <div name="left" id="two" style=" height:770;width:1100;display:inline-block;">
  	   	<div style="height:55">
  			<img  style="margin-top: 10;float: left;    margin-left: 30;" src="images/savewater/waterProtectMonthReport.png"> 
				
  		</div>
  		
  	</div>

</center>
  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script>

<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/waterProtectMonthReport/waterProtectMonthReport.js"></script>

</html>
