<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
<head>
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/viewer/viewer.min.css" type="text/css">
<%--    <link rel="stylesheet" href="../jsxw.css" type="text/css">--%>

    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery.SuperSlide.2.1.3.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/viewer/viewer.min.js"></script>
    <base href="<%=basePath%>">

    <script>var basePath = '<%=basePath%>';</script>
    
    <title>Title</title>

    <style>

        .title{
/*             margin-left: 10px; */
            height:40px;
            line-height:35px;
            font-weight:bold;
            background-color: #F0F0F0;
        }
        .line{
            border: 0.5px solid gray;
        }

        /*通知公告样式 */
        
        
        .bbTable {
            border:0px;
/*                  table-layout: fixed; */
            
        }
		.bbTable > thead > tr > td, th {
		background-color: #F3F8FF;
            border-right: 1px  white;
            color: #307CD1;
		}
        .bbTable>tbody>tr>td, th {
		    border: 0;
		    width:180px;
		             
        }
        a {
            text-decoration: none;
            color: black;
            width: 520;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            float: left;

        }
        a:hover{
            text-decoration:underline;
            color: blue;
        }

        .more {
            height:35px;
            line-height:35px;
        }

        .more:hover{
            height:35px;
            line-height:35px;
            cursor:pointer;
        }

        /* 轮播 */
        .picScroll-left  {
            overflow: hidden;
            position: relative;
        }
/*         img{ */
/*             width:325px; */
/*             height:200px; */
           border:1px solid #ccc;
/*         } */
        .tempWrap > ul > li{
            list-style:none;
            margin: 20px 5px;
            width:325px;
            float: left;
        }
        .pictitle{
            height:35px;
            line-height:35px;
            text-align:center;
        }
        .titleItemDiv{    
			width: 200;
		    height: 40;
		    float: left;
		    border: 1px solid white;
/* 		    text-align: center; */
/* 		    line-height: 100px; */
			margin-bottom: 10;
			border-radius: 5px;
			
		 }
		  .titleItemDiv2{    
			width: 200;
		    height: 40;
/* 		    float: left; */
		    border: 1px solid white;
/* 		    text-align: center; */
/* 		    line-height: 100px; */
			margin-bottom: 10;
			border-radius: 5px;
/* 			margin-top: 50; */
			
		 }
		    	.infonum{
/* 		    	font-size:26px; */
		    	display: inline-block;
		line-height: 230%;
		height: 100%;
		width: 40;
/* 		    background-color: #3A92FB; */
		    text-align: center;
		    color: white;
		    	}
		    	.infotext{    
		    display: inline-block;
		    margin-left: 8px;
		    font-size: 15px;
		    }
/* 		    table{ */
/*      width: 60px; */
/*      table-layout: fixed; */
/* } */

/* table tr td:nth-child(1){ */
/* 	max-width: 80px; */
/* } */
    </style>
</head>
<body style="overflow: auto;width: 1450;">
<div  style="width:98%;min-width:1000px;margin-top:10px;margin-left:10px;background-color: #fff">
<!-- <img  style="" src="images/savewater/sy_title_bg.png">  -->
    <div  id="top"  style="height:230px;">
        <div  style="height:230px;float:left;width:700;">
            <div class="title"  style="background-image: url(images/savewater/sy_title_bg.png);background-size:cover">
            	<span style="font-size:16;margin-left:20;color: #ffffff;">水利部通知</span>
                 <div class="more"  style="float:right;margin-right:20px;"  onclick="morePage('d')">更多>> </div> 
            	
            </div>
            <div  class="newscontent"   style="margin-top:10px;">
                <table class="bbTable">
                    <tbody id="slb_news">
                    </tbody>
                </table>
            </div>
        </div>
       
        <div  style="height:230px;float:right;width:700;">
           
            <div class="title"  style="background-image: url(images/savewater/sy_title_bg.png);background-size:cover">
            	<span style="font-size:16;margin-left:20;color: #ffffff;">海委动态</span>
                 <div class="more"  style="float:right;margin-right:20px;"  onclick="morePage2('a','http://www.hwcc.gov.cn/wwgj/n')">更多>> </div>             	
            </div>
            
            <div  class="newscontent" style="margin-top:10px;">
                <table class="bbTable">
                    <tbody id="hw_news">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div  id="middle"   style="height:390px; margin-top:30px;">
          <div  style="height:390px;float:left;width:700"> 
            <div class="title"  style="background-image: url(images/savewater/sy_title_bg.png);background-size:cover">
             	<span style="font-size:16;margin-left:20;color: #ffffff;">生态流量</span>
          	</div>
          	
          	 <div name="aaa" sytle="">
          	 	<div name="bbb" sytle="width:100;height:200">
          	 	<div class="titleItemDiv" style="margin-top: 20;margin-left:5;border-color: #8FC1FD;width: 210;">
			    	<div class="infonum" style="background-color: #3A92FB;"><span style="font-size:18;font-weight: bold;">23</span>个</div>
			    	<div class="infotext" >部印发河湖总数</div>
			    </div>
			     <div class="titleItemDiv" style="margin-top: 20;margin-left: 35;border-color: #09C8B6;">
			     	<div class="infonum" style="background-color: #09C8B6;" ><span style="font-size:18;font-weight: bold;">31</span>个</div>
			    	<div class="infotext" >考核断面总数</div>
			    </div>
			    
			     <div class="titleItemDiv" style="margin-top: 20;margin-left: 35;border-color: #E57F7F;">
			     	<div class="infonum" style="background-color: #E57F7F;" ><span  id="totalWDB" style="font-size:18;font-weight: bold;">0</span>个</div>
			    	<div class="infotext" >今年不达标断面数</div>
			    </div>

			    </div>
          	 </div>         
            <div  class="newscontent"   style="margin-top:10px;height: 260;">
                <table id="dytable" class="bbTable" style="margin-top:20px;width:98%;margin-left: 5;height: 100%;" >
			        <thead>
			        <tr>
			            <td style="width:100">印发单位</td>
			            <td >河湖个数</td>
			            <td >考核断面</td>
			            <td  >今年不达标的断面数</td>
			            
			        </tr>
			        </thead>
			        <tbody id="TableData">	
<!-- 				        <tr> -->
<!-- 				        	<td >水利部</td> -->
<!-- 				        	<td >4</td> -->
<!-- 				        	<td >6</td> -->
<!-- 				        	<td >4</td> -->
<!-- 				        </tr> -->
<!-- 				         <tr> -->
<!-- 			        	<td >北京市</td> -->
<!-- 			        	<td >4</td> -->
<!-- 			        	<td >6</td> -->
<!-- 			        	<td >3</td> -->
<!-- 			        </tr> -->
<!-- 			         <tr> -->
<!-- 			        	<td >天津市</td> -->
<!-- 			        	<td >3</td> -->
<!-- 			        	<td >3</td> -->
<!-- 			        	<td >0</td> -->
<!-- 			        </tr> -->
<!-- 			         <tr> -->
<!-- 			        	<td >河北省</td> -->
<!-- 			        	<td >3</td> -->
<!-- 			        	<td >4</td> -->
<!-- 			        	<td >3</td> -->
<!-- 			        </tr> -->
<!-- 			         <tr> -->
<!-- 			        	<td >山西省</td> -->
<!-- 			        	<td >5</td> -->
<!-- 			        	<td >7</td> -->
<!-- 			        	<td >0</td> -->
<!-- 			        </tr> -->
			        </tbody>
			  </table> 
			        
            </div>
        </div>
        
           <div  style="height:390px; float:right;width:700;">
            <div class="title"  style="background-image: url(images/savewater/sy_title_bg.png);background-size:cover">
             	<span style="font-size:16;margin-left:20;color: #ffffff;">河湖补水</span>
          	</div>
           
           <div  sytle="">
              <div name="bbb" style="width:650;">           
          	 	<div class="titleItemDiv" style="width: 170;margin-top: 20;margin-left: 5;height: 20;">
			    	<div class="infotext" ><span style="color: gray;">•</span>&nbsp;补水河湖总数：<span style="font-weight:bold;">22</span>条</div>
			    </div>
			     <div class="titleItemDiv" style="width:255;margin-top: 20;margin-left: 5;height: 20;">
<!-- 			     	<div class="infonum" style="background-color: #09C8B6;" id="totalSectionCheckNum" >0个</div> -->
			    	<div class="infotext" ><span style="color: gray;">•</span>&nbsp;自基准年累计完成情况：<span style="font-weight:bold;">79.1</span>亿m³</div>

			    </div>
          	 	<div class="titleItemDiv" style="margin-top: 20;margin-left: 8;height: 20;">
			     	<div class="infonum" style="background-color:#0AC8B6;width: 80;height: 15;border-radius: 10px" id="totalSectionCheckNum" ></div>
			    	<div class="infotext" >395.5%</div>
			    </div>
			    </div>
          	 </div> 
			<div   style="color: gray;    padding-bottom: 10;margin-left: 10;" ><span style="font-weight:bold;color: #CCCCCC;font-size: 15;"><<<<<<<<<<<<<<<<<<<<<<<&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2021年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>>>>>>>>>>>>>>>>>>>></span></div>
            <div  class="newscontent"   style="margin-top:-20px;width: 725;">
 		<div style="width:360;height:170;display: inline;">
 		           <div  sytle="width:100;height:200">
 		
		 			 <div class="titleItemDiv" style="width:205;margin-top: 20; ">
					    	<div class="infotext" ><span style="color: gray;">•</span>&nbsp;年度完成情况：<span style="font-weight:bold;">18.83</span>亿m³</div>
		
					    </div>
		          	 	<div class="titleItemDiv" style="width:150;margin-top: 20;margin-left: 8;">
					     	<div class="infonum" style="background-color: #0AC8B6;width: 80;height: 15;border-radius: 10px" id="totalSectionCheckNum" ></div>
					    	<div class="infotext" >85.2%</div>
					    </div>
					    <br>
		 			      <div class="titleItemDiv2" style="width: 170; ">
					    	<div class="infotext" style="margin-top: -20;"><span style="color: gray;">•</span>&nbsp;6月补水量：<span style="font-weight:bold;">4.99</span>亿m³</div>
					    </div>
		  	  		  </div>	  
		  	  		  	  
		  	  		  	  
		  	  		<div style="width:115;height:170;display:inline-block;margin-left: 30;">
		  	  		   <div id="beiJing" style="height:160;width: 175;"></div>  	  	
		  	  			<span style="  font-weight:bold;color: black;font-size: 14;margin-left: 60	;">北京市</span>
		  	  		   	
		  	  		</div>
		  	  		<div style="width:115;height:170;display:inline-block;">
		  	  		   <div id="tianJin" style="height:160;width: 175;"></div>  	  	
		  	  			<span style="  font-weight:bold;color: black;font-size: 14;margin-left: 60	;">天津市</span>
		  	  		   	
		  	  		</div>
		  	  		<div style="width:115;height:170;display:inline-block;">
		  	  		   <div id="heBei" style="height:160;width: 175;"></div>  	  	
		  	  			<span style="  font-weight:bold;color: black;font-size: 14;margin-left: 60	;">河北省</span>
		  	  		   	
		  	  		</div>
		  	  		<div style="width:125;height:170;display:inline-block;margin-right: 10;">
		  	  		  	<div id="govAreaDiv" style="height:160;width: 175;"></div>  
		  	  		  	<span style="  font-weight:bold;color: black;font-size: 14;margin-left:60;">补水水源</span>		  	  		  		  		  	  		
		  	  		</div>
  	  	</div>

			</div>
        </div>
    </div>
    <div id="bottom"   style="background-color: #F5F5F5;height: 210;">
          <div class="title"  style="background-image: url(images/savewater/sy_title_bg2.png);background-size:cover">
          
          	<span style="font-size:16;margin-left:20;color: #ffffff;">地表水水质状况</span>
	      	       
	      	       <span style="font-size:16;margin-left:20;color: black; margin-left: 1100;">日期：</span>
	      	       <input id='time' type='text'  style="width: 80;" onClick="WdatePicker({el:$dp.$('time'),dateFmt: 'yyyyMM',onpicked:changeDate})" />

          </div>
          <div style="width:100%;width:98%;margin-left:10;background-color: white;margin-top: 20;height: 60%;">
          
          	<span id="mon_context" style="font-family: MicrosoftYaHei;color: #535353;font-size: 15;margin-left:60;">
          	
          
          
          </span>
<!--             <br> -->
<!--           <span style="  font-weight:bold;color: #5E5E5E;font-size: 15;margin-left:60;"> -->
<!--          		 海河流域主要经合总体为轻度污染，主要污染指标为化学需氧量、高猛酸盐指数、五日生化需氧量、氟化物和总磷。监测的235个断面中：I类水质断面占14.0%，II类站23.8%，III类占21.3%，IV类占24.3%，V类占13.2%，劣V类占3.4%。 -->
<!--           </span> -->
<!--           <br> -->
<!--            <br> -->
<!--           <span style="  font-weight:bold;color: #5E5E5E;font-size: 15;margin-left:60;"> -->
<!--           		与上月相比，水质有所好转，其中：I类水质断面比例上升1.6个百分点，III类上升5.9个百分点，III类下降4.8个百分点，IV类下降8.6个百分点，V类上升5.5个百分点，劣V类上升0.4个百分点。 -->
<!--           </span> -->
<!--            <br> -->
<!--             <br> -->
<!--            <span style="  font-weight:bold;color: #5E5E5E;font-size: 15;margin-left:60;"> -->
<!-- 			与去年同期相比，水质无明显变化，其中：I类水质断面比例上升7.0个百分点，II类下降2.3个百分点，III类上升0.9个百分点，IV类下降0.5个百分点，V类下降1.1个百分点，劣V类下降4.0个百分点。 -->
<!-- 			</span> -->
<!-- 			<br> -->
<!--             <br> -->
          </div>
    </div>

</div>

</body>

<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script src="<%=basePath %>pages/jyys_new/jsxw/newsView.js"></script>
<script src="<%=basePath %>pages/szybh/ywgz/sy/sy.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echartsSmooth.js"></script>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>


</html>
