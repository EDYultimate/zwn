<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>定额值</title>
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
    <div class="sc_div"  style="width: 155px;">
        标准:
        <select id="ad_cd" class="sc_input">
            <option value="">全部</option>
            <option value="000000">国家</option>
            <option value="110000">北京市</option>
            <option value="120000">天津市</option>
            <option value="130000">河北省</option>
            <option value="140000">山西省</option>
       </select>
    </div>


    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 285px;">
        行业类别: <input type="text" id="hytp" class="sc_input"   style="width: 180px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">定额标准</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
            <td style="width:15%;">定额名称</td>
            <%--<td style="width:10%;">省（自治区、直辖市）</td>--%>
            <td style="width:10%;">区域</td>
            <td style="width:15%;">行业类别</td>
            <td style="width:15%;">行业名称</td>
            <%--<td style="width:15%;">用水类型</td>--%>
            <td style="width:15%;">产品名称</td>
            <td style="width:10%;">通用值</td>
            <td style="width:10%;">先进值</td>
            <td style="width:10%;">单位</td>
            <td style="width:10%;">备注</td>
            <td style="width:10%;">操作</td>
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
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/ysde/dez/dez.js"></script>
</html>
