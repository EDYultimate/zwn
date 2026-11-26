<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String year=request.getParameter("year");
    if (year==null) {
        year = "";
    }
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">
    <title>重点监控用水单位用水计划</title>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style type="text/css">
        .bbTable > tbody > tr > td, th {
            padding: 0px
        }

        .ss_input {
            height: 40px;
            width: 118px;
            padding: 0px 30px 0 30px;
            border-radius: 8px;
            border: 1px solid #E1E1E1;
            background-color: #ee9d1e;
            outline: none;
            color: #FFFFFF;
            border-color: #c87f0d;
            background-repeat: no-repeat;
            background-position-x: 30px;
            background-position-y: 11px;
            font-size: 16px;
            text-align: right;
        }


    </style>
</head>
<body style="overflow-y: auto;">

<div class="searchDiv">
    <div class="sc_div">
       年份：
        <input type="text" id="yr" name="year" class="sc_input" onclick="WdatePicker({ dateFmt: 'yyyy'})">
      </div>
    &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
        行政区：
        <select id="ad_cd" class="sc_input">
            <option value="">全部</option>
            <option value="110000">北京市</option>
            <option value="120000">天津市</option>
            <option value="130000">河北省</option>
            <option value="140000">山西省</option>
            <option value="410000">河南省</option>
            <option value="370000">山东省</option>
            <option value="150000">内蒙古自治区</option>
            <option value="210000">辽宁省</option>
        </select>
    </div>

    &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
        级别：
        <select id="levels" class="sc_input">
            <option value="">全部</option>
            <option value="0">国家级</option>
            <option value="1">省级</option>
        </select>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div" style="width:210px">
        行业：
        <select id="industry" class="sc_input">
            <option value="">全部</option>
            <option value="10000">工业</option>
            <option value="20000">服务业</option>
            <option value="30000">农业灌区</option>
        </select>
    </div>


    <input type="button" value="查询" class="s_input" onclick="search()">
    <%--<input type="button" value="添加" class="a_input" onclick="newAdd()">--%>

    <input type="button" value="打印" class="sb_input"  onclick="printpage()">
    <input type="button" value="导出" class="sb_input" onclick="dlexcel()">
    <input type="button" value="用水计划管理"  style="width:150px;"  class="sb_input" onclick="ysjhgl()">
</div>

<center  style="background-color: #fff;"  id="dydiv">
    <div id="titleDiv1" class="titleDiv">
        <span id="cyear1"></span><span>重点监控用水单位用水计划统计</span>
    </div>
    <table id="table1" class="bbTable"   style="width:100%">
        <thead>
        <tr>
            <td style="width:5%;"> 年份</td>
            <td style="width:5%;">行政区</td>
            <td style="width:5%;">级别</td>
            <td style="width:5%;">行业</td>
            <td style="width:10%;">年计划用水量（万立方米）</td>
       <%--     <td style="width:5%;">1月</td>
            <td style="width:5%;">2月</td>
            <td style="width:5%;">3月</td>
            <td style="width:5%;">4月</td>
            <td style="width:5%;">5月</td>
            <td style="width:5%;">6月</td>
            <td style="width:5%;">7月</td>
            <td style="width:5%;">8月</td>
            <td style="width:5%;">9月</td>
            <td style="width:5%;">10月</td>
            <td style="width:5%;">11月</td>
            <td style="width:5%;">12月</td>--%>
        </tr>

        </thead>
        <tbody id="tbody">

        </tbody>
    </table>


</center>

</body>
<script type="text/javascript">
    var hwwr = {};
    hwwr.basePath = "<%=basePath%>";
    hwwr.option = {};
    hwwr.option.year = "<%=year%>"
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/zdjkysdw/ysjh/ysjh.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
</html>
