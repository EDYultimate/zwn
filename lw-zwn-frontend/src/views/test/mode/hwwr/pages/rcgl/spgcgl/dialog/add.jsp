<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String wpc_cd = request.getParameter("wpc_cd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>审批过程管理</title>
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
	var wpc_cd = "<%=wpc_cd%>";
</script>
<style type="text/css">
	tr {
	    cursor: auto;
	}
	
	input {
		width: 200px;
	}
	
	
	.a-upload {
	    position: relative;
	    background: #fafafa;
	    overflow: hidden;
	    display: inline-block;
	    padding: 0px 20px 0 20px;
	    border-radius: 15px;
	    border: 1px solid #E1E1E1;
	    background-color: rgba(2, 194, 153, 1);
	    outline: none;
	    color: #FFFFFF;
	    height: 20px;
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
	
	
	.loadfilespan {
		margin-left: 5px;
	}
	
</style>
</head>
<body>
	
		<table id="table" class="bbTable"  style="height: 80%;">
			<tbody>
				<tr>
					<td>取水许可证编号</td><td><input id="WPC_SN"></input></td>
					<td>证件状态</td><td><select id="CERT_COND" style="width:55px">
															  			<option value="1">新发</option>
															  			<option value="5">延续</option>
<!-- 															  			<option value="3">注销</option>
															  			<option value="4">吊销</option> -->
															  		</select></td>
				</tr>
				<tr>
					<td>取水起始日期</td><td><input id="INT_BD"   onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"></input></td>
					<td>取水终止日期</td><td><input id="INT_DL"   onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"></input></td>
				</tr>
				<tr>
					<td>取水权人名称</td><td><input id="WRP_NM"></input></td>
					<td>法人代表</td><td><input id="LR_NM"></input></td>
				</tr>
				<tr>
					<td>审批日期</td><td><input id="APPR_DT"   onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"></input></td>
					<td>取水地点</td><td><input id="INT_ADDR"></input></td>
				</tr>
				<tr>
					<td>取水户名称</td><td><input id="WIU_NM"></input></td>
					<td>证书印刷编号</td><td><input id="CERT_PRT_CD"></input></td>
				</tr>
				<tr>
					<td>取水方式</td><td><input id="CHK_INT_MET"></input></td>
					<td>取水量</td><td><input id="WW"></input></td>
				</tr>
				<tr>
					<td>取水用途</td><td><input id="INT_USE"></input></td>
					<td>水源类型</td><td><input id="CHK_SOUR_TP"></input></td>
				</tr>
				<tr>
					<td>退水地点</td><td><input id="RW_ADDR"></input></td>
					<td>退水方式</td><td><input id="RW_TP"></input></td>
				</tr>
				<tr>
					<td>退水量</td><td><input id="RW_W"></input></td>
					<td>退水水质要求</td><td><input id="RW_WQ_REQ"></input></td>
				</tr>
				<tr>
					<td>领取日期</td><td><input id="DRAW_DT"   onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"></input></td>
					<td>领取人员</td><td><input id="DRAW_STAFF"></input></td>
				</tr>
			</tbody>
		</table>

		<table id="filetable" class="bbTable"  style="height: 15%;">
				<tbody>
					<tr style="height:90px">
						<td style="width:102px">
								<a href="javascript:;" class="a-upload">
									<input id="uploadfile" type="file"  >上传文件
								</a>
						</td>
						<td style="height: 75px;">
							<div id="scrollfiles"  style="height: 70px;overflow-y: auto;">
								<table style="width:100%">
									<tbody id="uploadfiles" >
									
									</tbody>								
								</table>
							</div>
						</td>
					</tr>
				</tbody>
		</table>
		
		<div style="height: 5%; position: absolute; bottom: 2%; left: 35%;">
			<input type="button" value="取消" class="sb_input" style="width:90px" onclick="cancel()">
			<input type="button" value="保存" class="sb_input" style="width:90px;margin-left:50px" onclick="save()">
		</div>
	
</body>
<script type="text/javascript">
var basePath = "<%=basePath%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/spgcgl/dialog/add.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>