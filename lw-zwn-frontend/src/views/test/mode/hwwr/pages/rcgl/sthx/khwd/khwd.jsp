<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>管理制度考核</title>
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

    &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
        年份：
        <input type="text" id="yr" name="dateyear"   class="sc_input sc_input_fix"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 255px;">
        文件名称: <input type="text" id="filenm" class="sc_input"   style="width: 180px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">文档列表</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:10%;">序号</td>
            <td style="width:50%;">文件名称</td>
            <td style="width:10%;">年份</td>
            <td style="width:20%;">上传时间</td>
            <td style="width:20%;">操作</td>
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
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/sthx/khwd/khwd.js"></script>
</html>
