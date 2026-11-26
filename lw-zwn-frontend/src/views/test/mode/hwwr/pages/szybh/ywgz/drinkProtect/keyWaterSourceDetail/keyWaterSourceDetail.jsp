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
       	年份：<input id='nianFen' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
    </div>
    &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	行政区: 
	      	<select id="xingZhengQu"   >
				<option value="">全部</option>
				<option value="北京市">北京市</option>
				<option value="天津市">天津市</option>
				<option value="河北省">河北省</option>
				<option value="山西省">山西省</option>
				<option value="内蒙古">内蒙古</option>
				<option value="山东省">山东省</option>
				<option value="河南省">河南省</option>				
			</select>
    </div>
   &nbsp;
      <div class="scQuery_div"  style="width: 200;">
      	水源地名称:<input id="shuiYuanDiMingCheng" style="width: 120;" placeholder="名称"  >
      </div>

    <input type="button" value="查询" class="query_input" onclick="search()">
    
        <input type="button" value="打印" class="query_input"  onclick="printpage()">
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>



<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%">
    
   <div >
	   		　	   		<span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 45%;padding: 15;">水源地汇总统计</span>
	   		
	  </div>
	  
	<div id="dydiv">
	    <table id="dytable" class="bbTable" style="margin-top:20px;width:97%" >
	        <thead>
	        <tr>
	            <td rowspan="2" style="width:10%;">水源地名称</td>
	            <td rowspan="2">所在行政区</td>
	            <td rowspan="2" style="width:10%;">类型</td>
	            <td rowspan="2">供水城市</td>
	            <td rowspan="2">供水人口（万）</td>
	            <td rowspan="2">管理单位所属行业</td>
	            <td rowspan="2">水质达标率（%）</td>
	            <td rowspan="2">达标建设情况</td>
	            
	            
	        </tr>
	        </thead>
	        <tbody id="TableData">	
	        	<tr>
					<td ><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">密云水库水源地</a></td>	<td >北京市</td>	<td >水库</td>	<td >密云区</td>	
					<td >560</td>	<td >密云水库管理处</td>   <td >80</td>	<td >良好</td>	  
				</tr>
	        	<tr>
					<td ><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">怀柔水库水源地</a></td>	<td >北京市</td>	<td >水库</td>	<td >怀柔区</td>	 
					<td >200</td>   <td >怀柔水库管理处</td>	<td >67</td>	<td >不合格</td>  
				</tr>
				<tr>
					<td ><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">白河堡水库水源地</a></td>	<td >北京市</td>	<td >水库</td>	<td >顺义区</td>	 
					<td >350</td>   <td >顺义区水务局</td>	<td >97</td>	<td >未开展</td>  
				</tr>
				<tr>
					<td ><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">白河堡水库水源地</a></td>	<td >北京市</td>	<td >水库</td>	<td >顺义区</td>	 
					<td >350</td>   <td >顺义区水务局</td>	<td >97</td>	<td >未开展</td>  
				</tr>
				<tr>
					<td ><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">白河堡水库水源地</a></td>	<td >北京市</td>	<td >水库</td>	<td >顺义区</td>	 
					<td >350</td>   <td >顺义区水务局</td>	<td >97</td>	<td >未开展</td>  
				</tr>
				<tr>
					<td ><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">白河堡水库水源地</a></td>	<td >北京市</td>	<td >水库</td>	<td >顺义区</td>	 
					<td >350</td>   <td >顺义区水务局</td>	<td >97</td>	<td >未开展</td>  
				</tr>
				<tr>
					<td ><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">白河堡水库水源地</a></td>	<td >北京市</td>	<td >水库</td>	<td >顺义区</td>	 
					<td >350</td>   <td >顺义区水务局</td>	<td >97</td>	<td >未开展</td>  
				</tr>
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
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/drinkProtect/keyWaterSourceDetail/keyWaterSourceDetail.js"></script>

</html>
