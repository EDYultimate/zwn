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
<title>新批未发取水许可</title>
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
					<td style="width: 102px;">申请书名称</td><td><input id="wpc_nm"></input></td>
					<td>申请年份</td><td><input id="nyear"   onclick="WdatePicker({ dateFmt: 'yyyy'})"></input></td>
				</tr>
				<tr>
					<td>年取用水总量</td><td><input id="ww" ></input></td>
					<td>联系方式</td><td><input id="contact"></input></td>
				</tr>
				<tr>
					<td>是否已发</td><td><select id="cert" style="width:55px">
															  			<option value="0">未发</option>
															  			<option value="1">已发</option>
															  		</select></td>
					<td>备注</td><td><input id="nt"></input></td>
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
		
		<div style="height: 5%; position: absolute; bottom: 12%; left: 35%;">
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
<script type="text/javascript" src="<%=basePath %>pages/rcgl/xpwf/dialog/add.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>