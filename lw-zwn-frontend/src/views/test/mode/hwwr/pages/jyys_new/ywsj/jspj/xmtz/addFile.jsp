<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>政策法规--新增</title>
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
	</style>
  </head>
  <script>
  	var basePath = "<%=basePath%>";
  </script>
  <body style="overflow: hidden;">
  	  <div id="bbxxDiv" style="width: 100%;height: 95%;overflow: hidden;margin-top: 15px;">
     	<div style="width:100%;padding-left:10px;height:100%;overflow-y:scroll; ">
     		<div id="bbTableDiv" style="width:100%;">
				<input id="registerfileuid" style="display: none;">
				<input id="formfileuid" style="display: none;">
				<input id="techfileuid" style="display: none;">
	     		<table width="700" height="30">
					<tr>
						<td><div align="center"><span class="sred">*</span>年份:</div></td>
						<td style="text-align: center;">
							<input id='yr' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
						</td>
					</tr>
					<tr>
						<td><div align="center"><span class="sred">*</span>项目名称:</div></td>
						<td style="text-align:center">
							<input type="text" id="nm" name="nm" >
						</td>
					</tr>
					<tr>
						<td><div align="center">所在地:</div></td>
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
					</tr>


					<tr>
						<td><div align="center">评价环节:</div><div align="center"></div></td>
						<td style="text-align:center">
							<select id="evaluation" >
								<option value="1">规划制定阶段</option>
								<%--<option value="2">工程规划</option>--%>
								<option value="2">工程规划、项目立项阶段</option>
								<option value="4">水资源论证阶段</option>
								<option value="5">取水许可阶段</option>
							</select>
						</td>
					</tr>


					<tr>
						<td><div align="center">节水评价登记收文时间:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='registertm' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/>
						</td>
					</tr>
					<tr>
						<td><div align="center">登记表上传:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='file1' class="file"   type='file' multiple></input>
						</td>
					</tr>

					<tr>
						<td><div align="center">形式审查时间:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='formtm' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/>
						</td>
					</tr>
					<tr>
						<td><div align="center">形式审查意见上传:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='file2' class="file"   type='file' multiple></input>
						</td>
					</tr>
					<tr>
						<td><div align="center">技术审查时间:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='techtm' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/>
						</td>
					</tr>

				  <tr>
				    <td><div align="center">技术审查意见上传:</div>      <div align="center"></div></td>
				    <td style="text-align: center;">
						<input id='file3' class="file"   type='file' multiple></input>
				    </td>
				  </tr>
				 
				  </table>
				
     		</div>
     		<div>
     			<div id="bbbcButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:30px;margin-right: 385px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;' onclick="saveDbBase()">
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
     
     
  
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script src="<%=basePath%>pages/jyys_new/ywsj/jspj/xmtz/addFile.js" type="text/javascript"></script>
</html>
