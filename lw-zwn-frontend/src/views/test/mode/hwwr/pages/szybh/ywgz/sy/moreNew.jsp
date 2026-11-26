<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String tp = request.getParameter("tp");
    String source_url = request.getParameter("source_url");

%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
    <link rel="stylesheet" href="../jsxw.css" type="text/css">
    <script>
    var basePath = '<%=basePath%>';
    var tp = '<%=tp%>';
    var source_url = '<%=source_url%>';

    </script>
    <title>Title</title>
    <style>
        a {
            text-decoration: none;
            color: black;
        }
        a:hover{
            text-decoration:underline;
            color: blue;
        }
.conent h3 {
    color: #023373;
    font-size: 22px;
    padding: 0 95px;
    height: 60px;
    line-height: 60px;
        display: inline;
   
}
.item-list {
    margin-top: 20px;
    width: 100%;
    height: auto;
    padding: 0 40px;
    box-sizing: border-box;
    float: none;
}
ul {
   padding:0 100px;
   min-width:800px
}
.main-item ul li {
    line-height: 42px;
    padding-left: 16px;
    position: relative;
    cursor:pointer
}
a:link {
    color: #444444;
    text-decoration: none;
}
.fr {
    float: right;
}
.main-item ul li {
    line-height: 42px;
    padding-left: 16px;
    position: relative;
}
    </style>
</head>
<body>

<div class="conent" style="overflow:auto;padding-bottom:10px;height:90%">
   <div style="background-color: #eaeaea;">
   <div style="text-align:center"><span style="cursor:pointer;float:left"  onclick="tobackPage();">《返回</span><h3  class="active"></h3></div>
   </div>
   <div class="main-item item-list">
                <ul id="tbody">
                
                </ul>
    <!-- <table class="bbTable">
        <thead>
        <tr>
            <td style="width:5%;">序号</td>
            <td style="width:50%;">新闻标题</td>
            <td style="width:15%;">发布时间</td>
            <td style="width:15%;">来源</td>
            <td style="width:15%;">操作</td>
        </tr>

        </thead>
        <tbody id="tbody">

        </tbody>
    </table> -->
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
</div>
</body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script src="<%=basePath %>pages/szybh/ywgz/sy/moreNew.js"></script>
<script src="moreNew.js"></script>
</html>
