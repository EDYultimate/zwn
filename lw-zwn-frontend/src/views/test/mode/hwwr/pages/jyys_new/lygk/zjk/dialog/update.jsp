<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String id = request.getParameter("id");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>通讯录-修改</title>
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
  	var id="<%=id%>";
  </script>
  <body style="overflow: hidden;">
  	  <div id="bbxxDiv" style="width: 100%;height: 95%;overflow: hidden;margin-top: 15px;">
     	<div style="width:100%;padding-left:10px;height:100%;overflow-y:scroll; ">
     		<div id="bbTableDiv" style="width:100%;">
     		<input id="fileuid" style="display: none;">
	     		<table width="700" height="30">
					<tr>
						<td><div align="center"><span class="sred">*</span>姓名:</div></td>
						<td style="text-align:center">
							<input type="text" id="nm" name="nm" >
						</td>
					</tr>
					<%--<tr>
                      <td><div align="center">文件类型</div><div align="center"></div></td>
                      <td style="text-align:center">
                          <select id="fw">
                              <option value="1">法律</option>
                              <option value="2">行政法规和法规性文件</option>
                              <option value="3">部门规章</option>
                              <option value="4">规范性文件</option>
                              <option value="5">工作性文件</option>
                          </select>
                      </td>
                    </tr>--%>
					<tr>
						<td><div align="center"><span class="sred">*</span>单位:</div> </td>
						<td style="text-align: center;">
							<input id='workplace' type='text' />
						</td>
					</tr>
					<tr>
						<td><div align="center">职务:</div>  </td>
						<td style="text-align: center;">
							<input id='job' type='text' />
						</td>
					</tr>
					<tr>
						<td><div align="center">办公电话:</div> </td>
						<td style="text-align: center;">
							<input id='tel' type='text'/>
						</td>
					</tr>

					<tr>
						<td><div align="center">手机号码:</div>  </td>
						<td style="text-align: center;">
							<input id='mob' type='text'/>
						</td>
					</tr>
					<tr>
						<td><div align="center">通讯地址:</div>  </td>
						<td style="text-align: center;">
							<input id='addr' type='text'/>
						</td>
					</tr>
				  </table>
     		</div>
     		<div>
     			<div id="saveButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:30px;margin-right: 385px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;'>
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script src="<%=basePath%>pages/jyys_new/lygk/zjk/dialog/update.js" type="text/javascript"></script>
</html>
