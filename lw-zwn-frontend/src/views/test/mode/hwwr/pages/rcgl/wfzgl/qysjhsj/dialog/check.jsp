<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String wpc_cd = request.getParameter("wpc_cd")==null?"":request.getParameter("wpc_cd");
String year = request.getParameter("tyear")==null?"":request.getParameter("tyear");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用水计划及实际用水</title>
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
	<link rel="stylesheet"  href="<%=basePath %>common/js/multselect/mselect.css" >
<script type="text/javascript">
	var basePath = "<%=basePath%>";
	var wpc_cd = "<%=wpc_cd%>";
	var year = "<%=year%>";
</script>
<style type="text/css">
	
	html{
	  height:100%;
	  margin-top:5px;
	  margin-bottom:20px;
	}
	tr {
	    cursor: auto;
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


	.bbTable>tbody>tr>td, th {
    height: 5px;
    padding: 0px 0px;

    }

    .bbTable>tbody>tr {
    height: 5px;
    }

	.select_multi .select_multi_li {
		height: 24px;
		line-height: 23px;
		font-size: 12px;
		margin-right: 4px;
	}
	.select_multi input {
		margin-top: 4px;
	}
	.select_multi {
		padding-bottom: 0px;
	}
	.rspan {
		border-bottom: 1px solid black;
		float: right;
		cursor: pointer;
		height: 20px;
		width: 67px;
	}

	.inputtm {
		margin-top: 20px;
		width: 140px;
	}
	.buttontm {
		font-size: 14px;
		padding: 0px 10px 0px 10px;
		height: 25px;
		width: 50px;
		margin-top: 15px;
	}

    input {
	  height: 20px;
	  width: 50px;
	}
	
	tbody>tr>td{
	   height: 25px;
	}
	
</style>
</head>
<body style="height:100%">

<div id="clooseTM" style="width: 200px;height: 60px; display: none">
	<div style="text-align: center;">
		<input id="choose_tm" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"  class="inputtm">
	</div>
</div>

	 <div style="overflow:auto;height:90%;">
		<table id="table" class="bbTable" style="height: 100%;" >
			<tbody>
				<tr>
					<td colspan='5'>取水项目名</td><td colspan='13'><input id="prj_nm" style="width:300px;"></input></td>
				</tr>
				<tr>
					<td colspan='5'>取水许可证编号</td><td colspan='13'><input id="wpc_sn"  style="width:300px;"></input></td>
				</tr>
				<tr>
					<td colspan='5'>取水权人</td><td colspan='13'><input id="wrp_nm" style="width:300px;"></input></td>
				</tr>
			    <tr>				
					<td colspan='5'>法人代表人</td><td colspan='13'><input id="lr_nm" style="width:300px;"></input></td>
				</tr>
				<tr>			
					<td colspan='5'>联系人</td><td colspan='13'><input id="draw_staff" style="width:300px;"></input></td>
				</tr>
				<tr>
					<td colspan='5'>联系电话</td><td colspan='13'><input id="draw_tel" style="width:300px;"></input></td>
				</tr>
				<tr>
					<td colspan='5'>计划用水管理动态信息</td><td colspan='13'><input id="type_id" style="width:300px;"></input></td>
				</tr>

				<tr>
					<td rowspan="" id="yearInfo">取水户动态信息</td>
				</tr>
				<tr>
					<td colspan="17"><!-- <button onclick="addInfo()">+</button> --></td>
				</tr>
			</tbody>
		</table>

	</div>
		
	 <div style="height: 5%; position: absolute; bottom: 2%; left: calc(50% - 118px);margin-bottom:0.5%;">
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
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/qysjhsj/dialog/template.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/qysjhsj/dialog/check.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/verify/verify.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/spgcgl/qsxk/dialog/jquery.cusSelect.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</html>