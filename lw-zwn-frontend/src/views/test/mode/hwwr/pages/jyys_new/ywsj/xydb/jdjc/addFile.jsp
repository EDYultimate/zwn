<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>监督检查--新增</title>
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
	textarea{width:520px; height:100px; margin:5px;}
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
			<input id="casefileuid" style="display: none;">
			<table width="700" height="30">
	     	<%--	 <tr>
				    <td><div align="center">类型</div><div align="center"></div></td>
					<td style="text-align:center">
						<select id="fw">
							<option value="11">法律法规</option>
							<option value="12">政策文件</option>
							<option value="13">标准规范</option>
						</select>
					</td>
					</tr>

					<tr>
						<td><div align="center">业务分类</div><div align="center"></div></td>
						<td style="text-align:center">
							<select id="area" >
								<option value="1">计划用水管理</option>
								<option value="2">县域节水型社会达标建设</option>
								<option value="3">用水定额</option>
								<option value="4">重点监控用水单位</option>
								<option value="5">节水评价</option>
								<option value="6">节水考核</option>
								<option value="7">节水载体创建</option>
							</select>
						</td>
					</tr>--%>
					<tr>
						<td><div align="center"><span class="sred">*</span>年份:</div>    </td>
						<td style="text-align: center;">
							<input id='yr' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
						</td>
					</tr>


					<tr>
						<td><div align="center">行政区:</div><div align="center"></div></td>
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
		<%--		<tr>
					<td><div align="center">检查时间:</div>      <div align="center"></div></td>
					<td style="text-align: center;">
						<input id='tm' type='text'  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/>
					</td>
				</tr>--%>


				<tr>
					<td><div align="center"><span class="sred">*</span>检查时间::</div></td>
					<td style="text-align:center">
						<input type="text" id="tm" name="tm"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"  style="width:150px;" >
						--
						<input type="text" id="etm" name="tm"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"  style="width:150px;">
					</td>
				</tr>

				<tr>
					<td><div align="center">市:</div><div align="center"></div></td>
					<td style="text-align:center">
						<select id="city" >
						</select>
					</td>
				</tr>

					<tr>
						<td><div align="center"><span class="sred">*</span>县（区）:</div> </td>
						<td style="text-align: center;">
							<%--<input id='district' type='text'/>--%>
							<input id='zd' type='text'   value="点击选择"   style="border-radius: 5px;width:90%;"   onClick="dj()"/>
						</td>
					</tr>
					<tr>
						<td><div align="center">进展情况:</div>  </td>
						<td style="text-align: center;">
							<textarea  id='progress' type='text'/>  </textarea>
						</td>
					</tr>
					<tr>
						<td><div align="center">存在问题:</div>   </td>
						<td style="text-align: center;">
							<textarea  id='problem' type='text'/>  </textarea>
						</td>
					</tr>

				<tr>
					<td><div align="center">典型案例:</div>      <div align="center"></div></td>
					<td style="text-align: center;">
						<%--<input id='btm' type='text'  />--%>
						<textarea  id='tpcase' type='text'/>  </textarea>
					</td>
				</tr>

					<%--<tr>
						<td><div align="center">典型案例上传:</div>      <div align="center"></div></td>
						<td style="text-align: center;">
							<input id='file2' class="file"  type='file' multiple></input>

						</td>
					</tr>--%>
				 <tr>
					<td><div align="center">是否有主任参加:</div><div align="center"></div></td>
					<td style="text-align:center">
						<select id="isdirector" >
							<option value="是">是</option>
							<option value="否">否</option>
						</select>
					</td>
				</tr>


				  <tr>
				    <td><div align="center">附件上传:</div>      <div align="center"></div></td>
				    <td style="text-align: center;">
						<input id='file1' class="file" id='file' type='file' multiple></input>
				    	
				    </td>
				  </tr>
				 
				  </table>
				
     		</div>

			<div  id="zdxz"  style="height:200px; width:480px; border:1px solid black;position:absolute;left:200px;top:170px; background-color: lightgrey;">
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
     			<div id="bbbcButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:30px;margin-right: 385px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;' onclick="saveDbBase()">
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
     
     
  
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script src="<%=basePath%>pages/jyys_new/ywsj/xydb/jdjc/addFile.js" type="text/javascript"></script>
</html>
