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
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}</style>
</head>
<body>

<div class="searchDiv">

    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 205px;">
     <%--   批次（年份）: <input type="text" id="yr" class="sc_input"   style="width: 130px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">--%>
         批次：
         <select id="batch"  class="sc_input">
             <option value="">全部</option>
             <option value="第一批">第一批</option>
             <option value="第二批">第二批</option>
             <option value="第三批">第三批</option>
             <option value="第三批">第三批</option>
             <option value="第五批">第五批</option>
             <option value="第六批">第六批</option>
             <option value="第七批">第七批</option>
             <option value="第八批">第八批</option>
             <option value="第九批">第九批</option>
             <option value="第十批">第十批</option>
         </select>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 150px;">
         年份: <input type="text" id="yr" class="sc_input"   style="width: 80px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 235px;">
       是否海河流域：
        <select id="ishwcc" class="sc_input">
            <option value="">全部</option>
            <option value="1">是</option>
            <option value="0">否</option>
        </select>
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
    <input type="button" value="打印" class="sb_input"  onclick="printpage()">
    <input type="button" value="导出" class="sb_input" onclick="dlexcel()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%"   id="dydiv">
    <div class="titleDiv">达标名录</div>
    <table class="bbTable" id="dytable">
        <thead>
        <tr>
         <%--   <td style="width:8%;">序号</td>
            <td style="width:30%;">省（自治区、直辖市）</td> --%>
             <td style="width:8%;">行政区</td>
             <td style="width:8%;">批次</td>
             <td style="width:8%;">年份</td>
             <td style="width:76%;">达标县（区）</td>
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
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/xydb/dbml/dbml.js"></script>
</html>
