<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>取用水计划及实际用水</title>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/customtable/simpletable.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        table{table-layout:fixed;}
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        .editdiv  {
            width: 30px;
            height: 30px;
            background-repeat: no-repeat;
            background-image: url('<%=basePath %>images/icon/edit.png');
            float: left;
            cursor: pointer;
        }
    </style>

</head>
<body>

<div class="searchDiv">

    <div class="sc_div" style="width:140px">
        年度：
        <input id="tyear" type="text" class="sc_input" style="width: 80px;" onfocus="WdatePicker({isShowClear:false,dateFmt:'yyyy'})" >
    </div>
    <div class="sc_div" style="width:185px">
        取水权人：
        <input type="text" id="wrp_nm" class="sc_input">
    </div>
    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="新建" class="s_input" onclick="add()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div id="stable" style="overflow:auto"></div>
     <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div>
</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/qysjhsj/qysjhsj.js"></script>
</html>

