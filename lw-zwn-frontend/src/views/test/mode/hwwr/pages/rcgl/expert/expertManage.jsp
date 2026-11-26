<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>专家库</title>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        table{table-layout:fixed;}
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}</style>
</head>
<body>

<div class="searchDiv">
<!--     &nbsp;&nbsp;
    <div class="sc_div"  style="width: 255px;">
      专家姓名: <input type="text" id="expertnm" class="sc_input"   style="width: 180px;">
    </div> -->
    &nbsp;&nbsp;&nbsp;&nbsp;
    <div class="sc_div" >
      	单位: 
	   <input type="text" id="dw" class="sc_input">
    </div>
      <div class="sc_div"  style="width: 255px;">
      	专家类型: 
	      	<select id="exptype"  style="width: 180px;">
				<option value="">全部</option>
				<option value="水利专业专家">水利专业专家</option>
				<option value="生产行业专家">生产行业专家</option>
				<option value="环境保护">环境保护</option>
			</select>
    </div>
    &nbsp;&nbsp;&nbsp;&nbsp;
     <div class="sc_div"  style="width: 300px;">
      	推荐省/机构: 
	      	<select id="ad"   style="width: 180px;">
				<option value="">全部</option>
<!-- 				<option value="海河流域">海河流域</option>
 -->				
 				<option value="漳河上游管理局">漳河上游管理局</option>
				<option value="海河下游管理局">海河下游管理局</option>
				<option value="漳卫南局">漳卫南运河管理局</option>
				<option value="引滦局">引滦工程管理局</option> 
				<option value="北京">北京</option>
				<option value="天津">天津</option>
				<option value="河北">河北</option>
				<option value="山西">山西</option>
				<option value="内蒙">内蒙</option>
				<option value="辽宁">辽宁</option>
				<option value="山东">山东</option>
				<option value="河南">河南</option>
			<!-- 	<option value="13">其他</option> -->
			</select>
    </div>

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
    <input type="button" value="随机方案" style="background-position-x: 10px" class="a_input" onclick="searchFaList()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">专家列表</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td rowspan="2" style="width:40px">序号</td>
            <td rowspan="2">姓名</td>
            <td rowspan="2" style="width:40px">性别</td>
<!--             <td rowspan="2">出生日期</td> -->
<!--             <td rowspan="2">政治面貌</td> -->
            <td rowspan="2">专业专长</td>
            <td rowspan="2">单位</td>
            <td rowspan="2">专家类型</td>
            <td rowspan="2">推荐省/机构</td>
            <td rowspan="2">职务/职称</td>
<!--             <td colspan="3">联系方式</td> -->
           <!--  <td rowspan="2">备注</td> -->
            <td rowspan="2">操作</td>
        </tr>
<!-- 		<tr> -->
<!-- 			<td style="border-top: 1px solid #cdd6e2;">手机</td> -->
<!-- 			<td>通讯地址</td> -->
<!-- 			<td>邮箱</td> -->
<!-- 		</tr> -->
        </thead>
        <tbody id="tbody">

        </tbody>
    </table>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/expert/expertManage.js"></script>
</html>
