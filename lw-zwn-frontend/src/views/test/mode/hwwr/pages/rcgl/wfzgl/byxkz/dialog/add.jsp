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
		<div style="display: none;"><input id="WIU_CD" /></div>
	
		<table id="table" class="bbTable"  style="height: 80%;">
			<tbody>
				<tr>
					<td>取水许可证编号</td><td><input id="WPC_SN"></td>
					<td>取水权人名称</td><td onclick="wiuPage()"><input id="WRP_NM" disabled style="background-color: white;"></td>
					<td>证件状态</td>
					<td>
						<select id="CERT_COND" style="width:55px">
							<option value="1">新增</option>
							<option value="2">变更</option>
							<option value="5">延续</option>
							<option value="3">注销</option>
							<option value="4">吊销</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>取水起始日期</td><td><input id="INT_BD"   onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"></td>
					<td>取水终止日期</td><td><input id="INT_DL"   onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"></td>
					<td>海委托省管理</td>
					<td>
						<select id="HW_CTRL" style="width:55px">
							<option value="是">是</option>
							<option value="否">否</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>监管单位</td><td><input id="CONC_ORG"></td>
					<td>行政区</td>
					<td>
						<select id="AD_NM">
							<option value="">无</option>
							<option value="北京">北京</option>
							<option value="天津">天津</option>
							<option value="河北">河北</option>
							<option value="山西">山西</option>
							<option value="河南">河南</option>
							<option value="山东">山东</option>
							<option value="内蒙">内蒙</option>
							<option value="辽宁">辽宁</option>
						</select>
					</td>
					<td>水资源分区</td>
					<td>
						<select id="WRZ_NM">
							<option value="">无</option>
							<option value="滦河及冀东沿海">滦河及冀东沿海</option>
							<option value="海河北系">海河北系</option>
							<option value="海河南系">海河南系</option>
							<option value="徒骇马颊河（二级）">徒骇马颊河（二级）</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>三级分区</td>
					<td>
						<select id="TH_LEVEL">
							<option value="">无</option>
							<option value="子牙河平原">子牙河平原</option>
							<option value="漳卫河平原">漳卫河平原</option>
							<option value="滦河平原及冀东沿海诸河">滦河平原及冀东沿海诸河</option>
							<option value="永定河册田水库以上">永定河册田水库以上</option>
							<option value="大清河淀东平原">大清河淀东平原</option>
							<option value="大清河淀西平原">大清河淀西平原</option>
							<option value="漳卫河山区漳卫河平原">漳卫河山区漳卫河平原</option>
							<option value="漳卫河山区">漳卫河山区</option>
							<option value="子牙河山区">子牙河山区</option>
							<option value="黑龙港及运东平原">黑龙港及运东平原</option>
							<option value="滦河山区">滦河山区</option>
							<option value="徒骇马颊河">徒骇马颊河</option>
						</select>
					</td>
					<td>取水口</td><td><input id="INT_NM"></td>
					<td>取水口所在地</td><td><input id="INT_ADDR_D"></td>
				</tr>
				<tr>
					<td>取水口经纬度</td><td><input id="INT_ADDR_MAP"></td>
					<td>取水方式</td><td><input id="CHK_INT_MET"></td>
					<td>取水水源</td><td><input id="WF_NM"></td>
				</tr>
				<tr>
					<td>年许可水量</td><td><input id="WW"></td>
					<td>取水用途</td><td><input id="INT_USE"></td>
					<td>最大流量(m3/秒)</td><td><input id="MAX_Q"></td>
				</tr>
				<tr>
					<td>灌溉面积及用水规模(万亩)</td><td><input id="IRR_A"></td>
					<td>退水地点</td><td><input id="RW_ADDR"></td>
					<td>退水点经纬度</td><td><input id="RW_ADDR_MAP"></td>
				</tr>
				<tr>
					<td>退水量(t/d)</td><td><input id="RW_W"></td>
					<td>退水水质要求</td><td><input id="RW_WQ_REQ"></td>
					<td>是否开展水资源论证</td>
					<td>
						<select id="IS_WR_WRA" style="width:55px">
							<option value="是">是</option>
							<option value="否">否</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>水资源论证报告名称</td><td><input id="WR_WRA_NM"></td>
					<td>水资源论证报告编制单位</td><td><input id="WR_WRA_ORG"></td>
					<td>水资源论证审查时间</td><td><input id="WR_WRA_TM"   onclick="WdatePicker({ dateFmt: 'yyyy/M/d'})"></td>
				</tr>
			</tbody>
		</table>

	<%--	<table id="filetable" class="bbTable"  style="height: 15%;">
				<tbody>
					<tr style="height:90px">
						<td style="width:102px">
								<a href="javascript:;" class="a-upload">
									<input id="uploadfile" type="file" name="files" >上传文件
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
		</table>--%>
		
		<div style="height: 6%; position: absolute; bottom: 2%; left: 35%;">
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
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/byxkz/dialog/add.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>