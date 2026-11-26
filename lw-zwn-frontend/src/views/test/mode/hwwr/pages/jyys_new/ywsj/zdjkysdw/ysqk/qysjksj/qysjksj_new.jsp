<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>国家级重点监控用水单位取用水监控数据</title>
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

        .sc_div {
            width:130px;
        }

        .sc_input{
            width:80px;
        }


        .STCD_TABLE>tbody>tr>td>input{
            width:100%;
            border-radius: 0px;
        }
        .STCD_TABLE>tbody>tr>td>select{
            width:100%;
            border-radius: 0px;
        }
        .pageDiv {
            margin-right: 10px;
        }
        .STCD_DIV{
            position: relative;
            margin-left: 10px;
            margin-bottom: 10px;
            width: calc(100% - 20px);
           /* height: 81%;*/
            float: left;
            overflow: hidden;
        }
        .STCD_DIV1{
            position:relative;
            z-index:1;
            margin-left: 10px;
           /* width: 340px;*/
            width: 410px;
            height: 100%;
            float: left;
        }


        .STCD_DIV2{
            overflow: auto;
            position:relative;
            z-index:1;
           /* width: calc(100% - 350px);*/
            width: calc(100% - 420px);
            height: 100%;
            float: left;
        }

        .STCD_LIST>ul>li{
            padding:5px;
        }
        .STCD_LIST>ul>li:hover{
            background-color:#A0C5E8;
            cursor:pointer;
        }


        .bbTable>tbody>tr>td, th {
            padding:0px 0px;
        }

    </style>

</head>
<body>

<div class="searchDiv">

    <div class="sc_div">
        年份：
        <input type="text" id="yr" name="year" class="sc_input" onclick="WdatePicker({ dateFmt: 'yyyy'})">
    </div>

    &nbsp;
    <div class="sc_div">
        行政区:
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
    <%--    &nbsp;
        <div class="sc_div" >
            级别:
            <select id="levels" class="sc_input">
                <option value="">全部</option>
                <option value="0">国家级</option>
                <option value="1">省级</option>
            </select>
        </div>--%>

    &nbsp;
    <div class="sc_div">
        行业：
        <select id="industry" class="sc_input">
            <option value="">全部</option>
            <option value="10000">工业</option>
            <option value="20000">服务业</option>
            <option value="30000">农业灌区</option>
        </select>
    </div>


    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 235px;">
        重点监控用水单位: <input type="text" id="nm" class="sc_input"   style="width: 100px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="打印" class="sb_input"  onclick="printpage()">
    <input type="button" value="导出" class="sb_input" onclick="dlexcel()">
    <%--   <input type="button" value="逐个添加"  style="width:120px;" class="sb_input" onclick="newAdd()">
       <input type="button" value="EXCEL表添加"  style="width:160px;" class="sb_input" onclick="excelAdd()">--%>



</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%"  id="dydiv">
    <div class="titleDiv">国家级重点监控用水单位取用水监控数据（万立方米）</div>

    <div class="STCD_DIV">
        <div class="STCD_DIV1" >
          <%--  <table id="STCD_TABLE1" class="STCD_TABLE btTable"   class="bbTable">--%>
              <table id="STCD_TABLE1"    class="bbTable">
                <%--<tr>
                    <td rowspan='2'  style="width:20%;"> 年份</td>
                    <td rowspan='2' style="width:20%;">行政区</td>
                    <td rowspan='2'  style="width:60%;">重点监控用水单位名称</td>
                 </tr>--%>
            </table>
        </div>
        <div class="STCD_DIV2" >
            <%--<table id="STCD_TABLE2" class="STCD_TABLE btTable"  class="bbTable">--%>
             <table id="STCD_TABLE2"    class="bbTable">
                <%--<tr>
                    <td colspan='12'  style="width:1200px;">实际用水量</td>
                    <td rowspan='2'  style="width:100px;">年累计用水量</td>
                    <td rowspan='2' style="width:100px;">年计划用水量</td>
                    <td rowspan='2'  style="width:100px;">超计划水量</td>
                </tr>
                <tr>
                    <td style="width:5%;border-top:1px solid #E1E1E1;">1月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">2月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">3月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">4月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">5月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">6月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">7月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">8月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1;">9月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">10月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">11月</td>
                    <td style="width:5%;border-top:1px solid #E1E1E1">12月</td>
                </tr>--%>
            </table>
        </div>
<%--    <table class="bbTable">
        <thead>
        <tr>
            <td rowspan='2'  style="width:5%;"> 年份</td>
            <td rowspan='2' style="width:6%;">行政区</td>
            &lt;%&ndash;<td style="width:5%;">行业</td>&ndash;%&gt;
            <td rowspan='2'  style="width:18%;">重点监控用水单位名称</td>
            <td colspan='12'  style="width:60%;">实际用水量</td>
            <td rowspan='2'  style="width:5%;">年累计用水量</td>
            <td rowspan='2' style="width:5%;">年计划用水量</td>
            <td rowspan='2'  style="width:5%;">超计划水量</td>
        </tr>
        <tr>
            <td style="width:5%;border-top:1px solid #E1E1E1;">1月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">2月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">3月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">4月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">5月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">6月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">7月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">8月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1;">9月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">10月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">11月</td>
            <td style="width:5%;border-top:1px solid #E1E1E1">12月</td>
        </tr>
        </thead>
        <tbody id="tbody">

        </tbody>
    </table>  --%>
    </div>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/zdjkysdw/ysqk/qysjksj/qysjksj_new.js"></script>
</html>
