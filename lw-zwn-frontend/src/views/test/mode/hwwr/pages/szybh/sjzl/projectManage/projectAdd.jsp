<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>新增项目</title>
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
.a-upload{
}
.redtext{color:red}
	</style>
  </head>
  <script>
  	var basePath = "<%=basePath%>";
  </script>
  <body style="overflow: hidden;">
  	  <div id="bbxxDiv" style="width: 100%;height: 95%;overflow: hidden;margin-top: 15px;">
     	<div style="width:100%;padding-left:10px;height:100%;overflow-y:scroll; ">
     		<div id="bbTableDiv" style="width:68%;float:left;">
     		<input id="fileuid" style="display: none;">
     		<div style="font-size:15px;color:#333333;font-weight: bold;margin-bottom: 10px;width:100%">基础情况</div>
	     		<table width="100%" height="30">
				<tr>
					<td><div align="center"><label class="redtext" >*</label>对外委托项目名称</div><div align="center"></div></td>
					<td style="text-align:center" colspan="3">
						<input type="text" id="project_nm" name="project_nm"  >
					</td>
				</tr>
				<tr>
				    <td><div align="center"><label class="redtext" >*</label>所属一级项目</div><div align="center"></div></td>
				    <td style="text-align:center">
						<select id="pro_level1">
							
						</select>
						<input style="display:none" placeholder="请输入一级项目名"  type="text" id="pro_level1text" name="pro_level1text"  >
				    </td>
						<td><div align="center">立项时间:</div>    
						  <div align="center"></div></td>
						<td style="text-align: center;">
						
							<input id='tm' type='text' onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" autocomplete="off"/> 
						</td>
					</tr>
					
					
					<tr>
					<td><div align="center"><label class="redtext" >*</label>所属二级项目</div><div align="center"></div></td>
					<td style="text-align:center">
						<select id="pro_level2">
							
						</select>
						<input style="display:none" placeholder="请输入二级项目名"  type="text" id="pro_level2text" name="pro_level2text"  >
					</td>
					
					<td><div align="center"><label class="redtext" >*</label>委托金额</div><div align="center"></div></td>
					<td style="text-align:center">
						<input  type="text" id="wt_cashnum" name="wt_cashnum" >
					</td>
					</tr>
					
					<tr>
					<td><div align="center"><label class="redtext" >*</label>承担单位</div><div align="center"></div></td>
					<td style="text-align:center">
						<input  type="text" id="pro_unit" name="pro_unit" >
					</td>
					
					<td><div align="center">委托形式</div><div align="center"></div></td>
					<td style="text-align:center">
						<input type="text" id="wt_tp" name="wt_tp"  >
					</td>
					</tr>
					
					<tr>
					<td><div align="center">项目阶段</div><div align="center"></div></td>
					<td style="text-align:center">
					
						<select id="pro_stage" >
							<option value="">全部</option>
							<option value="1">立项申报</option>
							<option value="2">招投标</option>
							<option value="3">实施</option>
							<option value="4">已验收</option>
						</select>
					</td>
					<td><div align="center">业务类型</div><div align="center"></div></td>
					<td style="text-align:center">
						<select id="ywtp"  >
							<option value="">全部</option>
							<option value="1">生态流量</option>
							<option value="2">地下水超采</option>
							<option value="3">饮用水源保护</option>
						</select>
					</td>
					</tr>
				  </table>
				  
     		</div>
     		<div style="float:left;width:29%;height: 200px;overflow-y:auto;margin-left: 10px">
	     		<div style="font-size:15px;color:#333333;font-weight: bold;margin-bottom: 10px;width:100%;height:25px;">
		     		<div style="float:left;display:inline-block">项目成果</div>
		     		<div  style="float:right;display:inline-block">
		     			<input  id='file1' id='file' type='file' multiple>
		     		</div>
	     		</div>
	     		<div style="height: 150px;width: 99%;border: 1px solid;overflow: auto;">
	     			<div align="center" >
					  <div id= "file_tr" >
							
					 </div>
					    <!-- <div id="progress" style="display:none" ></div>  -->
					</div>
				
	     		</div>
     		</div>
     		<div style="float:left;width:100%">
     		<div style="font-size:15px;color:#333333;font-weight: bold;margin-bottom: 10px;width:100%;margin-top:20px">支付情况</div>
     			<table width="98%" height="30">
					<tr>
						<td><div align="center">第一笔支付条件</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="first_term" name="first_term"  >
						</td>
						<td><div align="center">第二笔支付条件</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="second_term" name="second_term"  >
						</td>
						<td><div align="center">第三笔支付条件</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="third_term" name="third_term"  >
						</td>
					</tr>
					<tr>
						<td><div align="center">支付比例</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="first_scale" >
						</td>
						<td><div align="center">支付比例</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="second_scale"  >
						</td>
						<td><div align="center">支付比例</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="third_scale"  >
						</td>
					</tr>
						<tr>
						<td><div align="center">支付金额</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="first_cash"  >
						</td>
						<td><div align="center">支付金额</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="second_cash"  >
						</td>
						<td><div align="center">支付金额</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="third_cash"   >
						</td>
					</tr>
					<tr>
						<td><div align="center">支付时间</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="first_tm"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" >
						</td>
						<td><div align="center">支付时间</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="second_tm"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" >
						</td>
						<td><div align="center">支付时间</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="third_tm"   onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})" >
						</td>
					</tr>
				</table>
     		
     		
     		
     		</div>
     		<div style="float: left;width: 100%;margin-top: 20px;">
     			<div id="bbbcButton" style='width: 70px;height: 24px;line-height: 22px;margin:auto;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;' onclick="save()">
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
     
     
  
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
	<script src="<%=basePath%>/pages/szybh/sjzl/projectManage/projectAdd.js" type="text/javascript"></script>
</html>
