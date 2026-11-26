<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta charset="UTF-8">
	<title>审批过程管理</title>
	<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
	<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
	<link rel="stylesheet" href="<%=basePath %>common/js/multselect/mselect.css">
	<style type="text/css">

		tr {
			cursor: auto;
		}

		th {
			/*background-clip: padding-box*/
			background-color: white;
		}

		td {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow-x: hidden;
			background-color: white;
			/*background-clip: padding-box;*/
		}

		.deldiv  {
			width: 30px;
			height: 30px;
			background-repeat: no-repeat;
			background-image: url(./icon/del.png);
			float: left;
			cursor: pointer;
			margin-left:12px;
		}

		.editdiv  {
			width: 30px;
			height: 30px;
			background-repeat: no-repeat;
			background-image: url(./icon/edit.png);
			float: left;
			cursor: pointer;
		}
       /* .induction{
            font-weight:bold;
            margin-top:10px;
            height: 30px;

        }*/

		::-webkit-scrollbar {
			width: 10px;
			height: 10px;
		}

		::-webkit-scrollbar-thumb {
			background-color: #cacdce;
		}

		@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
			/* IE10+ specific styles go here */
		}

		/*@media screen and (-webkit-min-device-pixel-ratio:0) {*/
		/*	#table th.fixtitle:after{*/
		/*		border-top: 1px solid #cdd6e2;*/
		/*		border-bottom: 1px solid #cdd6e2;*/
		/*		border-right: 1px solid #cdd6e2;*/
		/*		position: absolute;*/
		/*		content: '';*/
		/*		top: 50%;*/
		/*		left: calc(50% - 0px);*/
		/*		transform: translate(-50%, -50%);*/
		/*		width: calc(100% - 1px);*/
		/*		height: calc(100% - 1px);*/
		/*	}*/
		/*	#table td.fixtitle:after{*/
		/*		border-bottom: 1px solid #cdd6e2;*/
		/*		border-right: 1px solid #cdd6e2;*/
		/*		position: absolute;*/
		/*		content: '';*/
		/*		top: 50%;*/
		/*		left: calc(50% - 1px);*/
		/*		transform: translate(-50%, -50%);*/
		/*		width: calc(100% - 0px);*/
		/*		height: calc(100% - 1px);*/
		/*	}*/
		/*}*/

		.bbTable {
			border-collapse: separate;
		}
	</style>


</head>
<body>

<div class="searchDiv">
	<div class="sc_div"  style="width: 155px;">
		许可证状态：<select id="expired"  class="sc_input"  style="width: 60px;">
		<option value="">全部</option>
		<option value="1">过期</option>
		<option value="2">有效</option>
	</select>
	</div>
	<!-- 	  	<div class="sc_div"  class="sc_div"  style="width: 170px;">
                   取水用途：
                   <select id="int_use"  class="sc_input"  style="width: 90px;">
                      <option value="">全部</option>
                      <option value="生活">生活</option>
                      <option value="农业">农业</option>
                      <option value="工业">工业</option>
                      <option value="发电">发电</option>
                      <option value="供热">供热</option>
                      <option value="煤化工生产">煤化工生产</option>
                  </select>
              </div> -->
	<!--   		<div class="sc_div"  style="width: 240px;">
                时间：
                <input type="text"  id="int_bd"  class="sc_input sc_input_fix"  style="width: 80px;height: 38px;"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
                --
                <input type="text"  id="int_dl"  class="sc_input"  style="width: 80px;height: 38px;" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
            </div> -->
	<%--		<div class="sc_div"  style="width: 175px;">--%>
	<%--			年份：--%>
	<%--			<input type="text"  id="int_year"  class="sc_input"  style="width: 80px;" value="2018" onClick="WdatePicker({ dateFmt: 'yyyy'})">--%>
	<%--		</div>--%>

	<div class="sc_div"  style="width: 120px;">
		年份：<input type="text" id="tyear"  class="sc_input" style="width: 60px;" onclick="WdatePicker({ dateFmt: 'yyyy'})">
	</div>
	<div class="sc_div"  style="width: 220px;">
		取水水源：<input type="text" id="wf_nm"  class="sc_input" style="width: 140px;" readonly>
<%--			<option value="再生水地表水">再生水地表水</option>--%>
<%--			<option value="再生水矿坑排水">再生水矿坑排水</option>--%>
<%--			<option value="地下水">地下水</option>--%>
<%--			<option value="地下水（矿坑排水）">地下水（矿坑排水）</option>--%>
<%--			<option value="地表水">地表水</option>--%>
<%--			<option value="地表水地下水">地表水地下水</option>--%>
<%--			<option value="地表水（再生水）">地表水（再生水）</option>--%>
<%--			<option value="浅层地下水（傍河取水）">浅层地下水（傍河取水）</option>--%>
	</div>
	<div class="sc_div"  style="width: 220px;">
		取水权人名称：<input type="text" id="wrp_nm"  class="sc_input" style="width: 80px;">
	</div>
	<div class="sc_div"  style="width: 180px;">
		取水许可证：<input type="text" id="wpc_sn"  class="sc_input" style="width: 80px;">
	</div>
	<div class="sc_div"  style="width: 170px;">
		<%--监管单位：<input type="text" id="conc_org"  class="sc_input" style="width: 80px;">--%>
		监管单位：<select id="conc_org"  class="sc_input"  style="width: 60px;">
			<option value="">全部</option>
			<option value="海委本级">海委本级</option>
			<option value="漳卫南局">漳卫南局</option>
			<option value="引滦局">引滦局</option>
			<option value="下游局">下游局</option>
			<option value="上游局">上游局</option>
			<option value="河北">河北</option>
			<option value="北京">北京</option>
			<option value="天津">天津</option>
			<option value="山西">山西</option>
			<option value="河南">河南</option>
			<option value="山东">山东</option>
			<option value="内蒙">内蒙</option>
			<option value="辽宁">辽宁</option>
		</select>
	</div>
	<div class="sc_div"  style="width: 130px;">
		行政区：<select id="ad_nm"  class="sc_input"  style="width: 60px;">
			<option value="">全部</option>
			<option value="北京">北京</option>
			<option value="天津">天津</option>
			<option value="河北">河北</option>
			<option value="山西">山西</option>
			<option value="河南">河南</option>
			<option value="山东">山东</option>
			<option value="内蒙">内蒙</option>
			<option value="辽宁">辽宁</option>
		</select>
	</div>
	<div class="sc_div"  style="width: 170px;">
		水资源分区：<select id="wrz_nm"  class="sc_input"  style="width: 60px;">
			<option value="">全部</option>
			<option value="滦河及冀东沿海">滦河及冀东沿海</option>
			<option value="海河北系">海河北系</option>
			<option value="海河南系">海河南系</option>
			<option value="徒骇马颊河">徒骇马颊河</option>
		</select>
	</div>
	<div class="sc_div"  style="width: 170px;">
		是否超许可：<select id="isexceed"  class="sc_input"  style="width: 60px;">
		<option value="">全部</option>
		<option value="超许可">超许可</option>
	</select>
	</div>

	<input type="button" value="查询" class="s_input" onclick="maketable()">
	<input type="button" value="新建" class="sb_input" onclick="add()">
	<input type="button" value="下载表格" class="sb_input" style="width: 100px;padding: 0px 17px 0 17px;" onclick="dlexcel()">
</div>
<div  class ='induction' style="width: 100%;">
        取水许可证共计 <span id="total">0</span>个，其中
	有效<span id="valid">0</span> 个，
	过期 <span id="expire">0</span>个；
	年许可水量总计<span id="totalw">0</span>万m³,其中
	超许可水量<span id="count">0</span> 个。
</div>
<div   class="conent" style="width: 100%;height: calc(100% - 122px);overflow: scroll;">
	<!-- <div class="titleDiv" style="height:70px">
        <span id="cyear"></span><span></span>
    </div> -->
	<table id="table" class="bbTable"  style="overflow: hidden;table-layout: fixed; width: 5000px;">
		<thead>
		<tr>
			<th data-field="WPC_CD" display="hide" style="display:none">取水许可证代码</th>
			<th data-field="no" style='width: 60px; padding: 0px;' class="fixtitle">序号</th>
			<th data-field="EXPIRED" display="hide" style="display:none">证件状态</th>
			<th data-field="EXPIRED_NM" style="padding: 0px;width: 85px;" class="fixtitle">证件状态</th>
			<th data-field="WPC_SN"     style='padding: 0px; width: 215px;'  class="fixtitle">取水许可证编号</th>
			<th data-field="WRP_NM" style="width: 300px;" class="fixtitle">取水权人</th>
			<th data-field="control"  style="width: 85px;" class="fixtitle" >操作</th>
			<th data-field="dlfile"  style="width: 85px;" class="fixtitle">附件下载</th>
			<th data-field="HW_CTRL">海委托省管理</th>
			<th data-field="CONC_ORG">监管单位</th>
			<th data-field="AD_NM">行政区</th>
			<th data-field="WRZ_NM">水资源二级分区</th>
			<th data-field="TH_LEVEL">水资源三级分区</th>
			<th data-field="INT_NM">取水口</th>
			<th data-field="INT_ADDR_D">取水口所在地</th>
			<th data-field="INT_ADDR_MAP">取水口经纬度</th>
			<th data-field="CHK_INT_MET">取水方式</th>
			<th data-field="WF_NM">取水水源</th>
			<th data-field="WW">年许可水量<br>（万m³）</th>
			<th data-field="W">年累计取水量<br>（万m³）</th>
			<th data-field="INT_USE">取水用途</th>
			<th data-field="MAX_Q">最大流量<br>(m3/秒)</th>
			<th data-field="IRR_A">灌溉面积及<br>用水规模<br>（万亩）</th>
			<th data-field="RW_ADDR">退水地点</th>
			<th data-field="RW_ADDR_MAP">退水点经纬度</th>
			<th data-field="RW_W">退水量<br>（t/d)</th>
			<th data-field="RW_WQ_REQ">退水水质要求</th>
			<th data-field="IS_WR_WRA">是否开展<br>水资源论证</th>
			<th data-field="WR_WRA_NM">水资源论证<br>报告名称</th>
			<th data-field="WR_WRA_ORG">水资源论证报告<br>编制单位</th>
			<th data-field="WR_WRA_TM">水资源论证<br>审查时间</th>
			<th data-field="INT_BD">有效期<br>起始时间</th>
			<th data-field="INT_DL">有效期<br>结束时间</th>
<%--			<th data-field="control">操作</th>
			<th data-field="dlfile" >附件下载</th>--%>
		</tr>
		</thead>
		<tbody>
		</tbody>
	</table>

	<center>
		<div id="echart" style="height:320px;width:400px;margin-top: 20px;margin-bottom: 20px;">

		</div>
	</center>


</div>

</body>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/byxkz/byxkz.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/multselect/jquery.mselect.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/common.js"></script>
</html>