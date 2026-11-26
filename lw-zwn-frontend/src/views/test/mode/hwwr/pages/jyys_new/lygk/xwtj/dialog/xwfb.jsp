<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>通讯录</title>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        table{table-layout:fixed;}
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}

        .titleDiv {
            height: 40px;
            font: 16px Verdana, "Microsoft YaHei";
            border: none;
            color: #404c5b;
            font-weight: bold;
            line-height: 40px;
            text-align: center;
        }

    </style>
</head>
<body>


<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%"   id="dydiv">
    <div class="titleDiv">本月节水新闻<br>发布数量少于2条</div>
   <%-- <table class="bbTable" id="dytable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
            <td style="width:40%;">标题</td>
            <td style="width:10%;">水信息网</td>
            <td style="width:10%;">海河水利</td>
            <td style="width:10%;">全国节约用水办公室官网</td>
            <td style="width:10%;">节水护水在行动</td>
            <td style="width:10%;">水利部官网</td>
        </tr>

        </thead>
        <tbody id="tbody">
        </tbody>
    </table>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>--%>
</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
</html>
