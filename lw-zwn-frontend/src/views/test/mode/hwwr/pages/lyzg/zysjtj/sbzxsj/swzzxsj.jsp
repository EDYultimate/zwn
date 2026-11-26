<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String date = request.getParameter("date");
    String type = request.getParameter("type");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">

    <title></title>

    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
    <meta http-equiv="description" content="This is my page">
    <link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">

    <script>
        var basePath = '<%=basePath%>';
        var date = '<%=date%>';
        var type = '<%=type%>';
    </script>
</head>

<body>
<div class="searchDiv">
     时间：<input type="text" id="tm" name="tm"  onclick="WdatePicker({ dateFmt: 'yyyy-MM'})">
    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="init()">
</div>
<div id="mainDiv" style="padding: 10px 0 0 0px;">
    <table id="table1" class="bbTable">
        <thead>
        <tr>
            <th data-field="ROWNUM">序号</th>
            <th data-field="NM">站名</th>
            <th data-field="CD">编号</th>
            <th data-field="LASTDATE">最新数据时间</th>
            <th data-field="NT">站点情况</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script src="<%=basePath%>/pages/lyzg/zysjtj/sbzxsj/swzzxsj.js" type="text/javascript"></script>
</html>
