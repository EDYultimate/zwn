<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>突发水污染案例</title>
    
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>common/js/elementUI/index.css" type="text/css">
    
    
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/excel/excel-gen.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/FileSaver.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/jszip.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/elementUI/vue.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/elementUI/index.js"></script>
    
<script type="text/javascript">

	
// 	$(document).ready(function(){
// 		$.fn.zTree.init($("#treeDemo"), setting, zNodes);
// 	});
	var basePath = '<%=basePath%>';
  	<%-- $(function(){
  		var getBodyH=document.body.clientHeight;//得到body高
  		var getBodyW=document.body.clientWidth;//得到body宽




  		$("#rel_div").css("top", $(document).scrollTop()+200 );
  		$("#tbFrame").css("left",getBodyW);
  			//$("#tbFrame").animate({width: 'toggle'},350);
  			$("#rel_div").click(function(){
  		$("#modleIframe").attr("src","<%=basePath%>pages/kfly/jsl/ylxx/ylxx.jsp");
  			//$("#tbFrame").animate({width: 'toggle'},350);
  			if($("#togg").val()=="1"){
  				$("#rel_div").html("&nbsp;<br/>关<br/>&nbsp;<br/>闭");
  				$("#togg").val("0");
  				$("#tbFrame").css("left",0);
  			}else{
  				$("#rel_div").html("实<br/>时<br/>信<br/>息");
  				$("#togg").val("1");
  				$("#tbFrame").css("left",getBodyW);
  			}
  			changeParentTag();
  		});
  	});
  	
  	function changeParentTag() {
  	  	// 控制父页面标签
	  	parent.changeTag($("#togg").val());
  	} --%>
  
	
	
  	</script>
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
	width: 170;
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

.el-autocomplete {
       width: 170;
       }
       
       .el-input__inner {  
  		  border-radius: 15px;
   		 height: 30px;   
	}
       
       </style>

  </head>
  
  <body style="overflow: auto;">
   <div class="searchDiv" style="margin-top: 60;">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
   
    &nbsp;
    <div class="scQuery_div"  style="width:250;">
      	文件类型: 
	      	<select id="FILE_TP"   >
	      		<option value="">全部</option>				
				<option value="1">工作规程</option>
				<option value="2">应急预案</option>
				<option value="3">事件报告</option>
				<option value="4">总结报告</option>			
			</select>
    </div>
   &nbsp;
      <div class="scQuery_div"  style="width: 200;">
      	关键字:<input id="NM" style="width: 120;" placeholder="文件名称"  >
      </div>

    <input type="button" value="查询" class="query_input" onclick="search()">
        <input type="button" value="添加" class="query_input" onclick="newAdd()">
     
        <input type="button" value="打印" class="query_input" style="margin-right: 20;float: right;" onclick="printpage()">
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>



<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%">
   
	<div id="dydiv">
	    <table id="dytable" class="bbTable" style="margin-top:20px;width:97%" >
	        <thead>
	        <tr>
	            <td rowspan="2" style="width:10%;">序号</td>
	            <td rowspan="2">文件名称</td>
	            <td rowspan="2">文件类型</td>
	            <td rowspan="2" style="width:10%;">时间</td>
	            <td rowspan="2">操作</td>
	            
	        </tr>
	        </thead>
	        <tbody id="TableData">	
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>        
	       		 </tr>
	       		 <tr>
		           <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>          
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>            
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>             
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>              
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>              
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>             
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>              
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>             
	       		 </tr>
	       		 <tr>
		            <td >1</td>
		            <td >漳河上游苯胺污染事件</td>
		            <td >漳河</td>
		            <td style='width:20%;' > 		           	
		           	</td>  
		           <td style='width:20%;' > 		           	
		           	</td>               
	       		 </tr>
	        </tbody>
	    </table>    
    </div>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
    


</center>

<script type="text/javascript">

    </script>


  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/suddenlyWaterPollution/solveFileDetail/solveFileDetail.js"></script>

</html>
