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
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        table tr:nth-child(even){
			background: #f3f8ff;
			}
       </style>
</head>
<body>

<div class="searchDiv">

    &nbsp;&nbsp;&nbsp;&nbsp;
     <div class="sc_div"  style="width: 255px;">
      	单位类别: 
	      	<select id="units"   style="width: 180px;">
				<option value="">全部</option>
				<option value="1">水利部</option>
				<option value="2">流域机构</option>
				<option value="3">省市水利（务）厅（局）</option>
				<option value="4">环保部门</option>
				<option value="5">其他</option>
			</select>
    </div>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div class="sc_div"  style="width: 255px;">
      	关键字:<input id="expertkey" placeholder="姓名/单位"  style="width: 180px;">
      </div>

    <input type="button" value="查询" class="s_input2" onclick="search()">
    <input type="button" value="添加" class="a_input2" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">专家列表</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td rowspan="2" style="width:40px">序号</td>
            <td rowspan="2">姓名</td>
            <td rowspan="2" style="width:40px">性别</td>
            <td rowspan="2">单位类型</td>
            <td rowspan="2">政治面貌</td>
            <td rowspan="2">专业专长</td>
            <td rowspan="2">单位</td>
            <td rowspan="2">专家类型</td>
            <td rowspan="2">职务/职称</td>
            <td colspan="3">联系方式</td>
            <td rowspan="2">操作</td>
        </tr>
		<tr>
			<td style="border-top: 1px solid #cdd6e2;">手机</td>
			<td style="border-top: 1px solid #cdd6e2;">通讯地址</td>
			<td style="border-top: 1px solid #cdd6e2;">邮箱</td>
		</tr>
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
<script type="text/javascript" src="<%=basePath %>pages/szybh/sjzl/expert_js/expertManage.js"></script>
</html>
