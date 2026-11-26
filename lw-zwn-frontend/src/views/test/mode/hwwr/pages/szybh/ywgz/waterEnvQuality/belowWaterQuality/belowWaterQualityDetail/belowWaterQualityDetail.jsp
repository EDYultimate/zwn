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
       </style>

  </head>
  
  <body>
   <div class="searchDiv">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
    &nbsp;&nbsp;
    <div class="scQuery_div" >
       	日期：<input id='M_DATE' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyyMM'})"/>
    </div>
    &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	测站类型: 
	      	<select id="CATEGORY"   >
				<option value="">全部</option>
				<option value="1">水源地</option>
				<option value="2">专门监测井</option>
				<option value="3">生产井</option>			
			</select>
    </div>
   &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	行政区: 
	      	<select id="ADDVCD"   >
				<option value="">全部</option>
				<option value="110000000000">北京市</option>
				<option value="120000000000">天津市</option>
				<option value="130000000000">河北省</option>
				<option value="140000000000">山西省</option>
				<option value="150000000000">内蒙古</option>
				<option value="370000000000">山东省</option>
				<option value="410000000000">河南省</option>				
			</select>
    </div>
   &nbsp;
      <div class="scQuery_div"  style="width: 200;">
      	名称:<input id="STNM" style="width: 120;" placeholder="名称"  >
      </div>

    <input type="button" value="查询" class="query_input" onclick="search()">
    
        <input type="button" value="打印" class="query_input"  onclick="printpage()">
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>



<center class="conent" style="overflow:visible;padding-bottom:10px;height:100%">
    
   <div >
	   		<span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 45%;padding: 15;">海河流域地下水水质状况统计</span>
	   		
	  </div>
	  
	<div id="dydiv">
	    <table id="dytable" class="bbTable" style="margin-top:20px;width:97%" >
	        <thead>
	        <tr>
	            <td rowspan="2" style="width:10%;">名称</td>
	            <td rowspan="2">所在行政区</td>
	            <td rowspan="2" style="width:10%;">类型</td>
	            <td rowspan="2">水质类别</td>
<!-- 	            <td rowspan="2">操作</td> -->
	           
	            
	        </tr>
	        </thead>
	        <tbody id="TableData">	
<!-- 	        	<tr> -->
<!-- 		            <td ><a href='javascript:void(0)' onclick="divClick('北京市自来水集团第二水厂','00000001','1')">北京市自来水集团第二水厂</a></td> -->
<!-- 		            <td >北京市</td> -->
<!-- 		            <td >水源地</td> -->
<!-- 		            <td >III</td>		            -->
		                  
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td ><a href='javascript:void(0)' onclick="divClick('南庄','00000001','1')">南庄</a></td> -->
<!-- 		            <td ></td> -->
<!-- 		            <td >专门监测井</td> -->
<!-- 		            <td >III</td>	 -->
		                  
<!-- 	       		 </tr> -->
<!-- 	       		  <tr> -->
<!-- 		            <td ><a href='javascript:void(0)' onclick="divClick('贝壳堤','00000001','1')">贝壳堤</a></td> -->
<!-- 		            <td ></td> -->
<!-- 		            <td >生产井</td> -->
<!-- 		            <td >III</td>	 -->
		                 
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td ></td>		            -->
<!-- 	       		 </tr> -->
<!-- 	       		  <tr> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 	       		 </tr> -->
<!-- 	       		  <tr> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td ></td>		            -->
<!-- 	       		 </tr> -->
<!-- 	       		  <tr> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td ></td>		            -->
<!-- 	       		 </tr> -->
<!-- 	       		  <tr> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td ></td>		            -->
<!-- 	       		 </tr> -->
<!-- 	       		  <tr> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td > </td> -->
<!-- 		            <td ></td>		            -->
<!-- 	       		 </tr> -->
	        </tbody>
	    </table>    
    </div>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
    


</center>

  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/waterEnvQuality/belowWaterQuality/belowWaterQualityDetail/belowWaterQualityDetail.js"></script>

</html>
