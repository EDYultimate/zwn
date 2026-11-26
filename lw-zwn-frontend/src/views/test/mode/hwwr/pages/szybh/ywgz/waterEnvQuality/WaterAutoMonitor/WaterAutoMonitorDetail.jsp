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
   <div class="searchDiv" >

<!-- <div class="scQuery_div" > -->
<!--        	时间：<input id='beginTm' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyyMMdd'})"/>- -->
<!--        	<input id='endTm' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyyMMdd'})"/> -->
<!--     </div> -->
    &nbsp;
	    <div class="scQuery_div"  style="width: 170;">
	      	行政区: 
		      	<select id="addvcd">
					<option value="">全部</option>
					<option value="110000">北京市</option>
					<option value="120000">天津市</option>
					<option value="130000">河北省</option>
					<option value="140000">山西省</option>
					<option value="150000">内蒙古</option>
					<option value="370000">山东省</option>
					<option value="410000">河南省</option>				
				</select>
	    </div>
	    
	    &nbsp;
      <div class="scQuery_div"  style="width: 200;">
      	断面名称:<input id="duanMianMingCheng" style="width: 120;" placeholder="名称"  >
      </div>
	    
    	<input type="button" value="查询" class="query_input" onclick="search()">       
</div>



<center class="conent" style="overflow:auto;padding-bottom:10px;height:75%;margin-top: 0px;">
    
<!--    <div > -->
<!-- 	   		<span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 45%;padding: 15;">海河流域地下水水质状况统计</span> -->
	   		
<!-- 	  </div> -->
	  
	<div id="dydiv" >
	    <table id="dytable" class="bbTable" style="margin-top:10px;width:97%" >
	        <thead>
	        <tr>
	            <td rowspan="2" style="width:45;">省份</td>
<!-- 	            <td rowspan="2">流域</td> -->
	            <td rowspan="2" style="width:80;">断面名称</td>
	            <td rowspan="2" style="width:100;">监测时间</td>
	            <td rowspan="2">水质类别</td>
	            <td rowspan="2">水温(℃)</td>
	            <td rowspan="2">PH(无量纲)</td>
	            <td rowspan="2">溶解氧(mg/L)</td>
	            <td rowspan="2">电导率(μS/cm)</td>
	            <td rowspan="2">浊度(NTU)</td>
	            <td rowspan="2">高锰酸盐指数(mg/L)</td>
	            <td rowspan="2">氨氮(mg/L)</td>
	            <td rowspan="2">总磷(mg/L)</td>
	            <td rowspan="2">总氮(mg/L)</td>
	            <td rowspan="2">叶绿素α(mg/L)</td>
	            <td rowspan="2">藻密度(cells/L)</td>
	            <td rowspan="2">站点情况</td>
	            
	        </tr>
	        </thead>
	        <tbody id="TableData">	
<!-- 	        	<tr> -->
<!-- 		            <td >海河流域</td><td >天津市</td><td >黄白桥</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >III -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>  -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >天津市</td><td >海河大闸</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >IV -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.9</td> -->
<!-- 		            <td >7.96</td> -->
<!-- 		            <td >4.91</td> -->
<!-- 		            <td >4645.2</td> -->
<!-- 		            <td >53.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >天津市</td><td >北排水河防潮闸</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >IV -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >河北省</td><td >岗南水库</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >II -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >河北省</td><td >下槐镇</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >III -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >河北省</td><td >地都</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >II -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >河北省</td><td >下槐镇</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >III -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >河北省</td><td >平山桥</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >III -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
	       		 
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >山西省</td><td >韩武村</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >III -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
	       	
	       		
	       		 
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >山西省</td><td >堡子湾</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >III -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >海河流域</td><td >内蒙古自治区</td><td >磴口</td> -->
<!-- 		            <td >08-09 04:00</td>		            -->
<!-- 		            <td >III -->
<!-- 		            	<div style="width:40;height:30;">I</div> -->
<!-- 		            </td> -->
<!-- 		            <td >27.4</td> -->
<!-- 		            <td >8.14</td> -->
<!-- 		            <td >7.67</td> -->
<!-- 		            <td >923.8</td> -->
<!-- 		            <td >19.7</td> -->
<!-- 		            <td >4.59</td> -->
<!-- 		            <td >0.091</td> -->
<!-- 		            <td >0.059</td> -->
<!-- 		            <td >1.74</td> -->
<!-- 		            <td >*</td> -->
<!-- 		            <td >*</td>  -->
<!-- 		            <td >正常</td>   -->
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
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/waterEnvQuality/WaterAutoMonitor/WaterAutoMonitorDetail.js"></script>

</html>
