<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<title>水资源公报</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">

<style type="text/css"  rel="stylesheet">
#moduleitems {
    text-shadow: #fff 0 1px 0;
}

#moduleitems ul {
    position: relative;
    display: block;
    height: auto;
    font-size: 14px;
}

#moduleitems ul li {
    float: left;
    padding: 7px 7px;
    margin: 3px;
    text-align: left;
    line-height: 1.25em;
    color: #333;
    height: 40px;
    width: 220px;
    border-top: 0px solid transparent;
    cursor: pointer;
}

table, tr, td {
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
}

ol, ul {
    list-style: none;
}

img, body, html {
    border: 0;
}

img {
    border: 0px;
    vertical-align: middle;
}

#moduleitems ul li img {
    margin-bottom: 1px;
}

.itemname {
    font-weight: bold;
    color: rgb(13, 111, 199);
    font-size: 12px;
}

</style>


<script>var basePath = '<%=basePath%>';</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/lyzg/szynb/dialog/nbfile.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
</head>
  <body >

<div id="moduleitems" style="overflow: auto;">

<ul  id="gpmenu" class="gpmenu">
</ul>

</div>

  </body>
</html>