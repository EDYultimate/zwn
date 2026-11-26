<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String id = request.getParameter("id");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>审批过程管理</title>
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
<link rel="stylesheet"  href="<%=basePath %>common/js/multselect/mselect.css" >
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
	var id = "<%=id%>";
</script>
<style type="text/css">
	tr {
	    cursor: auto;
	}
	
	input {

	}
	
	
	.a-upload {
	    position: relative;
	    background: #fafafa;
	    overflow: hidden;
	    display: inline-block;
	    padding: 10px 20px 0 20px;
	    border-radius: 5px;
	    border: 1px solid #E1E1E1;
	    background-color: rgba(2, 194, 153, 1);
	    outline: none;
	    color: #FFFFFF;
	    height: 30px;
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

    .select_multi .select_multi_li {
        height: 24px;
        line-height: 23px;
        font-size: 12px;
		margin-right: 4px;
		display: flow-root;
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

	.bbTable1{
		border-collapse:collapse;
		border-spacing:0;
		border-left:1px solid #E1E1E1;
		border-top:1px solid #E1E1E1;
		border-bottom:1px solid #E1E1E1;
		font-family: "Microsoft YaHei","微软雅黑","sans-serif";
		width: 100%;
		color: #404c5b;
		/* font: 14px Verdana, "Microsoft YaHei"; */
	}
	.bbTable1>thead>tr>td, th{
		height:25px;
		background-color:#fcfdfe;
		border-right:1px solid #cdd6e2;
		padding:5px 15px;
		text-align: center;
		font-size: 15px;
		font-weight: bold;
		color: #404c5b;
	}
	.bbTable1>tbody>tr>td, th{
		height:25px;
		border:1px solid #cdd6e2;
		font-size:14px;
		text-align: center;
	}
	.bbTable1>tbody>tr>td>input{
		height:25px;
		border-radius: 5px;
		border: 1px solid #E1E1E1;
		text-align: center;
		outline:none;
		color:rgb(4, 84, 195);
		width:98%
	}
	.bbTable1>tbody>tr>td>select{
		height:25px;
		border-radius: 5px;
		border: 1px solid #E1E1E1;
		text-align: center;
		outline:none;
		color:rgb(4, 84, 195);
		width:98%
	}
</style>
</head>


<body>

    <div id="clooseTM" style="width: 200px;height: 60px; display: none">
        <div style="text-align: center;">
            <input id="choose_tm" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"  class="inputtm">
        </div>
    </div>

	<table id="table" class="bbTable1" >
		<tbody>
		<tr>
			<td width="30%"><span class="sred">*</span>申请人</td>
			<td width="20%" title="文字"><input id="apply_nm"/></td>
			<td width="30%"><span class="sred">*</span>行政区</td>
			<td width="20%">
				<select id="ad_nm" >
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
		</tr>
		<tr>
			<td><span class="sred">*</span>水资源分区</td>
			<td>
				<select id="wrz_nm" >
					<option value="滦河及冀东沿海">滦河及冀东沿海</option>
					<option value="海河北系">海河北系</option>
					<option value="海河南系">海河南系</option>
					<option value="徒骇马颊河（二级）">徒骇马颊河（二级）</option>
				</select>
			</td>
			<td><span class="sred">*</span>三级分区</td>
			<td>
				<select id="th_level" >
					<option value="滦河山区">滦河山区</option>
					<option value="滦河平原及冀东沿海诸河">滦河平原及冀东沿海诸河</option>
					<option value="北三河山区">北三河山区</option>
					<option value="永定河册田水库以上">永定河册田水库以上</option>
					<option value="永定河册田水库至三家店区间">永定河册田水库至三家店区间</option>
					<option value="北四河下游平原">北四河下游平原</option>
					<option value="大清河山区">大清河山区</option>
					<option value="大清河淀西平原">大清河淀西平原</option>
					<option value="大清河淀东平原">大清河淀东平原</option>
					<option value="子牙河山区">子牙河山区</option>
					<option value="子牙河平原">子牙河平原</option>
					<option value="漳卫河山区">漳卫河山区</option>
					<option value="漳卫河平原">漳卫河平原</option>
					<option value="黑龙港及运东平原">黑龙港及运东平原</option>
					<option value="徒骇马颊河">徒骇马颊河</option>
				</select>
			</td>
		</tr>
		<tr>
			<td><span class="sred">*</span>取水口</td><td title="文字"><input id="int_nm"/></td>
			<td><span class="sred">*</span>取水口所在地</td><td title="文字"><input id="int_addr_d"/></td>
		</tr>
		<tr>
	<%--		<td>取水口经度(度分秒)</td><td><input id="int_addr_lgtd"/></td>
			<td>取水口纬度(度分秒)</td><td><input id="int_addr_lttd"/></td>--%>
			<td>取水口经度(XX°XX′XX″)</td><td><input id="int_addr_lgtd"/></td>
			<td>取水口纬度(XX°XX′XX″)</td><td><input id="int_addr_lttd"/></td>
		</tr>
		<tr>
			<td><span class="sred">*</span>取水方式</td><td title="文字"><input id="chk_int_met"/></td>
			<td><span class="sred">*</span>取水水源</td><td title="文字"><input id="wf_nm"/></td>
		</tr>
		<tr>
			<td><span class="sred">*</span>申请水量（万m³)</td><td title="数字"><input id="ww"></input></td>
			<td><span class="sred">*</span>取水用途</td><td title="文字"><input id="int_use"></input></td>
		</tr>
		<tr>
			<td>相应定额</td><td title="文字"><input id="relevant_norm"/></td>
			<td><span class="sred">*</span>取水工程最大流量(m³/秒)</td><td title="数字"><input id="max_q"/></td>
		</tr>
		<tr>
			<td>灌溉面积及用水规模（万亩）</td><td title="数字"><input id="irr_a"/></td>
			<td>退水地点</td><td title="文字"><input id="rw_addr"/></td>
		</tr>
		<tr>
			<%--<td>退水口经度(度分秒)</td><td title="文字"><input id="rw_addr_lgtd"/></td>
			<td>退水口纬度(度分秒)</td><td title="文字"><input id="rw_addr_lttd"/></td>--%>
			<td>退水口经度(XX°XX′XX″)</td><td title="文字"><input id="rw_addr_lgtd"/></td>
			<td>退水口纬度(XX°XX′XX″)</td><td title="文字"><input id="rw_addr_lttd"/></td>
		</tr>
		<tr>
			<td>退水量（万m³)</td><td title="数字"><input id="rw_w"/></td>
			<td>退水水质要求</td>
			<td>
				<select id="rw_wq_req" >
					<option value="Ⅰ类">Ⅰ类</option>
					<option value="Ⅱ类">Ⅱ类</option>
					<option value="Ⅲ类">Ⅲ类</option>
					<option value="Ⅳ类">Ⅳ类</option>
					<option value="Ⅴ类">Ⅴ类</option>
					<option value="劣Ⅴ类">劣Ⅴ类</option>
				</select>
			</td>
		</tr>
		<tr>
			<td>水资源论证</td>
			<td>
				<select id="is_wr_wra">
					<option value="是">是</option>
					<option value="否">否</option>
				</select>
			</td>
			<td>水资源论证报告书</td><td title="文字"><input id="wr_wra_nm"/></td>
		</tr>
		<tr>
			<td>编制单位</td><td title="文字"><input id="wr_wra_org"/></td>
			<td>许可决定时间</td><td><input id="deter_tm" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/></td>
		</tr>
		<tr>
			<td><span class="sred">*</span>取水许可管理动态信息</td>
			<td title="文字"><input id="type_id" /></td>
		</tr>


		</tbody>
	</table>


<%--		<table id="table" class="bbTable"  style="height: 80%;">
			<tbody>
				<tr>
					<td><span class="sred">*</span>申请人</td><td><input id="apply_nm"></input></td>
					<td><span class="sred">*</span>行政区</td>
					<td>
						<select id="ad_nm" style="width:55px">
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
					<td><span class="sred">*</span>水资源分区</td>
					<td>
						<select id="wrz_nm" style="width:130px">
							<option value="滦河及冀东沿海">滦河及冀东沿海</option>
							<option value="海河北系">海河北系</option>
							<option value="海河南系">海河南系</option>
							<option value="徒骇马颊河（二级）">徒骇马颊河（二级）</option>
						</select>
					</td>
					<td><span class="sred">*</span>三级分区</td>
					<td>
						<select id="th_level" style="width:130px">
							<option value="滦河山区">滦河山区</option>
							<option value="滦河平原及冀东沿海诸河">滦河平原及冀东沿海诸河</option>
							<option value="北三河山区">北三河山区</option>
							<option value="永定河册田水库以上">永定河册田水库以上</option>
							<option value="永定河册田水库至三家店区间">永定河册田水库至三家店区间</option>
							<option value="北四河下游平原">北四河下游平原</option>
							<option value="大清河山区">大清河山区</option>
							<option value="大清河淀西平原">大清河淀西平原</option>
							<option value="大清河淀东平原">大清河淀东平原</option>
							<option value="子牙河山区">子牙河山区</option>
							<option value="子牙河平原">子牙河平原</option>
							<option value="漳卫河山区">漳卫河山区</option>
							<option value="漳卫河平原">漳卫河平原</option>
							<option value="黑龙港及运东平原">黑龙港及运东平原</option>
							<option value="徒骇马颊河">徒骇马颊河</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><span class="sred">*</span>取水口</td><td><input id="int_nm"></input></td>
					<td><span class="sred">*</span>取水口所在地</td><td><input id="int_addr_d"></input></td>
					<td>取水口经度</td><td><span style="font-size: 12px;">例:110.393911</span><br><input id="int_addr_lgtd"></input></td>
					<td>取水口纬度</td><td><span style="font-size: 12px;">例:23.3622</span><br><input id="int_addr_lttd"></input></td>
				</tr>
				<tr>
					<td><span class="sred">*</span>取水方式</td><td><input id="chk_int_met"></input></td>
					<td><span class="sred">*</span>取水水源</td><td><input id="wf_nm"></input></td>
					<td><span class="sred">*</span>申请水量</td><td><input id="ww"></input></td>
					<td><span class="sred">*</span>取水用途</td><td><input id="int_use"></input></td>
				</tr>
				<tr>
					<td>相应定额</td><td><input id="relevant_norm"></input></td>
					<td><span class="sred">*</span>取水工程最大流量(m3/秒)</td><td><input id="max_q"></input></td>
					<td>灌溉面积及用水规模（万亩）</td><td><input id="irr_a"></input></td>
					<td>退水地点</td><td><input id="rw_addr"></input></td>
				</tr>
				<tr>
					<td>退水口经度</td><td><span style="font-size: 12px;">例:110.393911</span><br><input id="rw_addr_lgtd"></input></td>
					<td>退水口纬度</td><td><span style="font-size: 12px;">例:23.3622</span><br><input id="rw_addr_lttd"></input></td>
					<td><span class="sred">*</span>退水量（t/d)</td><td><input id="rw_w"></input></td>
					<td>退水水质要求</td><td><input id="rw_wq_req"></input></td>
				</tr>
				<tr>
					<td>水资源论证</td>
					<td>
						<select id="is_wr_wra" style="width:55px">
							<option value="是">是</option>
							<option value="否">否</option>
						</select>
					</td>
					<td>水资源论证报告书</td><td><input id="wr_wra_nm"></input></td>
					<td>编制单位</td><td><input id="wr_wra_org"></input></td>
					<td>许可决定时间</td><td><input id="deter_tm" onclick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"></input></td>
				</tr>
				<tr>
					<td><span class="sred">*</span>取水许可管理动态信息</td>
					<td colspan="2">
						<input id="type_id" style="width: 200px"></input>
					</td>
				</tr>
			</tbody>
		</table>--%>

	<%--	<table id="filetable" class="bbTable" >
				<tbody>
					<tr style="height:90px">
						<td style="width:130px">
								<a href="javascript:;" class="a-upload">
									<input id="uploadfile" type="file" name="files" >上传批复文件
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
		
		<div style="height: 5%; position: absolute; bottom: 4%; left: 35%;">
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
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/verify/verify.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/spgcgl/qsxk/dialog/add.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/spgcgl/qsxk/dialog/jquery.cusSelect.js"></script>
</html>