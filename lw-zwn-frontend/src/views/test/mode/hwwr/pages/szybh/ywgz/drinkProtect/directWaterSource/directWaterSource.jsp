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
		margin: 60 0 0 40;
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
	overflow-y: hidden;
	}
       </style>

  </head>
  
  <body style="background-color: #fbfbfb;overflow: auto;">
	   <div class="scQuery_div" >
	       	年份：<input id='nianFen' type='text'  style="width: 80;border: 1px solid #cccccc;background-color: #f5f5f5;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
	       <input type="button" value="查询" class="query_input" onclick="init()">    	       	
	    </div>
	  



<center class="conent" style="padding-bottom:10px;height:100%;background-color: #fbfbfb;">

  	 <div name="left" id="two" style=" height:770;width:65%;display:inline-block;float: left;background-color: #FFFFFF;box-shadow: 0px 0px 13px #e3e3e3;    margin-left: 10;">
  	   	<div style="height:55;    width: 65%;float: left;">
  			<img  style="margin-top: 10;float: left;margin-left: 10;" src="images/savewater/reformPanJiaKou.png"> 
			<span  style="font-weight:bold;color:#343333;
			font-size: 18;font-family: STHeiti;margin-left:10;margin-top:20; float: left;">潘家口—大黑汀水库</span> 	
  		</div>
  		
  		 <div style="height:99%;width:99%;    margin-top: 60;">
  			<div name="left1" style="height:99%;width:30%;position: absolute;">
	  			<div name="top" style="height:90;width:110%;margin-top: 10;overflow: auto;">
	  				<div  style="height:40;width:100;float: left;">
	  					<img  style="margin-top: 10;float: left;    margin-left: 15;" src="images/savewater/directWaterSourceLoaction	.png"> 
						<span style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-left:10;margin-top:10;float:left;">潘家口</span> 
	  				</div>
	  				
	  				<div  style="height:80;width:140;float:left;border-right:1px dashed #F3F3F3;background-color: #fffccc;">
						<span style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">入库水量</span> 
						<span id="panSUM_W_INSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">-</span> 
						<span  style="font-weight:bold;color:#5C85EA;
						font-size:14;font-family:STHeiti;margin-top:10;">万m³</span>
	  				</div>
	  				<div  style="height:80;width:140;float:left;border-right:1px dashed #F3F3F3;">
						<span id="panWQGSpanNM" style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;"></span> 
						<span id="panWQGSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">-</span> 
						
	  				</div>
	  				<div  style="height:80;width:140;float:left;">
						<span style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">浮游植物</span> 
						<span id="panPlantSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">13</span> 
						<span  style="font-weight:bold;color:#5C85EA;
						font-size:14;font-family:STHeiti;margin-top:10;">种</span>
	  				</div>
	  			</div>
	  			
	  			<div name="middle" style="height:320;width:100%;overflow: auto;">
		  			<table id="panTable" class="bbTable" style="margin-top:20px;width:97%" >
				        <thead>
				        <tr>
				            <td rowspan="2" >月份</td>
				            <td rowspan="2">蓄水量</td>
				            <td rowspan="2" >入库水量</td>
				            <td rowspan="2">供水量</td>				            
				        </tr>
				        </thead>
		       		 	<tbody id="panTableData">	
		       		 		
		       		 		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>						            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>				           				            
				       		 </tr>
<!-- 				       		 <tr> -->
<!-- 					            <td ></td> -->
<!-- 					            <td ></td> -->
<!-- 					            <td ></td>	 -->
<!-- 					            <td ></td>				           				             -->
<!-- 				       		 </tr> -->
<!-- 				       		 <tr> -->
<!-- 					            <td ></td> -->
<!-- 					            <td ></td> -->
<!-- 					            <td ></td>	 -->
<!-- 					            <td ></td>					            			           				             -->
<!-- 				       		 </tr> -->
<!-- 				       		 <tr> -->
<!-- 					            <td >11月</td> -->
<!-- 					            <td ></td> -->
<!-- 					            <td ></td>	 -->
<!-- 					            <td ></td>			           				             -->
<!-- 				       		 </tr> -->
<!-- 				       		 <tr> -->
<!-- 					            <td >12月</td> -->
<!-- 					            <td ></td> -->
<!-- 					            <td ></td>	 -->
<!-- 					            <td ></td>				           				             -->
<!-- 				       		 </tr> -->
		        		</tbody>
		    		</table>
	  			</div>
	  			<div name="bottom" style="height:250;width:100%;">
	  				<div id="IntoRiverPanJiaKouDiv" style="height:240;width: 500;margin-left:10;float: left;"></div>	  				
	  			</div>	  				  			
  			</div>
  			
  			
  			<div name="left2" style="height:99%;width:30%;position: absolute;margin-left: 33%;">
  				<div name="top" style="height:90;width:110%;margin-top: 10;overflow: auto;">
	  				<div  style="height:40;width:100;float: left;">
	  					<img  style="margin-top: 10;float: left;    margin-left: 15;" src="images/savewater/directWaterSourceLoaction	.png"> 
						<span  style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-left:10;margin-top:10;float:left;">大黑汀</span> 
	  				</div>
	  				
	  				<div  style="height:80;width:140;float:left;border-right:1px dashed #F3F3F3;background-color: #fffccc;">
						<span  style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">入库水量</span> 
						<span id="daSUM_W_INSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">-</span> 
						<span  style="font-weight:bold;color:#5C85EA;
						font-size:14;font-family:STHeiti;margin-top:10;">万m³</span>
	  				</div>
	  				<div  style="height:80;width:140;float:left;border-right:1px dashed #F3F3F3;">
						<span id="daWQGSpanNM" style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">水质类别</span> 
						<span id="daWQGSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">-</span> 
						
	  				</div>
	  				<div  style="height:80;width:140;float:left;">
						<span style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">浮游植物</span> 
						<span id="daPlantSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">13</span> 
						<span  style="font-weight:bold;color:#5C85EA;
						font-size:14;font-family:STHeiti;margin-top:10;">种</span>
	  				</div>
	  			</div>
	  			
	  			<div name="middle" style="height:320;width:100%;overflow: auto;">
		  			<table id="daTable" class="bbTable" style="margin-top:20px;width:97%" >
				        <thead>
				        <tr>
				            <td rowspan="2">月份</td>
				            <td rowspan="2">蓄水量</td>
				            <td rowspan="2">入库水量</td>
				            <td rowspan="2">供水量</td>				            
				        </tr>
				        </thead>
		       		 	<tbody id="daTableData">			       		 		
		       		 		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>						            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>				           				            
				       		 </tr>
		        		</tbody>
		    		</table>
	  			</div>
	  			<div name="bottom" style="height:250;width:100%;">
	  				<div id="IntoRiverDaHeiDingDiv" style="height:240;width: 500;margin-left:10;float: left;"></div>
	  				
	  			</div>
  			</div>
  		</div>
  		
  	</div>

	<div name="right" id="one" style=" height:770;width:32%;display:inline-block;background-color: #FFFFFF;box-shadow: 0px 0px 13px #e3e3e3;">
		<div style="height:55;    width: 65%;    float: left;">
  			<img  style="margin-top: 10;float: left;    margin-left: 10;" src="images/savewater/reformYueCheng.png"> 
			<span id="sectionNMspan " style="font-weight:bold;color:#343333;
			font-size: 18;font-family: STHeiti;margin-left:10;margin-top:20;    float: left;">岳城水库</span> 	
  		</div>
   		<div name="top" style="height:90;width:110%;margin-top: 70;overflow: auto;">
	  				<div  style="height:40;width:100;float: left;">
	  					<img  style="margin-top: 10;float: left;    margin-left: 15;" src="images/savewater/directWaterSourceLoaction	.png"> 
						<span  style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-left:10;margin-top:10;float:left;">岳城</span> 
	  				</div>
	  				
	  				<div  style="height:80;width:140;float:left;border-right:1px dashed #F3F3F3;background-color: #fffccc;">
						<span   style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">入库水量</span> 
						<span id="yueSUM_W_INSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">-</span> 
						<span  style="font-weight:bold;color:#5C85EA;
						font-size:14;font-family:STHeiti;margin-top:10;">万m³</span>
	  				</div>
	  				<div  style="height:80;width:140;float:left;border-right:1px dashed #F3F3F3;">
						<span id="yueWQGSpanNM"  style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">水质类别</span> 
						<span id="yueWQGSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">-</span> 
						
	  				</div>
	  				<div  style="height:80;width:140;float:left;">
						<span  style="font-weight:bold;color:#343333;
							font-size:16;font-family:STHeiti;margin-top:10;display: block;">浮游植物</span> 
						<span id="yuePlantSpan" style="font-weight:bold;color:#5C85EA;
						font-size:22;font-family:STHeiti;margin-top:10;">13</span> 
						<span  style="font-weight:bold;color:#5C85EA;
						font-size:14;font-family:STHeiti;margin-top:10;">种</span>
	  				</div>
	  			</div>
	  			
	  			<div name="middle" style="height:320;width:100%;overflow:auto;">
		  			<table id="yueTable" class="bbTable" style="margin-top:20px;width:97%" >
				        <thead>
				        <tr>
				            <td rowspan="2" >月份</td>
				            <td rowspan="2">蓄水量</td>
				            <td rowspan="2" >入库水量</td>
				            <td rowspan="2">供水量</td>				            
				        </tr>
				        </thead>
		       		 	<tbody id="yueTableData">	
		       		 		<tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>						            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>					            			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>			           				            
				       		 </tr>
				       		 <tr>
					            <td ></td>
					            <td ></td>
					            <td ></td>	
					            <td ></td>				           				            
				       		 </tr>
		        		</tbody>
		    		</table>
	  			</div>
	  			<div name="bottom" style="height:250;width:100%;">
	  				<div id="IntoRiverYueChengDiv" style="height:240;width: 500;margin-left:15;"></div>	  				
	  			</div>
    </div>
    
    


</center>
  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script>

<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/drinkProtect/directWaterSource/directWaterSource.js"></script>

</html>
