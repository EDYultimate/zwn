<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String pid = request.getParameter("pid")==null?"":request.getParameter("pid");
      String yr = request.getParameter("yr")==null?"":request.getParameter("yr");
      String wpc_cd = request.getParameter("wpc_cd")==null?"":request.getParameter("wpc_cd");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'detialProblemByWpc.js.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
    <script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
  </head>
  <script type="text/javascript">
        var basePath = "<%=basePath%>";
        var pid = "<%=pid%>";
        var yr = "<%=yr%>";
        var wpc_cd = "<%=wpc_cd%>";
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
<body style="height: 100%">
 <div id="tableDiv" class="conent" style="width: 100%;height: calc(100vh - 110px);">
 <table class="bbTable"  style="overflow: hidden;table-layout: fixed;">
 <thead>
        <tr>
            <th style="width: 50px;">序号</th>
            <th colspan='4'>详情</th>
        </tr>
        </thead>
        <tbody id="table">
        </tbody>
 </table>
 </div>
  </body>

<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath%>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/jdjc/dialog/detialProblemByWpc.js"></script>
</html>
