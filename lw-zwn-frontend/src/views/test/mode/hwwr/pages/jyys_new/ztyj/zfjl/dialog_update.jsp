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
    
    <title>支付记录-修改</title>
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
						<td><div align="center">项目名称:</div></td>
						<td style="text-align:center">
							<input type="text" id="nm"  readonly="readonly"  style="border:none;" >
						</td>
					</tr>
					<tr>
						<td><div align="center"><span class="sred">*</span>第一笔金额:</div></td>
						<td style="text-align:center">
							<input type="text" id="firamount">
						</td>
					</tr>

					<tr>
						<td><div align="center">第一笔支付时间:</div> </td>
						<td style="text-align: center;">
							<input id='firtm' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/>
						</td>
					</tr>

					<tr>
						<td><div align="center">第二笔金额:</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="secamount">
						</td>
					</tr>

					<tr>
						<td><div align="center">第二笔支付时间:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='sectm' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/>
						</td>
					</tr>

					<tr>
						<td><div align="center">第三笔金额:</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="thiamount" >
						</td>
					</tr>

					<tr>
						<td><div align="center">第三笔支付时间:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='thitm' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/>
						</td>
					</tr>

					<%--<tr>
						<td><div align="center">颁布年份:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='bbyr' type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
						</td>
					</tr>
					<tr>
						<td><div align="center">修订年份:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='xdyr' type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
						</td>
					</tr>--%>
					<%--<tr>
						<td><div align="center">上传人:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='user' type='text'/>
						</td>
					</tr>--%>

				  </table>
				
     		</div>
     		<div>
     			<div id="saveButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:30px;margin-right: 325px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;'>
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script src="<%=basePath%>pages/jyys_new/ztyj/zfjl/dialog_update.js" type="text/javascript"></script>
</html>
