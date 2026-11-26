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
    <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
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
    <div class="sc_div"  style="width: 255px;">
        单位: <input type="text" id="workplace" class="sc_input"   style="width: 180px;">
    </div>
    <%--<div class="sc_div" style="width:210px">
        文件类型：
        <select id="fw" class="sc_input">
            <option value="">全部</option>
            <option value="1">法律</option>
            <option value="2">行政法规和法规性文件</option>
            <option value="3">部门规章</option>
            <option value="4">规范性文件</option>
            <option value="5">工作性文件</option>
        </select>
    </div>
    &nbsp;&nbsp;--%>
    <div class="sc_div"  style="width: 255px;">
        姓名: <input type="text" id="nm" class="sc_input"   style="width: 180px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
    <input type="button" value="打印" class="sb_input"  onclick="printpage()">
    <input type="button" value="导出" class="sb_input" onclick="dlexcel()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%"  id="dydiv">
    <div class="titleDiv">专家库</div>
    <table class="bbTable"  id="dytable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
            <td style="width:10%;">姓名</td>
            <td style="width:20%;">单位</td>
            <td style="width:10%;">职称/职务</td>
            <td style="width:10%;">办公电话</td>
            <%--<td style="width:10%;">传真</td>--%>
            <td style="width:10%;">手机号码</td>
            <td style="width:20%;">通讯地址</td>
            <td style="width:8%;">操作</td>
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
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/lygk/zjk/zjk.js"></script>
</html>