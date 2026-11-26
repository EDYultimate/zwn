<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'upload.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script>var basePath = '<%=basePath%>';</script>
	

  </head>
  <style type="text/css">
  .mainTableCss{
	table-layout:fixed;
	border-collapse: collapse;
    border-spacing: 0;
    border-left: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    border-right: 1px solid #d8d8d8;
	background-color:#FFFFFF;
	width: 100%;
	margin:0;
}

.mainTableCss td{
	border-right: 1px;
	border-right-color: #d8d8d8;
	border-right-style: solid;
	border-bottom: 1px;
	border-bottom-color: #d8d8d8;
	border-bottom-style: solid;
	text-align: center;
	
}

.mainTableCss thead td{

	background-color: #F5F5F5; 
	font-size: 12px;
	color:#4c4c4c;
	height: 28px;
	letter-spacing: 3px;
	font-family: '微软雅黑';
	background-position: right;
	background-repeat: no-repeat;
}
.mainTableCss thead tr{
	height:30px;
    font-weight: bold;
}
.mainTableCss tbody tr{
	font-size: 12px;
	height: 30px;
}
.mainTableCss tbody td{
	
}
table   input{
	width: 100%;
	height: 30px;
	text-align: left;	
	border: 1px solid #a5a5a5;
	border-style:solid;
	border-radius:2px;
}
  </style>
  <body>
    	<form name="uploadForm"  method="post" enctype="multipart/form-data">      	
    	<table class="mainTableCss">
			<tr>
				<td width="30%"><span>年度：</span><br/></td>
				<td width="70%">
					<select name="yr" id="yr"  style="width:100%; height:28px; color:#000000;border:1px solid #a5a5a5">
					</select>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>项目名称：</span><br/></td>
				<td width="70%">
					<select name="proj_nm" id="proj_nm" style="width:100%; height:28px; color:#000000;border:1px solid #a5a5a5">
						<option value="2018 年海委水资源监控管理信息平台数据库、应用系统和门户的运行维护">2018 年海委水资源监控管理信息平台数据库、应用系统和门户的运行维护</option>
						<option value="海河流域水资源监控管理信息平台业务应用系统及数据库完善">海河流域水资源监控管理信息平台业务应用系统及数据库完善</option>
						<option value="海河流域水资源监控管理信息平台商业软件购置和系统集成与项目协调">海河流域水资源监控管理信息平台商业软件购置和系统集成与项目协调</option>
						<option value="海河流域水资源监控管理信息平台应用系统完善">海河流域水资源监控管理信息平台应用系统完善</option>
						<option value="2017年海委水资源监控平台数据库应用系统和门户的运行维护">2017年海委水资源监控平台数据库应用系统和门户的运行维护</option>						
						<option value="2016年海委水资源监控平台数据库、应用系统和门户的运行维护">2016年海委水资源监控平台数据库、应用系统和门户的运行维护</option>						
						<option value="2015年海委水资源监控平台数据库、应用系统和门户的运行维护">2015年海委水资源监控平台数据库、应用系统和门户的运行维护</option>
						<option value="水资源调配决策支持系统及引滦枢纽等调度模型建设">水资源调配决策支持系统及引滦枢纽等调度模型建设</option>						
						<option value="2014年流域平台集成">2014年流域平台集成</option>						
						<option value="决策支持数据库及水资源应急管理系统">决策支持数据库及水资源应急管理系统</option>						
						<option value="水资源业务应用系统建设与平台集成">水资源业务应用系统建设与平台集成</option>
						<option value="2013年平台集成项目">2013年平台集成项目</option>
					</select>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>承建单位：</span><br/></td>
				<td width="70%">
					<input name="cons_org" id="cons_org" value=""/>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>联系人：</span><br/></td>
				<td width="70%">
					<input name="cont_nm" id="cont_nm" value=""/>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>联系人电话：</span><br/></td>
				<td width="70%">
					<input name="tel" id="tel" value=""/>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>附件类型：</span><br/></td>
				<td width="70%">
					<select name="doc_tp" id="doc_tp" style="width:100%; height:28px; color:#000000;border:1px solid #a5a5a5">
						<option value="招投标文件">招投标文件</option>
						<option value="合同文件">合同文件</option>
						<option value="成果文件">成果文件</option>
						<option value="意见文件">意见文件</option>
						<option value="规范文件">规范文件</option>
						<option value="过程文件">过程文件</option>						
						<option value="其他文件">其他文件</option>
					</select>
				</td>
			</tr>			
			<tr>
				<td width="30%"><span>附件：</span><br/></td>
				<td>
				<input type="file" name="file" id="file"  value=""/>
				</td>
				
<!-- 				<td style="text-align: left;"><span id="fileName" style="color:#f00;">请上传文件,文件格式(.pdf)</span></td> -->
			</tr>
			<tr>
				<td colspan="2">
    				<button type="button"  width="20px" height="25px"  onclick="uploadFile();">提交</button>
				</td>
			</tr>
		</table>   	

    	</form>
<!--     	<input type="submit" value="点击上传	" onclick="uploadFile();"/> -->
<!--     	<div>已上传文件：</div> -->
<!--     	<div id="filelist" style="padding-left: 15px;"> -->
    		
<!--     	</div> -->
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery.form.js"></script>
  <script>
  $(function(){
	  var date=new Date();
		var getYr=date.getFullYear();	
		for(var i=0;i<7;i++){
			if(i==6){
				opt.attr("selected",true);
			}
			var opt=$('<option>');
			opt.attr("value",(getYr+i-5));
			opt.html((getYr+i-5));
			opt.appendTo($('#yr'));			
		}
		
	});

  
  
  
  function uploadFile(){
	    var getFile=$("#file").val();
	    if(getFile==null||getFile==''){
	    	alert("请上传附件！");
	    }else{
	    	var form = $("form[name=uploadForm]");  
		    var options  = {  
		        url:basePath+'/sjtj/sjqk/uploadFile',  
		        dataType:'json',
		        type:'post',  
		        success:function(data)  
		        {
		        	if(data.STATUS!=null && data.STATUS=="Y"){
		        	   parent.search(1);
	             	   parent.layer.closeAll();
//	 	        		var files = data.FILELIST;
//	 	        		for(var i=0;i<files.length;i++){
//	 	        			$("#filelist").append("<p>"+files[i]+"</p>");
//	 	        		}
	             
		        	}else{
		        		alert("附件名称太长！");
		        	}
		        }  
		    };  
		    form.ajaxSubmit(options); 
	    }
		
	}
  </script>
</html>
