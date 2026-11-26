<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>定额标准</title>
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
     <div class="sc_div"  style="width: 145px;">
        类型: <select id="ad_nm"   class="sc_input" >
            <option value="">全部</option>
            <option value="国家">国家</option>
            <option value="北京市">北京市</option>
            <option value="天津市">天津市</option>
            <option value="河北省">河北省</option>
            <option value="山西省">山西省</option>
        </select>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 185px;">
        颁布年份: <input type="text" id="yr" class="sc_input"   style="width: 100px;">
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 285px;">
        定额标准名称: <input type="text" id="nm" class="sc_input"   style="width: 180px;">
    </div>



    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">定额标准</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
            <td style="width:8%;">类型</td>
            <td style="width:20%;">定额标准名称</td>
            <td style="width:15%;">标准号</td>
           <%-- <td style="width:10%;">颁布年份</td>
            <td style="width:10%;">修订年份</td>--%>
            <td style="width:15%;">颁布单位</td>
            <td style="width:10%;">颁布时间</td>
            <td style="width:10%;">执行时间</td>
            <td style="width:8%;">是否废止</td>
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
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/ysde/debz/debz.js"></script>
</html>
