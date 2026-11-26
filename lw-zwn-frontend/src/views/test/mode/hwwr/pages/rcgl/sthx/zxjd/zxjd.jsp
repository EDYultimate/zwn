<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>专项监督</title>
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
        行政区名称：
        <select id="fw" class="sc_input">
            <option value="">全部</option>
            <option value="C000000110000">北京市</option>
            <option value="C000000120000">天津市</option>
            <option value="C000000130000">河北省</option>
            <option value="C000000140000">山西省</option>
            <option value="C000000410000">河南省</option>
            <option value="C000000370000">山东省</option>
            <option value="C000000150000">内蒙古</option>
            <option value="C000000210000">辽宁省</option>
        </select>
    </div>
     &nbsp;&nbsp;
    <div class="sc_div"  style="width: 155px;">
        年份: <input type="text" id="yr" class="sc_input" onclick="WdatePicker({ dateFmt: 'yyyy'})">
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
    <div class="titleDiv">专项监督</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td  style="width:10%;">序号</td>
            <td  style="width:30%;">文件名称</td>
            <td style="width:15%;">年份</td>
            <td style="width:15%;">行政区名称</td>
            <td style="width:15%;">上传时间</td>
            <td style="width:15%;">操作</td>
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
<script type="text/javascript" src="<%=basePath %>pages/rcgl/sthx/zxjd/zxjd.js"></script>
</html>
