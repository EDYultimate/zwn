<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>地表水水质状况</title>
    
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/excel/excel-gen.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/FileSaver.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/jszip.js"></script>
<!--         <script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script> -->
        
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
	
	.date{
	float: right;
    color: #2f6b98;
    font-size: 14px;
	}
	
	ul {
	    margin-left: 25;
	}
	ul li{
	    line-height: 24px;
    padding: 6px 0;
    margin-bottom: 0;
	}
	ul li a{
/* 	  	background-image: url('<%=basePath %>/images/savewater/waterEnvQualityDian.png'); */
    	padding-left: 22px;
    	font-size: 15px;
    	background-repeat: no-repeat;
    	color: #333333;
    	float: left;
        width: 85%;
	}
	.miaob{
		    border-bottom: 1px dashed #5083a9;
   	 margin-bottom: 15px;
    	padding-bottom: 30px;
    	height:3px;
	}
	</style>

  </head>
  
  <body style="background-color: #fbfbfb;">

	<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%;background-color: #fbfbfb;">
<!-- 		<div   style="width:100%;height:98%;padding: 0;margin: 0;">    	 -->
<!--     		<iframe   style="z-index:1;width:100%;height:100%;border: 0px;"  -->
<!--     			src="http://www.mee.gov.cn/hjzl/shj/dbsszyb/" ></iframe> 	 -->
<!--     	</div> -->

<!-- 	  	 <div name="left" id="two" style="height:770;width:90%;margin-left:40;text-align: left;margin-top: 50;     -->
<!-- 	  	 box-shadow: 0px 0px 13px #e3e3e3;"> -->
<!-- 	  	   	<div style="height:35;    border-bottom: 1px solid #cccccc;"> -->
<!-- 				<h2 style="color: #2f6b98;border-bottom: 2px solid #2f6b98;font-size: 20px;width: 140;height: 35;">地表水水质月报</h2> -->
<!-- 	  		</div>	   -->
	  		
	  		<div  style="margin-top: 3;">
	  		
				<div style="width:994;height:770;overflow:hidden;"> 
			         <div style="width:1100;height:1300;margin:-300px 0px 0px -57px;">
			              <iFrame src="http://www.mee.gov.cn/hjzl/shj/dbsszyb/" scrolling="no" style="border: none;width=1000;height=1100">
			             </iFrame>
			         </div> 
			     </div> 
	  		
	  		
	  		
<!-- 	  			<ul> -->
<!-- 	  				<li> -->
<!-- 	  					<span class="date">2021-07-20</span> -->
<!-- 	  					<a href="http://www.mee.gov.cn/hjzl/shj/dbsszyb//202107/P020210720594151587891.pdf" target="_blank" title="">2021年6月全国地表水水质月报</a> -->
<!-- 	  				</li> -->
<!-- 	  				<li><span class="date">2021-06-23</span><a href="./202106/P020210623366897063113.pdf" target="_blank" title="">2021年5月全国地表水水质月报</a></li> -->
<!-- 	  				<li><span class="date">2021-05-20</span><a href="./202105/P020210526570746835309.pdf" target="_blank" title="">2021年4月全国地表水水质月报</a></li> -->
<!-- 	  				<li><span class="date">2021-04-23</span><a href="./202104/P020210423328551405793.pdf" target="_blank" title="">2021年3月全国地表水水质月报</a></li> -->
<!-- 	  				<li ><span class="date">2021-03-26</span><a href="./202103/P020210326394073578783.pdf" target="_blank" title="">2021年2月全国地表水水质月报</a></li> -->
<!-- 	  			</ul> -->
<!-- 	  			<div class="miaob"></div> -->
<!-- 	  			<ul> -->
<!-- 	  				<li><span class="date">2021-03-10</span><a href="./202103/P020210310649895172051.pdf" target="_blank" title="">2021年1月全国地表水水质月报</a></li> -->
<!-- 	  				<li><span class="date">2021-01-18</span><a href="./202101/P020210119344965579739.pdf" target="_blank" title="">2020年12月全国地表水水质月报</a></li> -->
<!-- 	  				<li><span class="date">2020-12-21</span><a href="./202012/P020201221564700206017.pdf" target="_blank" title="">2020年11月全国地表水水质月报</a></li> -->
<!-- 	  				<li><span class="date">2020-11-19</span><a href="./202011/P020201119589491748042.pdf" target="_blank" title="">2020年10月全国地表水水质月报</a></li> -->
<!-- 	  				<li ><span class="date">2020-10-22</span><a href="./202010/P020201022529759104334.pdf" target="_blank" title="">2020年9月全国地表水水质月报</a></li> -->
<!-- 	  			</ul> -->
<!-- 	  			    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div> -->
	  			
	  		</div>			

	
    
    


	</center>
  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>

<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/waterEnvQuality/aboveWaterQualityStatus/aboveWaterQualityStatus.js"></script>

</html>
