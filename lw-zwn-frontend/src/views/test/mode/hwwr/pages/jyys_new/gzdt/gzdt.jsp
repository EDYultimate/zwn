<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>工作动态</title>
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
    <div class="sc_div" style="width:280px">
        年份：
        <input type="text" id="yr" name="datemonth"  class="sc_input"   onClick="WdatePicker({ dateFmt: 'yyyy'})"
     <%--   <input type="text" id="btm" name="datemonth"  class="sc_input sc_input_fix"   onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
        --
        <input type="text" id="etm" name="datemonth"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">--%>
    </div>


   <%-- &nbsp;&nbsp;
        <div class="sc_div" style="width:210px">
        业务分类：
        <select id="area" class="sc_input">
            <option value="">全部</option>
            <option value="1"   selected>海委县域达标</option>
            <option value="2">用水定额</option>
            <option value="3">计划用水</option>
            <option value="4">重点监控用水单位</option>
            <option value="5">节水评价</option>
            <option value="6">节水考核</option>
            <option value="7">节水载体创建</option>
        </select>
    </div>--%>
    &nbsp;&nbsp;

    <div class="sc_div"  style="width: 255px;">
        工作总结计划: <input type="text" id="nm" class="sc_input"   style="width: 180px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
   <%-- <input type="button" value="导出" class="a_input" onclick="dlexcel()">--%>
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">工作动态</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
   <%--         <td style="width:15%;">开始时间</td>
            <td style="width:15%;">结束时间</td>--%>
            <td style="width:15%;">时间</td>
            <td style="width:50%;">工作动态概要</td>
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
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/gzdt/gzdt.js"></script>
</html>