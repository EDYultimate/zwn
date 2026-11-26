<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>监督检查</title>
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
            width: 20px;
            height: 20px;
            background-repeat: no-repeat;
            background-image: url('<%=basePath %>images/index/bj_07.png');
            float: left;
            cursor: pointer;
        }
        .viewdiv  {
            width: 20px;
            height: 20px;
            background-repeat: no-repeat;
            background-image: url('<%=basePath %>pages/rcgl/jdjc/icon/check.png');
            float: left;
            cursor: pointer;
        }

    </style>

</head>
<body style="background-color: #fff;">

<div class="searchDiv">

    <div class="sc_div" style="width:160px">
       巡检年份：
        <input id="tyear" type="text" class="sc_input" style="width: 80px;" onfocus="WdatePicker({isShowClear:false,dateFmt:'yyyy'})" >
    </div>

    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="addCheck()">
    <!-- <input type="button" value="添加" class="a_input" onclick="add()"> -->
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    
    <div id="stable" style="height: 100%">
     <table id="table" class="bbTable"  style="overflow: hidden;table-layout: fixed;">
        <thead>
        <tr>
            <th style="width: 40px;">序号</th>
             <th  style='width:100px'>巡查人员</th>
             <th  style='width:260px'>巡查日期</th>
            <th style="width: 50px;">操作</th>
        </tr>
        </thead>
        <tbody id="Sztbody">
        </tbody>
    </table>
    </div>
    
  
</center>
  <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/jdjc/xcTab.js"></script>
</html>

