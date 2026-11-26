<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>监督检查</title>
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
    <div class="sc_div"  style="width: 140px;">
        年份: <input type="text" id="yr" class="sc_input"   style="width: 80px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>
    &nbsp;&nbsp;
    <div class="sc_div" style="width:160px">
        行政区：
        <select id="ad_cd" class="sc_input">
            <option value="">全部</option>
            <option value="110000">北京市</option>
            <option value="120000">天津市</option>
            <option value="130000">河北省</option>
            <option value="140000">山西省</option>
            <option value="410000">河南省</option>
            <option value="370000">山东省</option>
            <option value="150000">内蒙古自治区</option>
            <option value="210000">辽宁省</option>
        </select>
    </div>
   <%-- &nbsp;&nbsp;
    <div class="sc_div"  style="width: 220px;">
        检查时间 : <input type="text" id="tm" class="sc_input"   style="width: 100px;"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
    </div>--%>

    &nbsp;&nbsp;
    <div class="sc_div" style="width:320px">
        检查时间：
           <input type="text" id="tm" name="datemonth"  class="sc_input sc_input_fix"   onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
           --
           <input type="text" id="etm" name="datemonth"  class="sc_input"  onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})">
    </div>
    &nbsp;&nbsp;
    <div class="sc_div" style="width:230px">
        是否有主任参加：
        <select id="isdirector" class="sc_input">
            <option value="">全部</option>
            <option value="是">是</option>
            <option value="否">否</option>
        </select>
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">监督检查</div>
    <table class="bbTable">
        <thead>
        <tr>
         <%--   <td style="width:5%;">序号</td>
            <td style="width:15%;">项目名称</td>  --%>
            <td style="width:6%;">年份</td>
            <td style="width:8%;">行政区</td>
            <td style="width:16%;">检查时间</td>
            <td style="width:14%;">县（区）</td>
            <td style="width:10%;">进展情况</td>
            <td style="width:10%;">存在问题</td>
            <td style="width:10%;">典型案例</td>
            <td style="width:10%;">是否有主任参加</td>
            <td style="width:8%;">附件</td>
            <td style="width:8%;">操作</td>
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
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/xydb/jdjc/jdjc.js"></script>
</html>
