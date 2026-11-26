<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>专家随机筛选</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
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
    <div class="sc_div" >
      	方案名称: 
	   <select type="text" id="fanm" class="sc_input">
	   		<option value="">全部</option>
	   </select>
    </div>
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
				<option value="生产行业专家">环境保护</option>
			</select>
    </div>

     <div class="sc_div"  style="width: 300px;">
      	推荐省/机构: 
	      	<select id="ad"   style="width: 180px;">
				<option value="">全部</option>			
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
			</select>
    </div>
 <!--    <div class="sc_div" >
      	随机人数: 
	   <input type="text" id="personnum" class="sc_input">
    </div> -->
        <input type="button" value="查询" class="s_input" onclick="getFaPersonList()">
    <input type="button" value="新建方案" style="background-position-x: 10px" class="a_input" onclick="selectList()">
            <input type="button" value="随机添加" style="background-position-x: 10px" class="a_input" onclick="setpersonmum()">
        <input type="button" value="删除方案" style="background-position-x: 10px" class="d_input" onclick="delFaBasic()">
<!--         <input type="button" value="导出" style="background-position-x: 10px;width:70px" class="d_input" onclick="dc()">
 -->    
</div>
<center class="conent" style="overflow:auto;padding-bottom:10px;height:75%">
    <div class="titleDiv"><span id="fatext"></span>专家列表</div>
    
    <table class="bbTable" style="height:10px">
        <thead id="theadtd">
        <tr>
            <td rowspan="1" style="width:40px">序号</td>
            <td rowspan="1">姓名</td>
            <td rowspan="1" style="width:40px">性别</td>
            <td rowspan="1">专业专长</td>
            <td rowspan="1">单位</td>
            <td rowspan="1">专家类型</td>
            <td rowspan="1">推荐省/机构</td>
            <td rowspan="1">职务/职称</td>
            <td rowspan="1">操作</td>
        </tr>
        </thead>
        <tbody id="tbody">

        </tbody>
    </table>
</center>
  </body>
  <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/expert/faList.js"></script>
</html>
