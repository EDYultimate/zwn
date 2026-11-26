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
    <link rel="stylesheet" href="<%=basePath%>common/css/ztree/zTreeStyle/zTreeStyle.css" type="text/css">
    <script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath%>common/js/common.js"></script>
    <script>
        var basePath = '<%=basePath%>';

    </script>
    <title>供水量</title>

    <style type="text/css">
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #ced5d6;
        }
        .check {
            height: 15px;
            width: 20px;
        }
        .ckin {
            width: 20px;
        }
        .ztree li span.button.chk.checkbox_true_part {
            background-position:-14px 0
        }
        .ztree li span.button.chk.checkbox_false_part {
            background-position: 0 0;
        }
        /*为了适配国产系统火狐浏览器*/
        .bbTable {
            border-collapse: separate;
        }
    </style>

</head>
<body>
<div class="searchDiv">
    &nbsp;&nbsp;
    <div class="sc_div">
        分类：
        <select id="qs_xzq" class="sc_input">
            <option value="l5">全流域</option>
            <option value="l1">省级行政区</option>
            <option value="l6">地市级行政区</option>
            <option value="l2">水资源二级区</option>
            <option value="l4">水资源三级区</option>
            <option value="l3">省套三级区</option>
        </select>
    </div>

    <div id="typediv" class="sc_div" style="display: none">
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

    <div style="width: 190px; float: left; height: calc(100% - 110px); margin-top: 20px; ">
        <ul id="tree" class="ztree" style="height: 90%;"></ul>
    </div>

    <div style="width: calc(100% - 190px); float: right; height: calc(100% - 62px); overflow-y: auto ">
        <div    style="height:800px;">
            <div style="text-align: center;">
                <span id="gbtitle">海河流域分区水资源情况</span><span style="font-size: 13px">(亿m³)</span>
            </div>
            <div style="width: 100%; overflow-x: auto;">
                <table id="table" class="bbTable" >
                    <thead id="theads">

                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>


            <div id="charts" style="width: 99%; height: 500px; margin-top: 20px;margin-bottom: 20px;">


            </div>
        </div>
    </div>

</div>

</body>
<script type="text/javascript" src="<%=basePath%>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.core.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.excheck.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/szygb/common/types.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/szygb/gsl/gsl.js"></script>

</html>