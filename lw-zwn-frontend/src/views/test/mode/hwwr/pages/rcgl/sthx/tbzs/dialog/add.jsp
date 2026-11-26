<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String sthxDate = request.getParameter("sthxDate");
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
	var sthxDate = "<%=sthxDate%>";
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
	
<!-- 		<table id="table" class="bbTable"  style="height: 80%;margin-top:5px;">
			<tbody>
				<tr>
					<div style="margin-left:20px">
							行政区: <select id="AD_CD" style="width:70px">
				  			<option value="110000">北京</option>
				  			<option value="120000">天津</option>
				  			<option value="130000">河北</option>
				  			<option value="140000">山西</option>
				  			<option value="150000">内蒙古</option>
				  			<option value="210000">辽宁</option>
				  			<option value="370000">山东</option>
				  			<option value="410000">河南</option>
				  		</select>
					</div>
				</tr>
				<tr>
					<td colspan="4">用水总量(亿立方米)</td>
					<td colspan="4">万元工业增加值用水量降幅(%)</td>
				</tr>
				<tr>
					<td style="width: 102px;">目标值</td><td><input id="YSZLMB"></input></td>
					<td>核查值</td><td><input id="YSZLSJ" ></input></td>
					<td style="width: 102px;">目标值</td><td><input id="GYNDMB"></input></td>
					<td>核查值</td><td><input id="GYNDSJ" ></input></td>
				</tr>
				<tr>
					<td colspan="4">农田灌溉水有效利用系数</td>
					<td colspan="4">功能区水质达标率(%)</td>
				</tr>
				<tr>
					<td style="width: 102px;">目标值</td><td><input id="NTLYMB"></input></td>
					<td>核查值</td><td><input id="NTLYSJ" ></input></td>
					<td style="width: 102px;">目标值</td><td><input id="SGNQMB"></input></td>
					<td>核查值</td><td><input id="SGNQSJ" ></input></td>
				</tr>
			</tbody>
		</table> -->
		
		<table id="table" class="bbTable"  style="height: 80%;margin-top:5px;">
			<tbody>
				<tr >
					<div style="margin-left:10px;margin-top:5px;">
						年份: <input id="sthxDate"   onclick="WdatePicker({onpicked: loadData, dateFmt: 'yyyy'})"></input>
					</div>
				</tr>
				<tr>
					<td rowspan='2'>省份</td>
					<td colspan="2">用水总量(亿立方米)</td>
					<td colspan="2">万元工业增加值用水量降幅(%)</td>
					<td colspan="2">农田灌溉水有效利用系数</td>
					<td colspan="2">功能区水质达标率(%)</td>
				</tr>
				<tr>
					<td >目标值</td>
					<td >核查值</td>
					<td >目标值</td>
					<td >核查值</td>
					<td >目标值</td>
					<td >核查值</td>
					<td >目标值</td>
					<td >核查值</td>
				</tr>
				<tr id="110000">
					<td>北京</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
				<tr id="120000">
					<td>天津</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
				<tr id="130000">
					<td>河北</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
				<tr id="140000">
					<td>山西</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
				<tr id="150000">
					<td>蒙古</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
				<tr id="210000">
					<td>辽宁</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
				<tr id="370000">
					<td>山东</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
				<tr id="410000">
					<td>河南</td>
					<td><input name="YSZLMB" style="width:65px"></input></td>
					<td><input name="YSZLSJ" style="width:65px"></input></td>
					<td><input name="GYNDMB" style="width:65px"></input></td>
					<td><input name="GYNDSJ" style="width:65px"></input></td>
					<td><input name="NTLYMB" style="width:65px"></input></td>
					<td><input name="NTLYSJ" style="width:65px"></input></td>
					<td><input name="SGNQMB" style="width:65px"></input></td>
					<td><input name="SGNQSJ" style="width:65px"></input></td>
				</tr>
			</tbody>
		</table>
		
		<div style="height: 5%; position: absolute; bottom: 12%; left: 35%;">
			<input type="button" value="取消" class="sb_input" style="width:90px" onclick="cancel()">
			<input type="button" value="保存" class="sb_input" style="width:90px;margin-left:50px" onclick="save()">
		</div>
	
</body>

<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/sthx/tbzs/dialog/add.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>