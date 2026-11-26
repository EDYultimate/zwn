<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>通知文件</title>
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
    <div class="sc_div"  style="width: 160px;">
        年份: <input type="text" id="yr" class="sc_input"   style="width: 100px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>

    &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
        类型：
        <select id="type" class="sc_input">
            <option value="">全部</option>
            <option value="1">年度计划与总结</option>
            <option value="2">工作交流</option>
            <option value="3">会议讲话</option>
            <option value="4">首页展示图片</option>
        </select>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 255px;">
        名称: <input type="text" id="nm" class="sc_input"   style="width: 180px;">
    </div>



    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">资料图库</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
            <td style="width:25%;">名称</td>
            <td style="width:20%;">简介</td>
           <%-- <td style="width:10%;">颁布年份</td>
            <td style="width:10%;">修订年份</td>--%>
            <td style="width:15%;">类型</td>
            <td style="width:10%;">年份</td>
            <td style="width:10%;">上传人</td>
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
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/zlk/zlk.js"></script>
</html>
