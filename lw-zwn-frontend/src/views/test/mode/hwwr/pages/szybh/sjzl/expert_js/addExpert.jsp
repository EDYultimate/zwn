<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>新增专家</title>
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery.multiselect.css">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
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
	input[type="text"]{height:25px;width:100%;border:none}
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
table tr td:nth-child(odd){      /* 基数列 */
    background-color:#f5f4f3;
    font-size: 14px;
    font-weight: bold;
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
     		<input id="fileuid" style="display: none;">
	     		<table width="700" height="30">
				<tr>
					<td><div align="center"><label style="color:red">*</label>专家姓名</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="EXP_NM" name="EXP_NM"  >
					</td>
			
				    <td><div align="center"><label style="color:red">*</label>性别</div><div align="center"></div></td>
				    <td style="text-align:center">
						<select id="EXP_SEX">
							<option value="1">男</option>
							<option value="2">女</option>
							<option value="3">其他</option>
						</select>
				    </td>
				  </tr>
					<tr>
						<td><div align="center">出生日期:</div>    
						  <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='BRITHDAY' type='text'/>
<!-- 							<input id='BRITHDAY' type='text' onClick="WdatePicker({ dateFmt: 'yyyy-MM'})"/> -->
						</td>
					
					<td><div align="center">政治面貌</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="POLICITAL_STATUS" name="POLICITAL_STATUS"  >
					</td>
					</tr>
					
					<tr>
					<td><div align="center">专业特长</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="SPECIALTY" name="SPECIALTY"  >
					</td>
					
					<td><div align="center">单位</div><div align="center"></div></td>
					<td style="text-align:center">
						<input  type="text" id="UNITS" name="UNITS" >
					</td>
					</tr>
					
					<tr>
					<td><div align="center">专家类型</div><div align="center"></div></td>
					<td style="text-align:center">
						<select id="EXP_TYPE" name="EXP_TYPE" >
							<option value=""></option>
							<option value="水利专业专家">水利专业专家</option>
							<option value="生产行业专家">生产行业专家</option>
							<option value="环境保护">环境保护</option>
						</select>
					</td>
					
					<td><div align="center">职务/职称</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="JOB" name="JOB"  >
					</td>
					</tr>
					
					<tr>
					<td><div align="center">手机号</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="PHONE_NUMBER" name="PHONE_NUMBER"  >
					</td>
					<td><div align="center">邮箱</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="E_MAIL" name="E_MAIL"  >
					</td>
					
					</tr>
					
					<tr>
					<td><div align="center">通讯地址</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="ADDRESS" name="ADDRESS"  >
					</td>
					<td><label style="color:red">*</label>单位类型</td>
					<td>
					<select id="unittype" name="unittype">
						<option value="水利部">水利部</option>
						<option value="流域机构">流域机构</option>
						<option value="省市水利（务）厅（局）">省市水利（务）厅（局）</option>
						<option value="环保部门">环保部门</option>
						<option value="其他">其他</option>
					</select>
					</td>
					</tr>
					<!-- <tr>
					<td><div align="center">备注</div><div align="center"></div></td>
					<td  colspan="3" style="text-align:center">
						<textarea rows="5" cols="5" id="NT" name="NT"  ></textarea>
					</td>
					</tr> -->
				 
				  </table>
     		</div>
     		<div>
     			<div id="bbbcButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:30px;margin-right: 325px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;' onclick="save()">
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
     
     
  
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
	<script src="<%=basePath%>/pages/szybh/sjzl/expert_js/addExpert.js" type="text/javascript"></script>
</html>
