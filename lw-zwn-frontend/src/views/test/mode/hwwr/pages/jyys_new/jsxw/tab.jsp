<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <script>var basePath = '<%=basePath%>';</script>
    <title>Title</title>
</head>
<body>
<div class="right_menu" style="margin-left:10px">
    <ul>
        <li id="zl" class="liTab clickLiTab"><span>总览</span></li>
        <li id="jsyw" class="liTab"><span>节水要闻</span></li>
        <li id="hwdt" class="liTab"><span>海委动态</span></li>
        <li id="lydt" class="liTab"><span>流域动态</span></li>
    </ul>
</div>

<div class="conent">
    <div class="frameDiv">
        <iframe id="iframe" src="<%=basePath%>pages/jyys_new/jsxw/zl/zl.jsp"></iframe>
    </div>
</div>
<%--<div>
    <div style="font-size: 20px; font-weight: bolder; padding: 10px 20px">站点导航</div>
    <div style="padding-left: 20px;">
        <div style="float:left;width: 200px;"><a href="http://qgjsb.mwr.gov.cn/" target="_blank">全国节约用水办公室</a></div>
        <div style="float:left;width: 200px;"><a href="http://swj.beijing.gov.cn/" target="_blank">北京市水务局</a></div>
        <div style="float:left;width: 200px;"><a href="http://swj.tj.gov.cn/" target="_blank">天津市水务局</a></div>
        <div style="float:left;width: 200px;"><a href="http://slt.hebei.gov.cn/" target="_blank">河北省水利厅</a></div>
        <div style="float:left;width: 200px;"><a href="http://slt.shanxi.gov.cn/" target="_blank">山西省水利厅</a></div>
    </div>
</div>--%>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/jsxw/tab.js"></script>
</html>
