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
    <link type="text/css" href="<%=basePath %>common/js/layui/seasonSel/css/layui.css" rel="stylesheet" />
	<script type="text/javascript" src="<%=basePath %>common/js/layui/seasonSel/layui.js"></script>
	
	
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
			width: 19%;
		    height: 100%;
		    float: left;
		    border: 1px solid #efefef;
		    text-align: center;
		    line-height: 100px;
		    }
		.imgdiv>img{width:40px;height:40px;}
	.infotext{    
		    display: inline-block;
		    margin-left: 10px;
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

      .choose {
	    position: relative;
/* 	    margin-left: 33; */
    	}
 
.choose .radio {
    position: relative;
    display: inline-block;
    font-weight: 400;
    color: black;
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


	a {
	text-decoration: underline;
    color: blue;
	}
	
	.layui-layer-title{
    background-color: #0161D0;
    color:#ffffff;
}
       </style>

  </head>
  
  <body>
   <div class="searchDiv">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
    &nbsp;&nbsp;
    <div class="scQuery_div" >
<!--        	年份：<input id='nianFen' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/> -->
		时间：<input id="seasonId" type="text" style="width:110;border-radius: 5px;"  data-type="date" autocomplete="off">
    </div>
    
    &nbsp;
    			<div id="app" style="display: inline;">				
			    	<input type="button" value="埋藏条件"  style="background-color: #d0e6ff;color: black;font-weight: bold;font-size: 15;">			    		
				</div>
				
				<div class="choose"  style="display: inline;">
					<label class="radio">浅水层<input type="radio" style="width: 20;height: 10;" name="radio" value="1" checked><i></i></label>
					<label class="radio">深水层<input type="radio" style="width: 20;height: 10;" value="2" name="radio"><i></i></label>
				</div>
    &nbsp;
    <div class="scQuery_div"  style="width: 170;margin-left: 20;">
      	行政区: 
	      	<select id="provinceSel"   >
				<option value="" selected="selected">全部</option>
				<option value="14">山西省</option>
				<option value="13">河北省</option>
				<option value="37">山东省</option>
				<option value="21">辽宁省</option>
				<option value="11">北京市</option>
				<option value="41">河南省</option>
				<option value="15">内蒙古自治区</option>
				<option value="12">天津市</option>
				
			</select>
    </div>
    <div class="scQuery_div"  style="width: 170;">
      	  	<select id="citySel"   >
	      		<option value="" selected="selected">全部</option>				
			</select>
    </div>

    <input type="button" value="查询" class="query_input" onclick="search()">
    
        <input type="button" value="打印" class="query_input"  onclick="printpage()">
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->    
</div>



<center class="conent" style="overflow:visible;padding-bottom:10px;height:100%">
    <div class="titleDiv" style="width:90%;height:100px;border: 0px;margin-top:10px">
	    <div class="titleItemDiv" style="">
	    	<div class="imgdiv"><img src="images/savewater/allicon.png"></div>
	    	<div id="all" class="infonum"  ></div>个
	    	<div class="infotext" >超采区城市数</div>
	    </div>
	     <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/targeticon.png"></div>
	     	<div id="up" class="infonum" ></div>个
	    	<div class="infotext" >上升区</div>
	    </div>
	     <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/watericon.png"></div>
	     	<div id="stable" class="infonum" ></div>个
	    	<div class="infotext" >稳定区</div>
	    </div>
	    <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/moneyicon.png"></div>
<!-- 	     	<div class="infonum" id="totalDBnum">111</div>个 -->
<!-- 	    	<div class="infotext" id="totalDBrate" >相对下降区</div> -->
			<div id="down" class="infonum"  ></div>个
	    	<div class="infotext"  >相对下降区</div>
	    </div>
	    <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/moneyicon.png"></div>
	     	<div id="downPlus" class="infonum"  ></div>个
	    	<div class="infotext"   >严重下降区</div>
	    </div>
	    
    </div>
 
   	<div >
   		   <span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 35%;padding: 15;">全国地下水超采区（海河流域）市（地）水位变化情况统计表</span>
   		   		
	  </div>
	<div id="dydiv">
	    <table id="dytable" class="bbTable" style="margin-top:20px;width:97%" >
	        <thead>
	        <tr>
	            <td >名次</td>
	            <td rowspan="2" style="width:10%;">市（地）</td>
	            <td rowspan="2">省（直辖市）</td>
	            <td rowspan="2" style="width:10%;">水位同比变幅(m)</td>
	            <td rowspan="2">变幅类型</td>
	           
	        </tr>
	        </thead>
	        <tbody id="TableData">		       		 
	       		 <tr>
		            <td ></td>
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
		            <td ></td>	           
	       		 </tr>
	       		 <tr>
		            <td ></td>
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
		            <td ></td>	           
	       		 </tr>
	       		 <tr>
		            <td ></td>
		            <td ></td>
		            <td ></td>
		            <td ></td>
		            <td ></td>	           
	       		 </tr>
	       		
	        </tbody>
	    </table>    
    </div>
    <div class="pageDiv" style="margin-top:5px;"><span class="tolSpan"></span><div class="M-box"></div></div>
    


</center>

  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/groundWater/waterNotify/waterNotifyDetail/waterNotifyDetail.js"></script>

</html>
