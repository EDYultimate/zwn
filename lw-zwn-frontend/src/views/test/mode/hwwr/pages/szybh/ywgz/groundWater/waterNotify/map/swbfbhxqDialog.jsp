<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String AD_CD = request.getParameter("AD_CD");
// String st_tp = request.getParameter("st_tp");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>地下水位变幅变化详情</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<style type="text/css">
		.searchDiv {
		    font-size: 10px;
		    padding: 8px;
		    background-color: white;
		}
		.s_input {
			background-image: none;
			text-align: center;
		}


		
			
		thead th {
   			 font-size: 14px;
    		font-weight: bold;
    		color: #3067ca;
    		background-color: #f0f0f0;
			}
			tbody td {
   			 font-size: 14px;
/*     		font-weight: bold; */
/*     		color: #3067ca; */
    		background-color: white;
    		    color: #3067ca;
    /* text-align: center; */
   			 vertical-align: middle;
			}
			
			.choose {
	    position: relative;
	    margin-left: 10;
    	}
 
.choose .radio {
    position: relative;
    display: inline-block;
    font-weight: 400;
    color: #0c4757;
    padding-left: 25px;
    cursor: pointer;
}
 
.choose .radio input {
    position: absolute;
    left: -9999px;
} 
.choose .radio i {
    display: block;
    position: absolute;
    top: 3px;
    left: 0;
    width: 12;
    height: 12;
    outline: 0;
    border: 1px solid #D0D0D0;
    background: #FAFAFA;
    border-radius: 50%;
    transition: border-color .3s;
    -webkit-transition: border-color .3s;
}
 
.choose .radio input + i:after {
    position: absolute;
    content: '';
    top: 3px;
    left: 3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #ff8a00;
    opacity: 0;
    transition: opacity .1s;
    -webkit-transition: opacity .1s;
}
 
.choose .radio input:checked + i:after {
    opacity: 1;
    background-color: #ff8a00;    
}
.choose .radio input:checked +i {   
    border: 1px solid #ff8a00;
    border-radius: 50%;   
}     
.layui-laydate-footer span:first-child.layui-laydate-preview {
	display: none;
}

	</style>
	
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<link type="text/css" href="<%=basePath %>common/js/layui/seasonSel/css/layui.css" rel="stylesheet" />
	<script type="text/javascript" src="<%=basePath %>common/js/layui/seasonSel/layui.js"></script>

	<script>
		var basePath = '<%=basePath%>';
		var AD_CD = '<%=AD_CD%>';
	</script>
  </head>
  
  <body>
      <input type="hidden" id="sameCompareTogg" value="1"></input>
  
  	<div id="content_chart">
	  	<div class="searchDiv">
	  			<div id="app" style="display: inline;">				
			    	<input type="button" value="埋藏条件"  style="background-color: #d0e6ff;color: black;font-weight: bold;font-size: 15;">			    		
				</div>
	  	
				     <div class="choose"  style="display: inline;">
						 <label class="radio">浅水层<input type="radio" style="width: 20;height: 10;" name="radio" value="1" checked><i></i></label>
						 <label class="radio">深水层<input type="radio" style="width: 20;height: 10;" value="2" name="radio"><i></i></label>
					 </div>
	  	
	  		<div style="width:450px;display: inline-block;margin-left: 10;">
<!--        			<input id='nianFen' style="height: 30;border-radius:18px;border-color:#cccccc;background-color:#fafafa;font-size:15;" type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})"/>       			 -->
					时间: <input id="seasonBeginInput" type="text" style="width:90;border-radius: 5px;"  data-type="date" autocomplete="off">
	  		 	<span>-</span>
					 <input id="seasonEndInput" type="text" style="width:90;border-radius: 5px;"  data-type="date" autocomplete="off">
					&nbsp;
       			<input type="button" value="查询" class="s_input" onclick="init()" style="background-color: #3CCEB1;border: 1px solid #3CCEB1;vertical-align: middle;">
   			</div>




	  	</div>

	  	<div id="mainDiv" style="width:1050px;">
		    <div id="leftDiv" style="width:250;max-height:300px;
		    				margin-top: 30; margin-left: 10;float: left;">
		    	
		    	<div style="overflow-y:auto;">
		    		<table class="bbTable">
					<thead>
						<tr>
							<th>时间</th>
							<th>水位变幅</th>																
						</tr>
					</thead>
					<tbody id="tbody">
<!-- 						<tr> -->
<!-- 							<td>2021年一季度</td> -->
<!-- 							<td>0.18</td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td>2021年二季度</td> -->
<!-- 							<td>0.31</td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td>2021年三季度</td> -->
<!-- 							<td>0.61</td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td>2021年四季度</td> -->
<!-- 							<td>0.51</td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td></td> -->
<!-- 							<td></td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td></td> -->
<!-- 							<td></td> -->
							
<!-- 						</tr> -->
<!-- 						<tr> -->
<!-- 							<td></td> -->
<!-- 							<td></td> -->
							
<!-- 						</tr> -->
					</tbody>
				</table>
		    	</div>
		    	
		    	

		    </div>	  		
	  		<div id="rightDiv" style="margin-top: 30;height:300;width: 750;    display: inline-block;"></div>
	  	</div>
  	</div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<!--   <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script> -->
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
  <script src="<%=basePath%>pages/szybh/ywgz/groundWater/waterNotify/map/swbfbhxqDialog.js" type="text/javascript"></script>
<!--           <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script> -->
             <script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script> 
          
  
</html>
