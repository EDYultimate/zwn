<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String id = request.getParameter("id");
%>
<html>
<head>
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        #newsTitle, #info {
            width: 70%;
            text-align: center;
            margin: 0 auto;
        }
        .news-details {
            padding: 20px 50px;
        }
        .bshare-custom, .icon-medium, .printClose {
            display: none;
        }
        .item-detail p {
    		text-indent: 2rem;
		}
        .TRS_Editor p {
    		text-indent: 2rem;
		}
    </style>
    <title></title>
</head>
<body style="overflow: auto;">
<h2 id="newsTitle"></h2>
<br>
<div id="info">
    <span id="publicDate"></span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="source"></span>
</div>
<div class="news-details"></div>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script>
    var param = {};
    param.id = '<%=id%>';
    jQuery.getJSON(basePath+"jyys/jsxw/getSingleNews",param,function(result){
        if (result.length > 0) {
            $('#newsTitle').html(result[0]['JS_TITLE']);
            $('#publicDate').html('发布时间：'+result[0]['JS_DATE']);
            $('#source').html('新闻来源：'+result[0]['JS_SOURCE']);
            $('.news-details').html(result[0]['JS_CONTENT']);
        }
    })
</script>
</html>