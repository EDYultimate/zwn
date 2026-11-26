<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>取水户</title>
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
    <script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
    <script type="text/javascript">
        var basePath = "<%=basePath%>";
    </script>
    <style type="text/css">
        .conent {
            overflow-y: auto;
        }

        .M-box .active, .M-box1 .active, .M-box2 .active, .M-box3 .active, .M-box4 .active {
            width: 25px;
            height: 25px;
            line-height: 25px;
        }

        .M-box a, .M-box1 a, .M-box2 a, .M-box3 a, .M-box4 a {
            width: 25px;
            height: 25px;
            line-height: 25px;
        }

        .tolSpan {
            line-height: 25px;
        }
    </style>
</head>
<body style="height: 100%">

<div class="searchDiv">

    <div class="sc_div"  style="width: 155px;">
        取水户: <input type="text" id="wiu_nm" class="sc_input" >
    </div>

    <input type="button" value="查询" class="s_input" onclick="maketable()">
</div>

<div class="conent" style="width: 100%;height: calc(100vh - 110px);">
    <table id="table" class="bbTable"  style="overflow: hidden;table-layout: fixed;">
        <thead>
        <tr>
            <th data-field="wiu_cd" display="hide" style="display:none">id</th>
            <th data-field="rn" style="width: 50px;">序号</th>
            <th data-field="wiu_nm" >取水户</th>
            <th data-field="opt" style="width: 100px;">操作</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
</body>

<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath%>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/spgcgl/xpwf/dialog/wiu.js"></script>
</html>