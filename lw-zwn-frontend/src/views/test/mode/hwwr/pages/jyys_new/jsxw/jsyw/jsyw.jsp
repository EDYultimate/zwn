<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
    <link rel="stylesheet" href="../jsxw.css" type="text/css">
    <script>var basePath = '<%=basePath%>';</script>
    <title>Title</title>
    <style>
        a {
            text-decoration: none;
            color: black;
        }
        a:hover{
            text-decoration:underline;
            color: blue;
        }


    </style>
</head>
<body>
<div class="searchDiv">
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 255px;">
        新闻标题: <input type="text" id="jsTitle" class="sc_input"   style="width: 180px;">
    </div>

    <input type="button" value="查询" class="s_input" onclick="search()">
 <%--   <input type="button" value="配置抓取关键词" class="sb_input" style="width: auto;right: 10px;position: absolute;" onclick="openKWS()">--%>
</div>
<center class="conent" style="overflow:auto;padding-bottom:10px;height:90%">
    <div class="titleDiv">节水要闻</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
            <td style="width:50%;">新闻标题</td>
            <td style="width:15%;">发布时间</td>
            <td style="width:15%;">来源</td>
            <td style="width:15%;">操作</td>
        </tr>

        </thead>
        <tbody id="tbody">

        </tbody>
    </table>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
</center>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script src="<%=basePath %>pages/jyys_new/jsxw/newsView.js"></script>
<script src="jsyw.js"></script>
</html>
