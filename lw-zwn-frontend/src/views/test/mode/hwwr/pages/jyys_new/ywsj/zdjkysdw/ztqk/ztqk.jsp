<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>达标名录</title>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        table{table-layout:fixed;}
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}

   /*     .bbTable{
            margin:0px 20px;
        }*/

        tr{
            height:35px;
        }

        textarea {
            line-height:35px;
            font-size:16px;
            border: none;
            width:100%;
            resize:none;
            background-color:#EEF3F6;
            overflow:auto;
            font-family: 微软雅黑;
        }

    </style>
</head>
<body>

<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%;width:98%;"   id="dydiv">

    <%--<div style='float:left;margin:0px 20px;'><span id="zzmsSpan"></span>汇总描述:</div>--%>
    <div style='height:20px;margin-top:3px;text-align:right;float:right;width:60px;'>
        <img id='ztqkEdit' onclick='ztqkEdt()' style='width:60px;height:20px;cursor:pointer;' title='编辑' src='/hwwr/images/index/ztqkbj-01.png'></img>
    </div>

    <div id='textareaDiv' style='height:250px;margin-left:20px;'>
        <textarea id='textarea'  style='height:225px;'  readonly='readonly'></textarea>
    </div>

    <div style='float:left;margin-left:20px;'><span id="tmSpan"></span>汇总列表:</div>
    <table class="bbTable" id="dytable"  style="margin-left:20px;width:98%;">
        <thead>
        <tr>
         <%--   <td style="width:8%;">序号</td>
            <td style="width:30%;">省（自治区、直辖市）</td> --%>
             <td rowspan='2' style="width:10%;">类别</td>
             <td colspan='5'  style="width:50%;">京津冀晋数量</td>
             <td rowspan='2'  style="width:10%;">全国数量</td>
             <td rowspan='2' style="width:15%;">京津冀晋占全国比例</td>

        </tr>
        <tr>
            <td style="width:10%;border-top:1px solid #E1E1E1">北京市</td>
            <td style="width:10%;border-top:1px solid #E1E1E1">天津市</td>
            <td style="width:10%;border-top:1px solid #E1E1E1">河北省</td>
            <td style="width:10%;border-top:1px solid #E1E1E1">山西省</td>
            <td style="width:10%;border-top:1px solid #E1E1E1">合计</td>
        </tr>

        </thead>
        <tbody id="tbody">

        </tbody>
    </table>

</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/zdjkysdw/ztqk/ztqk.js"></script>
</html>
