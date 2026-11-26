<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath%>common/js/common.js"></script>
    <script>
        var basePath = '<%=basePath%>';

    </script>
    <title>排污量</title>

    <style type="text/css">
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #ced5d6;
        }
    </style>
</head>
<body>
<div class="searchDiv">
    &nbsp;&nbsp;
    <div class="sc_div">
        分类：
        <select id="qs_xzq" class="sc_input">
            <option value="l1">行政区</option>
            <option value="l2">水资源Ⅱ级区</option>
            <option value="l3">水资源Ⅲ级区</option>
        </select>
    </div>

    <div class="sc_div">
        分区:
        <input id="typename" type="text" class="sc_input" onclick="openDlg()">
    </div>

    <div class="sc_div" style="width: 280px;">
        时间：
        <input type="text" id="btm" name="datemonth" class="sc_input sc_input_fix" onclick="WdatePicker({ dateFmt: 'yyyy'})">
        --
        <input type="text" id="etm" name="datemonth" class="sc_input" onclick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>
    <!-- 查询 -->
    <input type="button" value="查询" class="s_input" onclick="search()">
</div>

<div>
    <div style="width: 48%; float: left; height: calc(100% - 110px); margin-top: 10px;">
        <div style="text-align: center;">
            <span>海河流域分区降水量</span><span style="font-size: 13px">(亿m³)</span>
        </div>
        <div style="overflow: auto;height: calc(100% - 22px);">
            <table id="table" class="bbTable" >
                <thead>
                <tr id="theads">

                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
    <div style="width: 48%; float: right; height: calc(100% - 110px); margin-top: 10px;">
        <div id="charts" style="width: 100%; height: 100%">


        </div>
    </div>
</div>

</body>
<script type="text/javascript" src="<%=basePath%>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/szygb/common/types.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/szygb/jsl/jsl.js"></script>

</html>