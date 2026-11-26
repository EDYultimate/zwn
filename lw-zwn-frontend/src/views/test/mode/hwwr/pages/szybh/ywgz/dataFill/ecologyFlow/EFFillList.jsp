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
<!--         <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-3.3.1.js"></script> -->
    
<!--         		<script type="text/javascript" src="<%=basePath%>common/js/jquery-form.js"></script> -->
    
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>

	<script type="text/javascript" src="<%=basePath%>common/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="<%=basePath%>common/js/jquery.multiselect.js"></script>
	
  	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.ui.widget.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.iframe-transport.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-process.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-validate.js'></script>
	
        
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
/*         tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;} */
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



.a-upload {
    position: relative;
/*     background: #fafafa; */
/*     overflow: hidden; */
    display: inline-table;
/*     padding: 0px 20px 0 20px;*/
    padding: 2px 0px 0 7px;

/*     border-radius: 15px; */
/*     border: 1px solid #E1E1E1; */
    /* background-color: rgba(2, 194, 153, 1); */
/*     background-color: #17BDB0; */
    outline: none;
    color: black;
    width: 70px;
    height: 22px;
    cursor: pointer;
    text-decoration: none;
}
.a-upload input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity = 0);
    width: 55;
}



.a-upload2 {
    position: relative;
    background: #fafafa;
    overflow: hidden;
    display: inline-table;
    padding: 0px 20px 0 20px;
    border-radius: 15px;
    border: 1px solid #E1E1E1;
    background-color: #2DB7F5;
    outline: none;
    color: white;
    width: 90px;
    height: 22px;
    cursor: pointer;
    text-decoration: none;
}
.a-upload2 input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity = 0);
}
       </style>

  </head>
  
  <body>
   <div class="searchDiv">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
    &nbsp;&nbsp;
    <div class="scQuery_div" >
       	年份：<input id='year' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
<!--      -<input id='yearEnd' type='text'  style="width: 80;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/> -->
    </div>
    &nbsp;
    <div class="scQuery_div"  style="width: 170;">
      	填报状态: 
	      	<select id="fillState">
				<option value="">全部</option>
				<option value="1">未填报</option>
				<option value="2">已填报</option>						
			</select>
    </div>


    <input type="button" value="查询" class="query_input" onclick="search()">    
    <div style="float: right;margin-top: 10;display: flex;">
    
<!--     <div style='display: inline-block;     -->
<!--    	  		background-color: #469DFF;    width: 74;height: 24;    padding: 0 0 0 0;'> -->
   	 <input type="button" value="下载模板" class="query_input"  onclick="downloadTemplateAll()">    	 
<!--    	 </div> -->
   	 
   	 
   	 <div style='display: inline-block;background-color: #469DFF;width: 74;height: 23; border-radius: 7px;border: 1px solid #7491D4; margin-left: 5;'>
  	 	<form  method='POST' id='fAll'  onchange="bbb2All()" enctype='multipart/form-data' action='szybh/ywgz/getSaveWaterDataFillEFImport'> 
   	 		<input type='file' id='iAll' name='file'/>	 
    	</form> 
   	 </div>

   	  
<!--    	 <div style='display: inline-block;     -->
<!--    	  		background-color: #469DFF;    width: 74;height: 23; border-radius: 7px;border: 1px solid #7491D4;    margin-left: 5;'> -->
<!--    	 	<form  method='POST' id='fAll'  onchange="bbb2All()"  -->
<!--    	  		enctype='multipart/form-data' action='szybh/ywgz/getSaveWaterDataFillGWImport'>    	 -->
   	  		 
<!--   	      <input type="file"  id='iAll' > -->
<!--       </form>  -->
<!--    	 </div>  -->
   	  



        
<!--             <input type="button" value="编辑" class="query_input"  onclick="">  -->
                <input type="button" style='margin-left: 5;' value="清空" class="query_input"  onclick="delInfoAll()"> 
    </div>
<!--         <input type="button" value="打印" class="query_input"  onclick="printpage()"> -->
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>



<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%">
    
   <div >
	   		　	   		<span style="font-weight:bold;color: black;font-size: 16; float: left;margin-left: 45%;padding: 15;">生态流量监测信息</span>
<!-- 	   		<input id='file2' onclick="upload1('file2','111')"  type='file' multiple></input> -->
	  </div>

	<div id="dydiv">
	    <table id="dytable" class="bbTable" style="margin-top:20px;width:97%" >
	        <thead>
	        <tr>
	            <td style="width:15%">断面名称</td>
	            <td  >填报状态</td>
	            <td  style="width:15%" >填报时间</td>
	            <td >填报人</td>
	            <td  style="width:35%">操作</td>
<!-- 	            <td style="width:10%">文档上传</td> -->
	           
	            
	            
	        </tr>
	        </thead>
	        <tbody id="TableData">	
	        	<tr>
					<td ></td>
					<td ></td>
					<td ></td>
					<td ></td>	
					<td ></td>
<!-- 					<td ></td>    -->
				</tr>
	        	<tr>
					<td ></td>
					<td ></td>
					<td ></td>
					<td ></td>	
					<td ></td>
<!-- 					<td ></td>    -->
				</tr>
				<tr>
					<td ></td>
					<td ></td>
					<td ></td>
					<td ></td>	
					<td ></td>
<!-- 					<td ></td>    -->
				</tr>
				<tr>
					<td ></td>
					<td ></td>
					<td ></td>
					<td ></td>	
					<td ></td>
<!-- 					<td ></td>    -->
				</tr>
				<tr>
					<td ></td>
					<td ></td>
					<td ></td>
					<td ></td>	
					<td ></td>
<!-- 					<td ></td>    -->
				</tr>
				
	        </tbody>
	    </table>    
    </div>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
    
<iframe name="forma" id="forma" style='display:none'></iframe>

</center>

  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/dataFill/ecologyFlow/EFFillList.js"></script>

</html>
