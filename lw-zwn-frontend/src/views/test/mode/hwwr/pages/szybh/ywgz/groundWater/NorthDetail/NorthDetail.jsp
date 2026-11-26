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
			width: 24%;
		    height: 100%;
		    float: left;
		    border: 1px solid #efefef;
		    text-align: center;
		    line-height: 100px;
		    }
		.imgdiv>img{width:40px;height:40px;}
	.infotext{    
		    display: inline-block;
		    margin-left: 30px;
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
       </style>

  </head>
  
  <body style="overflow: auto;">
   <div class="searchDiv">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
    &nbsp;&nbsp;
    <div class="scQuery_div" >
       	年份：<input id='beginTm' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
       		-<input id='endTm' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
    </div>
    
   &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	河湖名称: 
	      	<select id="heHuMingCheng"   >
	      		<option value="">全部</option>
				
				<option value="1">滹沱河</option>
				<option value="2">滏阳河</option>
				<option value="3">南拒马河</option>
				<option value="111">永定河</option>
				<option value="5">七里河-顺水河</option>
				<option value="7">唐河</option>
				<option value="8">沙河-潴龙河</option>
				<option value="9">北拒马河-白沟河</option>
				<option value="10">瀑河</option>
				<option value="11">泜河</option>
				<option value="12">南运河</option>
				<option value="13">七里海</option>
				<option value="14">大黄堡洼</option>
				<option value="10">北大港</option>
				<option value="11">团泊洼</option>
				<option value="12">白洋淀</option>
				<option value="13">衡水湖</option>
				<option value="14">南大港</option>
				<option value="14">漳河</option>
				<option value="14">卫河</option>
				<option value="14">潮白河</option>
				<option value="14">北运河</option>
				
			</select>
    </div>
&nbsp;
<!--       <div class="scQuery_div"  style="width: 200;"> -->
<!--       	断面名称:<input id="duanMianMingCheng" style="width: 120;" placeholder="名称"  > -->
<!--       </div> -->

    <input type="button" value="查询" class="query_input" onclick="search()">
    
        <input type="button" value="打印" class="query_input"  onclick="printpage()">
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>



<center class="conent" style="padding-bottom:10px;height:100%;overflow-y: visible;">
    <div class="titleDiv" style="width:90%;height:100px;border: 0px;margin-top:10px">
	    <div class="titleItemDiv" style="">
	    	<div class="imgdiv"><img src="images/savewater/allicon.png"></div>
	    	<div class="infonum" >22</div>处
	    	<div class="infotext" >补水河道总数</div>
	    </div>
	     <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/targeticon.png"></div>
	     	<div class="infonum" id="HEJIsum" >26</div>亿m³
	    	<div class="infotext" >生态补水总量</div>
	    </div>
	     <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/watericon.png"></div>
	     	<div class="infonum" id=NIANDUJIHUAsum>18</div>亿m³
	    	<div class="infotext" >计划补水总量</div>
	    </div>
	    <div class="titleItemDiv">
	     	<div class="imgdiv"><img src="images/savewater/moneyicon.png"></div>
	     	<div class="infonum" id="donePercentSum">111</div>%
	    	<div class="infotext"  >补水完成率</div>
	    </div>
	    
    </div>
   <div >
	   		 <span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 45%; margin-top: 10;">河湖生态补水汇总统计</span>
	  </div>

	<div id="dydiv" style="padding-bottom: 10;">
	
    <table id="dytable" class="bbTable" style="width:97%; margin-top:50;" >
        <thead>
        <tr>
            <td style="width:30;">序号</td>
            <td rowspan="2" style="width:10%;">河湖名称</td>
            <td rowspan="2" style="width:10%;">南水北调中线</td>
            <td rowspan="2" style="width:10%;">南水北调东线</td>
            <td rowspan="2">引黄</td>
            <td rowspan="2">引滦</td>
            <td rowspan="2">上游水库</td>
            <td style="width:120">再生水及其他水源</td>
            <td rowspan="2">合计</td>
            <td rowspan="2">年度计划</td>
            <td  style="width:80">完成率(%)</td>            
        </tr>
        </thead>
        <tbody id="TableData">
<!-- 			<tr> -->
<!-- 				<td >1</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">滹沱河</a></td><td>3.00</td><td> </td><td> </td><td> </td><td>0.72</td> -->
<!-- 				<td >0.73</td><td>4.44</td><td>3.19</td><td>139</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >2</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">滏阳河</a></td><td>2.14</td><td>0.01</td><td> </td><td>0.93</td><td></td> -->
<!-- 				<td >0.73</td><td>3.07</td><td>3.06</td><td>101</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >3</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">南拒马河</a></td><td>0.59</td><td> </td><td> </td><td>0.29</td><td></td> -->
<!-- 				<td > </td><td>0.88</td><td>0.42</td><td>139</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >4</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">永定河</a></td><td> </td><td>0.48</td><td> </td><td>2.58</td><td></td> -->
<!-- 				<td></td><td >3.07</td><td>2.68</td><td>114</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >5</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">唐河</a></td><td>3.71 </td><td> </td><td> </td><td>0.98</td><td></td> -->
<!-- 				<td></td><td>4.7</td><td >0.98</td><td>479</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >6</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">北拒马河-白沟河</a></td><td>0.39</td><td> </td><td> </td><td></td><td></td> -->
<!-- 				<td></td><td>0.39</td><td >0.33</td><td>117</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >7</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">北拒马河-白沟河</a></td><td>0.39</td><td> </td><td> </td><td></td><td></td> -->
<!-- 				<td></td><td>0.39</td><td >0.33</td><td>117</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >8</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">北拒马河-白沟河</a></td><td>0.39</td><td> </td><td> </td><td></td><td></td> -->
<!-- 				<td></td><td>0.39</td><td >0.33</td><td>117</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >9</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">北拒马河-白沟河</a></td><td>0.39</td><td> </td><td> </td><td></td><td></td> -->
<!-- 				<td></td><td>0.39</td><td >0.33</td><td>117</td>   -->
<!-- 			</tr> -->
<!-- 			<tr> -->
<!-- 				<td >10</td><td><a href='javascript:void(0)' onclick="divClick('永定河','00000001','1')">北拒马河-白沟河</a></td><td>0.39</td><td> </td><td> </td><td></td><td></td> -->
<!-- 				<td></td><td>0.39</td><td >0.33</td><td>117</td>   -->
<!-- 			</tr> -->
        </tbody>
    </table>
    
    </div>
<!--     <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div> -->
    


</center>
  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/groundWater/NorthDetail/NorthDetail.js"></script>

</html>
