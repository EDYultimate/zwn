<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	String id = request.getParameter("id")==null?"":request.getParameter("id");

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>监督检查</title>
	<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/multselect/mselect.css">
	<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
	<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
	<style type="text/css">
		tr {
			cursor: auto;
		}

		input {
			width: 200px;
		}

		.a-upload {
			position: relative;
			width:60px;
			background: #fafafa;
			overflow: hidden;
			display: inline-block;
			padding:0px 10px 0 2px;
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

		.sred {
			color: red;
		}
		.addDiv{
			width: 100px;
			height: 20px;
			color: #FFFFFF;
			background-color: #17BDB0;
			border-radius: 12px;
			text-align: center;
			margin:auto;
			line-height: 20px;
			cursor: pointer;
			margin-top:5px;
			margin-bottom: 5px;
		}
	</style>
</head>
<body style="overflow: auto;">
<input id="fileuid" style="display: none;">
<table id="table" class="bbTable"  style="height: 80%;">
	<tbody>
	<tr>
		<td><span class="sred">*</span>年度</td>
		<td>
			<input type="text" id="yr"   style="width: 100px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
		</td>
	</tr>
	<tr>
		<td>行政区</td>
		<td>
			<select id="ad_cd" name="pram">
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

	</tbody>
</table>

<div id="problemDiv" style="width:100%;">
</div>
<div id="midDiv" class="addDiv" onclick="addProblemTr()">添加问题</div>
<table id="filetable" class="bbTable"  style="height: 15%;">
	<tbody>
	<tr>
		<td><div align="center">文件上传:</div>      <div align="center"></div></td>
		<td style="text-align: center;">
			<input id='file1' class="file" id='file' type='file' multiple></input>
		</td>
	</tr>
	</tbody>
</table>

<div style="height: 5%; position: absolute; left: 35%;margin-top: 7px">
	<div id="bbbcButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:30px;margin-right: 385px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;' onclick="saveDbBase()">
		保存
	</div>
</div>

</body>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
	var hid = "<%=id%>";

</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/ysde/wtqd/addFile.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/multselect/jquery.mselect.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/verify/verify.js"></script>
</html>