<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>支付记录</title>
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
    <div class="sc_div"  style="width: 160px;">
        年份: <input type="text" id="yr" class="sc_input"   style="width: 100px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>

  <%--  &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
        类型：
        <select id="fw" class="sc_input">
            <option value="">全部</option>
            <option value="11">法律法规</option>
            <option value="12">政策文件</option>
            <option value="13">标准规范</option>

        </select>
    </div>   --%>
    &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
        业务分类：
        <select id="fw" class="sc_input">
           <%-- <option value="">全部</option>
            <option value="1">计划用水管理</option>
            <option value="2">县域节水型社会达标建设</option>
            <option value="3">用水定额</option>
            <option value="4">重点监控用水单位</option>
            <option value="5">节水评价</option>
            <option value="6">节水考核</option>
            <option value="7">节水载体创建</option>--%>
        </select>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 255px;">
       项目名称: <input type="text" id="nm" class="sc_input"   style="width: 180px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input" onclick="search()">
  <%--  <input type="button" value="添加" class="a_input" onclick="newAdd()">--%>
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">项目评审验收</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:5%;"  >序号</td>
            <td style="width:10%" >年份</td>
            <td style="width:15%" >项目名称</td>
            <td style="width:10%;" >类型</td>
            <td style="width:10%;" >已完成阶段</td>
            <td style="width:10%;" >中期评审时间</td>
            <td style="width:10%;" >评审意见</td>
            <td style="width:10%;" >合同验收时间</td>
            <td style="width:10%;" >合同验收意见</td>
            <td style="width:10%;" >操作</td>
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
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ztyj/psys/psys.js"></script>
</html>
