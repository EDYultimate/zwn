<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>达标名录</title>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        table{table-layout:fixed;}
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        textarea {
            height:650px;
            line-height:35px;
            font-size:16px;
            border: none;
            width:100%;
            resize:none;
            background-color:#EEF3F6;
            overflow:auto;
            font-family: 微软雅黑;
        }

    </style>
</head>
<body>

<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%;width:98%;"   id="dydiv">

    <%--<div style='float:left;margin:0px 20px;'><span id="zzmsSpan"></span>汇总描述:</div>--%>
    <%--<div style='height:20px;margin-top:3px;text-align:right;float:right;width:40px;'>
        <img id='ztqkEdit' onclick='ztqkEdt()' style='width:15px;height:15px;cursor:pointer;' title='编辑' src='/hwwr/images/index/bj_07.png'></img>
    </div>--%>

    <div id='textareaDiv' style='height:650px;margin-left:20px;'>
        <textarea id='textarea'   disabled="disabled"></textarea>
    </div>



</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/lygk/jsgk/jsgk.js"></script>
</html>
