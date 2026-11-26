<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String proj_cd = request.getParameter("proj_cd")==null?"":request.getParameter("proj_cd");
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
	<script>
		var basePath = '<%=basePath%>';
		var proj_cd = '<%=proj_cd%>';	
	</script>
	

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
				<td width="30%"><span>一级项目：</span><br/></td>
				<td width="70%">
					<select name="group1" id="group1" value=""   style="float: left;width:90%; height:28px; color:#000000;border:1px solid #a5a5a5">
					</select>
					<div onclick="fproj()" style="background-image:url('<%=basePath %>/images/index/qsxk-01.png');float: right;
					    width: 10%;
					    height: 28px;
					    background-size: contain;
					    background-repeat: no-repeat;
					    background-position: right;
					    cursor:pointer">
					
					</div>
				</td>
			</tr>
			<tr>
				<td width="30%"><span>二级项目：</span><br/></td>
				<td width="70%">
					<select name="group2" id="group2" value=""  style="float: left;width:90%; height:28px; color:#000000;border:1px solid #a5a5a5">
					</select>
					<div onclick="sproj()" style="background-image:url('<%=basePath %>/images/index/qsxk-01.png');float: right;
					    width: 10%;
					    height: 28px;
					    background-size: contain;
					    background-repeat: no-repeat;
					    background-position: right;
					    cursor:pointer">
					
					</div>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>对外委托任务项目名称：</span><br/></td>
				<td width="70%">
					<input name="proj_nm" id="proj_nm" style="width:100%; height:28px; color:#000000;border:1px solid #a5a5a5">
					</input>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>是否公开招投标：</span><br/></td>
				<td width="70%">
					<select name="bid" id="bid"  style="width:100%; height:28px; color:#000000;border:1px solid #a5a5a5">
						<option value="0">否</option>
						<option value="1">是</option>
					</select>
				</td>
			</tr>
	        <tr>
				<td width="30%"><span>编制单位：</span><br/></td>
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
				<td width="30%"><span>电话：</span><br/></td>
				<td width="70%">
					<input name="tel" id="tel" value=""/>
				</td>
			</tr>
				
			<tr>
				<td colspan="2">
    				<button type="button"  width="20px" height="25px"  onclick="uploadFile();"  style="float: right;margin-top: 10px;">提交</button>
				</td>
			</tr>
		</table>   	

    	</form>

  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery.form.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script>
  $(document).ready(function(){
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
		
		initData();
	});
  
  function getGroup1(callback) {
	  $.post(basePath+'sjtj/sjqk_new/getGroup1',{},function(data){
		  $('#group1').empty();
		  var str ="";	  
		  for (var i=0; i<data.length; ++i) {
			  var row = data[i];
			  str += "<option value='"+row.id+"'>"+row.name+"</option>";
		  }
		  $('#group1').append(str);
		  if (callback) {
			  callback();
		  }
	  })
  }
  
  function getGroup2(callback) {
	  $.post(basePath+'sjtj/sjqk_new/getGroup2',{},function(data){
		  $('#group2').empty();
		  var str ="";	  
		  for (var i=0; i<data.length; ++i) {
			  var row = data[i];
			  str += "<option value='"+row.id+"'>"+row.name+"</option>";
		  }
		  $('#group2').append(str);
		  if (callback) {
			  callback();
		  }
	  })
  }
  
  function initOption() {
		getGroup1();
		getGroup2();
  }
  
  function initData() {
	  if (proj_cd) {
		  var data = {};
		  data.PROJ_CD = proj_cd;
		  data.STARTNUM = 0;
		  data.ENDNUM = 2;
		  $.ajax({
			  url:basePath+"/sjtj/sjqk_new/getProject",
			  type:'POST',
			  data:JSON.stringify(data),
			  dataType: 'json',
			  contentType: 'application/json; charset:utf-8',
			  success: function(data) {
				  if (data!=null && data.length>0) {
					  var row = data[0];
					  if (row.yr) {
						  $('#yr').val(row.yr);
					  }
					  if (row.group1) {
						  getGroup1(function(){
							  $('#group1').find("option[value='"+row.group1+"']").attr("selected",true);
						  });
					  }
					  if (row.group2) {
						  getGroup2(function(){
							  $('#group2').find("option[value='"+row.group2+"']").attr("selected",true);
						  });
					  }
					  if (row.proj_nm) {
						  $('#proj_nm').val(row.proj_nm);
					  }
					  if (row.bid) {
						  $('#bid').find("option[value='"+row.bid+"']").attr("selected",true);
					  }
					  if (row.cons_org) {
						  $('#cons_org').val(row.cons_org);
					  }
					  if (row.cont_nm) {
						  $('#cont_nm').val(row.cont_nm);
					  }
					  if (row.tel) {
						  $('#tel').val(row.tel);
					  }
				  }
				  else {
					  alert('查询错误!');
				  }
			  }
		  })
	  }
	  else {
		  initOption();
	  }
  }
  
  function uploadFile() {
	  var json = {};
	  json.proj_cd=proj_cd;
	  json.group1=$('#group1').val();
	  json.group2=$('#group2').val();
	  json.yr=$('#yr').val();
	  json.proj_nm=$('#proj_nm').val();
	  json.bid=$('#bid').val();
	  json.cons_org=$('#cons_org').val();
	  json.cont_nm=$('#cont_nm').val();
	  json.tel=$('#tel').val();
	  
	  if (!json.proj_nm) {
		  alert("需要填写 '对外委托任务项目名称' 一栏");
		  return;
	  }
	  
	  $.ajax({
		  url: basePath+'sjtj/sjqk_new/addProject',
		  type: 'POST',
		  data:JSON.stringify(json),
		  dataType:'json',
		  contentType:'application/json',
		  success: function(data) {
			  parent.search(1);
			  parent.layer.closeAll();
		  }
	  })
  }
  
  function fproj() {
	  parent.layer.open({
		  type: 2,
		  title : ["一级项目" , true],
		  area: ['345px', '450px'], //宽高
		  content: basePath+"pages/lyzg/zlxx_new/proj.jsp?type=1",
		  cancel: function() {
			  debugger;
			  initData();
		  }
		});
  }

  function sproj() {
	  parent.layer.open({
		  type: 2,
		  title : ["二级项目" , true],
		  area: ['345px', '450px'], //宽高
		  content: basePath+"pages/lyzg/zlxx_new/proj.jsp?type=2",
		  cancel: function() {
			  debugger;
			  initData();
		  }
	   });
  }
  </script>
</html>
