<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String year=request.getParameter("year");
if (year==null) {
	year = "";
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>中央数据统计</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
</script>
	<style type="text/css">
		input {
			height: 15px;
			border-radius: 15px;
			border: 1px solid #E1E1E1;
			text-align: center;
			outline: none;
			color: rgb(4, 84, 195);
			width: 100px;
		}

		.titleDiv{
			height:30px;
			line-height:30px;
		}
		.tabDiv{
			    float:left;
			    height: calc(100% - 30px);
			    border: 1px solid #d3dbde;
		}

		.conent {
			margin-top:0px;
		}



	</style>
</head>
<body>


<div class="searchDiv">
	&nbsp;&nbsp;&nbsp;&nbsp;
	<div class="sc_div"  style="width:280px;"  id="tjtp">
		统计方式:
		<%-- <select id="type"   class="sc_input">
             <option value="yr">年</option>
             <option value="mn">月</option>
         </select>--%>
		<input type="radio" name="radio" value="1" checked="checked"   style="width:40px;" >日
		<input type="radio" name="radio" value="2"   style="width:40px;" >月
		<input type="radio" name="radio" value="3"    style="width:40px;" >年
	</div>

	&nbsp;&nbsp;&nbsp;&nbsp;

	<div class="sc_div" style="width:280px;"  id="dy"  >
	时间：
	<input type="text" id="bdat" name="datemonth" class="sc_input sc_input_fix" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
	--
	<input type="text" id="edat" name="datemonth" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
    </div>


	<div class="sc_div" style="width:280px;display:none;"  id="mn"  >
	时间：
	<input type="text" id="bdat1" name="datemonth" class="sc_input sc_input_fix" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">
	--
	<input type="text" id="edat1" name="datemonth" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">
</div>


	<div class="sc_div" style="width:280px;display:none;"  id="yr">
		时间：
		<input type="text" id="bdat2" name="datemonth" class="sc_input sc_input_fix" onClick="WdatePicker({ dateFmt: 'yyyy'})">
		--
		<input type="text" id="edat2" name="datemonth" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy'})">
	</div>



	&nbsp;&nbsp;&nbsp;&nbsp;

	<input type="button" value="查询" class="s_input" onclick="search()">
</div>
	



	<center   class="conent" style="width: 100%;">
       <div  id="topDiv"  >
				 <%--<div  class="titleDiv" >海委接收中央数据情况 (<span class="cyear"></span>年<span class="cmonth"></span>月)</div>--%>
		       <div  class="titleDiv" >海委接收中央数据情况 </div>
				  <div class="tabDiv"  style="width:39%">
					     <%--<div style="height:30px;">取用水户<a onclick="openSpecialList()" href="javascript:(0);"  class="titleDivTextNumA" i></a></div>--%>
					  <div style="height:30px;"> <a onclick="openList()" href="javascript:(0);">取用水户</a> </div>
					     <div  id="qysh"  style="width:98%;"></div>
				  </div>
		          <div class="tabDiv"  style="width:33%;" >
					    <div style="height:30px;">水功能区</div>
					    <div  id="sgnq"  style="width:98%;"></div>
				  </div>
		          <div class="tabDiv"  style="width:27%;">
					  <div style="height:30px;">水文站</div>
					  <div  id="swz"  style="width:98%;"></div>
				  </div>
		</div>
		<div  id="bottomDiv">
			<%--	<div class="titleDiv">海委上报中央数据情况 (<span class="cyear"></span>年<span class="cmonth"></span>月)</div>--%>
				<div class="titleDiv">海委上报中央数据情况</div>
			<%--	<div   style="width:100%; float:left; height: calc(100% - 30px);">
					<div  id="send"  style="width:98%;margin-top:5px;"></div>
				</div>--%>
				<div class="tabDiv"  style="width:100%;">
					<div  id="send"  style="width:98%;"></div>
				</div>
		</div>

		

		
	</center>
</body>
<script type="text/javascript">
var hwwr = {};
hwwr.basePath = "<%=basePath%>";
hwwr.option = {};
hwwr.option.year = "<%=year%>"
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/lyzg/zysjtj/sjtj.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</html>
