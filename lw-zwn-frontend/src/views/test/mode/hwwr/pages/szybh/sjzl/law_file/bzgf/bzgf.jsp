<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>标准规范</title>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        table{table-layout:fixed;}
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
         table tr:nth-child(even){
			background: #f3f8ff;
		}
        </style>
</head>
<body>

<div class="searchDiv">

    &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
       颁布年份：
     <input autocomplete="off" id='tm' type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 255px;">
        关键字: <input type="text" id="ky" class="sc_input" placeholder="文件名/上传人"   style="width: 180px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;

    <input type="button" value="查询" class="s_input2" onclick="search()">
    <input type="button" value="添加" class="a_input2" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">标准规范</div>
    <table class="bbTable">
        <thead>
        <tr>
            <td style="width:10%;">序号</td>
            <td style="width:35%;">文件名称</td>
             <td style="width:10%;">颁布时间</td>
            <td style="width:25%;">颁布部门</td>
            <td style="width:10%;">上传人</td>
            <td style="width:20%;">操作</td>
        </tr>

        </thead>
        <tbody id="tbody">

        </tbody>
    </table>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/sjzl/law_file/bzgf/bzgf.js"></script>
</html>
