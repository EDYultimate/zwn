<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <title>审批过程管理</title>
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
    <style type="text/css">

        .bbTable>tbody>tr>td, th {
            height: 15px;
            border: 1px solid #cdd6e2;
            /*padding: 5px 15px;*/
            padding: 3px 15px;
            font-size: 14px;
            text-align: center;
        }

        /*      .menu>ul{
                    height:30px;
                    margin: 0 0 10px 0;
                    padding: 0;
                }

                .menu>ul>li>span{
                    line-height:30px;
                    cursor: pointer;
                }*/


        .menu1>ul{
            height:30px;
            margin: 0 0 10px 0;
            padding: 0;
        }

        li.clickLiTab1{
        /* border-bottom:3px solid #02c299; */
        color:#fff;
        font-weight:bold;
        /* background:url("../../images/index/tabg.png") no-repeat; */
        background-color:#32d4d2;
        }

        .liTab1{
            color:#6a7685;
            float:left;
            list-style:none;
            width:150px;
            border:1px solid #E1E1E1;
            text-align: center;
            height: 30px;
            cursor: pointer;
            font-size: 16px;
            font-family:"微软雅黑";
            background-color:#fff;
        }

        .menu1>ul>li>span{
            line-height:30px;
            cursor: pointer;
        }

    </style>
</head>
<body>

<div class="content"    style="width:98%;border: 1px solid #d3dbde;margin-top:10px;margin-left:5px;"   id="xkz">

    <div class="menu" style="display: table;">
        <ul id="tab"  style="margin-bottom: 0px;">
            <div style="float:left;"  class="liTab" ><span>许可证数量</span></div>
            <li id="xzqh" class="liTab  clickLiTab"><span>按行政区划分析</span></li>
            <li id="szyfq" class="liTab "><span>按水资源分区分析</span></li>
        </ul>
    </div>
    <div class="chart">
        <div id="echartDiv" style="height:90%;width:48%;float:left;"></div>
        <div id="tableDiv" style="height:90%;width:40%;margin-top:5px;margin-left:100px;float:left">
        </div>
  </div>

</div>

<div    style="height:10px;"></div>
<div class="content"    style="width:98%; border: 1px solid #d3dbde;margin-left:5px;"  id="'xkqsl">
    <div class="menu1" style="display: table;">
        <ul id="tab1"  style="margin-bottom: 0px;">
            <div style="float:left;"  class="liTab1" ><span>许可取水量</span></div>
            <li id="ztxx" class="liTab1  clickLiTab1"><span>总体情况</span></li>
            <li id="xzqh1" class="liTab1"><span>按行政区划分析</span></li>
            <li id="szyfq1" class="liTab1"><span>按水资源分区分析</span></li>
        </ul>
    </div>
    <div class="chart" >
        <div id="echartDiv1" style="height:90%;width:48%;float:left;"></div>
        <div id="tableDiv1" style="height:90%;width:40%;margin-top:5px;margin-left:100px;float:left"> </div>
        <div id="echartDiv2" style="height:90%;width:40%;margin-top:5px;margin-left:100px;float:left;">  </div>

    </div>
</div>

</body>
<script type="text/javascript">
    var basePath = "<%=basePath%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/ztxx/ztxx.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
</html>
