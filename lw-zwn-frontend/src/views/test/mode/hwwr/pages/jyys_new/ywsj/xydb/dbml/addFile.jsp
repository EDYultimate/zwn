<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>达标名录--新增</title>
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery.multiselect.css">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	  <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	 <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
	<script type="text/javascript" src="<%=basePath%>common/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="<%=basePath%>common/js/jquery.multiselect.js"></script>
	
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.ui.widget.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.iframe-transport.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-process.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-validate.js'></script>
	
	<style>
	body{font-size:14px}
	table{border-collapse:collapse;border-spacing:0;border-left:1px solid #999;border-top:1px solid #999;border-bottom:1px solid #999;font-size:14px}
	table>th,.table>td{border-right:1px solid #999;padding:5px 15px;}
	table>tbody>tr>td{border:1px solid #999;height:31px;width: 90px;}
	table>thead>tr>td{border-right:1px solid #999;padding:5px 15px;}
	textarea{width:350px; height:90px;}
	input[type="text"]{height:25px;width:50%;}
	.a-upload {
	    position: relative;
	    background: #fafafa;
	    overflow: hidden;
	    display: inline-block;
	    padding: 0px 20px 0 20px;
	    border-radius: 15px;
	    border: 1px solid #E1E1E1;
	    /* background-color: rgba(2, 194, 153, 1); */
	    background-color:#17BDB0;
	    outline: none;
	    color: #FFFFFF;
	    width:70px;
	    height: 22px;
	    cursor: pointer;
	    text-decoration: none;
}
	.a-upload  input {
		position: absolute;
		font-size: 100px;
		right: 0;
		top: 0;
		opacity: 0;
		filter: alpha(opacity = 0);
}

		.cx{
			width:50px;
			border-radius: 12px;
			color: #FFFFFF;
			background-color: #17BDB0;
			text-align:center;
		}
		.cx:hover{
			cursor:pointer;
		}
	</style>
  </head>
  <script>
  	var basePath = "<%=basePath%>";
  </script>
  <body style="overflow: hidden;">
        <input type="hidden" id="stcds">
        <input type="hidden" id="stcdCheck">

		<div id="bbxxDiv" style="width: 100%;height: 95%;overflow: hidden;margin-top: 15px;">
     	<div style="width:100%;padding-left:10px;height:100%;overflow-y:scroll; ">
     		<div id="bbTableDiv" style="width:100%;">
     		<input id="fileuid" style="display: none;">
	     		<table width="700" height="30">
					<tr>
						<td ><div align="center">批次:</div> <div align="center"></div></td>
					<%--	<td style="text-align: center;">
							<input id='yr' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
						</td>--%>
						<td  style="text-align:center">
						<select id="batch" >
							<option value="第一批">第一批</option>
							<option value="第二批">第二批</option>
							<option value="第三批">第三批</option>
							<option value="第四批">第四批</option>
							<option value="第五批">第五批</option>
							<option value="第六批">第六批</option>
							<option value="第七批">第七批</option>
							<option value="第八批">第八批</option>
							<option value="第九批">第九批</option>
							<option value="第十批">第十批</option>
						</select>
						</td>

						<td ><div align="center"><span class="sred">*</span>年份:</div> </td>
						<td style="text-align: center;">
							<input id='yr' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
						</td>

					</tr>

					<tr>
						<td  colspan="2"><div align="center">是否海河流域:</div></td>
						<td  colspan="2"  style="text-align:center">
							<select id="ishwcc" >
								<option value="1">是</option>
								<option value="0">否</option>
							</select>
						</td>
					</tr>

					<tr>
						<td><div align="center">省:</div><div align="center"></div></td>
						<td style="text-align:center">
							<select id="ad_cd" >
								<option value="110000">北京市</option>
								<option value="120000">天津市</option>
								<option value="130000">河北省</option>
								<option value="140000">山西省</option>
								<option value="410000">河南省</option>
								<option value="370000">山东省</option>
								<option value="150000">内蒙古自治区</option>
								<option value="210000">辽宁省</option>
							</select>
						</td>
					<%--</tr>
					<tr>--%>
						<td><div align="center">市:</div><div align="center"></div></td>
						<td style="text-align:center">
							<select id="city" >
							</select>
						</td>
					</tr>
					<tr>
						<td><div align="center"><span class="sred">*</span>县（区）:</div></td>
						<td  colspan="3"   style="text-align:center">
							<input type="text" id="zd"   value="点击选择"   style="border-radius: 5px;width:90%;"   onClick="dj()" >
						</td>
					</tr>


				  </table>
				
     		</div>
			<div  id="zdxz"  style="height:200px; width:480px; border:1px solid black;position:absolute;left:200px;top:140px;background-color: lightgrey;">
				<div  style='height:40px;border-bottom:1px solid #999;font-size:15px;width: 100%;' >
					<span style='margin-left:10px;float:left;	line-height: 40px;'>县区名称</span>
					<div  id='selectAll' class='cx' style='margin-left:200px;float:left;margin-top:8px;'>全选</div>
					<div  id='selectNone' class='cx' style='margin-left:20px;float:left;margin-top:8px;'>清空</div>
					<div  id='qd' class='cx' style='margin-left:20px;float:left;margin-top:8px;'>确定</div>
				</div>
				<div id='zdxx' style='width:100%;border:0px solid #999; height:150px;overflow-y:scroll;'>

				</div>
			</div>
     		<div>
     			<div id="bbbcButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:230px;margin-right: 385px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;' onclick="saveDbBase()">
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
     
     
  
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script src="<%=basePath%>pages/jyys_new/ywsj/xydb/dbml/addFile.js" type="text/javascript"></script>
</html>
