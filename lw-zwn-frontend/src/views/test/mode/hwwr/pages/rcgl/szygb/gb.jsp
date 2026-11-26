<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">
    <title>水资源公报</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
</head>
<style>
    .liTab {
        width:120px;
    }
</style>
<body style="margin-right: 0px;">
<div class="right_menu">
    <ul id="smap"  style="margin-bottom: 0px;">
   <%--     <li id="l0" class="liTab  clickLiTab"><span>历年公报</span></li>
        <li id="l7" class="liTab"><span>数据分析</span></li>--%>
       <li id="l7" class="liTab  clickLiTab"><span>数据分析</span></li>
        <li id="l1" class="liTab"><span>供水量</span></li>
        <li id="l2" class="liTab"><span>用水量</span></li>
        <li id="l0" class="liTab "><span>历年公报</span></li>
        <%--        <li id="l3" class="liTab"><span>耗水量</span></li>
                <li id="l4" class="liTab"><span>排污量</span></li>
                <li id="l5" class="liTab"><span>降水量</span></li>
                <li id="l6" class="liTab"><span>水资源量</span></li>--%>

    </ul>
</div>

<center class="conent"  style="margin-top: 0px;">
    <div class="frameDiv">
        <%--<iframe id="iframe" src="<%=basePath %>pages/lyzg/szygb/szygb.jsp"></iframe>--%>

        <iframe id="iframe" src="<%=basePath %>pages/rcgl/szygb/gbsl/gbsl.jsp"></iframe>

    </div>
</center>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/szygb/gb.js"></script>
</html>