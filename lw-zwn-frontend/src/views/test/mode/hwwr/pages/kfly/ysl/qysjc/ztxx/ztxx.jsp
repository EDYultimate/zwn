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
    <title>取用水监测情况</title>
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <style type="text/css">

        .bbTable>tbody>tr>td, th {
            height: 15px;
            border: 1px solid #cdd6e2;
            /*padding: 5px 15px;*/
            padding: 3px 15px;
            font-size: 14px;
            text-align: center;
        }



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
       input {
            height: 15px;
            border-radius: 15px;
            border: 1px solid #E1E1E1;
            text-align: center;
            outline: none;
            color: rgb(4, 84, 195);
            width: 100px;
        }

    </style>
</head>
<body>


    <div class="searchDiv">
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div class="sc_div"  style="width:280px;"  id="tjtp">
             统计方式:
           <%-- <select id="type"   class="sc_input">
                <option value="yr">年</option>
                <option value="mn">月</option>
            </select>--%>
            <input type="radio" name="radio" value="1" checked="checked"   style="width:40px;" >年
            <input type="radio" name="radio" value="2"   style="width:40px;" >月
        </div>

        &nbsp;&nbsp;&nbsp;&nbsp;
        <div class="sc_div" style="width:280px"  id="yr">
            时间：
            <input type="text" id="bdat" name="datemonth" class="sc_input sc_input_fix" onClick="WdatePicker({ dateFmt: 'yyyy'})">
            --
            <input type="text" id="edat" name="datemonth" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy'})">
        </div>

        <div class="sc_div" style="width:280px;display:none;"  id="mn"  >
            时间：
            <input type="text" id="bdat1" name="datemonth" class="sc_input sc_input_fix" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">
            --
            <input type="text" id="edat1" name="datemonth" class="sc_input" onClick="WdatePicker({ dateFmt: 'yyyy-MM'})">
        </div>

        &nbsp;&nbsp;&nbsp;&nbsp;

        <input type="button" value="查询" class="s_input" onclick="search()">
    </div>

    <center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
        <div class="titleDiv"><span id="titleSpan"></span>委发证取水户累计取用水量情况</div>
        <div >
            <div class="chart"  id="leftDiv" style="width:25%;float:left; border: 1px solid #d3dbde;">
                   <div id="chartDiv"  style="height:70%;margin-top:15%;"></div>
            </div>
            <div class="chart" id="rightDiv" style="width:73%;float:left; border: 1px solid #d3dbde;">
                 <div class="menu" style="display: table;">
                    <ul id="tab"  style="margin-top: 0px;">
                        <li id="xzqh" class="liTab  clickLiTab"><span>按行政区划分析</span></li>
                        <li id="szyfq" class="liTab "><span>按水资源分区分析</span></li>
                    </ul>
                </div>
                <div   id="echartDiv" style="height:80%;width:60%;float:left;margin-left:5px;"></div>
                 <div  id="tableDiv"  style="height:80%;width:38%;float:left;"></div>
            </div>

        </div>



    </center>








</div>

</body>
<script type="text/javascript">
    var basePath = "<%=basePath%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/kfly/ysl/qysjc/ztxx/ztxx.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
</html>
