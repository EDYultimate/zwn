<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>复验统计</title>
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
    <div class="sc_div"  style="width: 235px;">
       年份: <input type="text" id="yr" class="sc_input"   style="width: 130px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>

  <%--  &nbsp;&nbsp;
    <div class="sc_div"  style="width: 235px;">
       是否海河流域：
        <select id="ishwcc" class="sc_input">
            <option value="">全部</option>
            <option value="0">否</option>
            <option value="1">是</option>
        </select>
    </div>--%>

    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
    <input type="button" value="打印" class="sb_input"  onclick="printpage()">
    <input type="button" value="导出" class="sb_input" onclick="dlexcel()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%"  id="dydiv">
    <div class="titleDiv">复验统计</div>
    <table class="bbTable" id="dytable">
        <thead>
        <tr>
         <%--   <td style="width:8%;">序号</td>
            <td style="width:30%;">省（自治区、直辖市）</td>  --%>
             <td style="width:8%;">年份</td>
             <td style="width:8%;">行政区</td>
             <td style="width:14%;">复验县（区）数量</td>
             <td style="width:70%;">复验县（区）</td>
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
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/xydb/fytj/fytj.js"></script>
</html>
