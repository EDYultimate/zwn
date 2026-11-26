<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2020/11/1
  Time: 14:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title</title>
</head>
<body>
<%
    //获得请求中的日期值
    String msg=(String)request.getAttribute("errormessage");
    out.println("当前消息为："+msg);
%>
</body>
</html>
