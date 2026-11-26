<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String wiu_cd = request.getParameter("wiu_cd");
    String id = request.getParameter("id");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">

    <title>用水分析</title>

    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    <link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>
        var basePath = '<%=basePath%>';
        var wiu_cd = '<%=wiu_cd%>';
    </script>
</head>

<body>
<div class="searchDiv">
    年份：<input type="text" id="yr" name="year" onclick="WdatePicker({ dateFmt: 'yyyy'})">
    <%--<span>-</span>
    <input type="text" id="endTm" name="year" onClick="WdatePicker({ dateFmt: 'yyyy',minDate:'#F{$dp.$D(\'beginTm\')}'})">--%>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="init()">
</div>
<div id="mainDiv" style="padding: 10px 0 0 0px;">
    <div id="leftDiv" style="width:250px;max-height:400px;overflow-y:auto;float:left;overflow-y:scroll">
        <table class="bbTable">
            <thead>
            <tr>
                <td>月份</td>
                <td>计划用水量<br>(万m³)</td>
                <td>实际用水量<br>(万m³)</td>
            </tr>
            </thead>
            <tbody id="tbody">
            <tr>

            </tr>
            </tbody>
        </table>
    </div>
    <div id="rightDiv" style="float:right;height:400px;"></div>
</div>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script src="<%=basePath%>pages/jyys_new/ywsj/zdjkysdw/ysqk/qysjksj/dialog/ysfx.js" type="text/javascript"></script>
</html>
