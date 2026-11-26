<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>定额值</title>
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
      /*  .STCD_DIV1{
            position:relative;
            z-index:1;
            margin-left: 10px;
            !* width: 340px;*!
            width: 410px;
            height: 100%;
            float: left;
        }*/


        .STCD_DIV2{
            overflow: auto;
            position:relative;
            z-index:1;
            /* width: calc(100% - 350px);*/
            /*width: calc(100% - 420px);*/
            width:100%;
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


    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 135px;">
        标准:
        <select id="ad_cd" class="sc_input"  style="width: 65px;">
            <option value="">全部</option>
            <option value="000000">国家</option>
            <option value="110000">北京市</option>
            <option value="120000">天津市</option>
            <option value="130000">河北省</option>
            <option value="140000">山西省</option>
        </select>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 135px;">
        行业:
        <select id="nm" class="sc_input"  style="width: 65px;">
            <option value="工业">工业</option>
            <option value="农业">农业</option>
            <option value="生活">生活</option>
        </select>
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 225px;">
        行业类别: <input type="text" id="hytp" class="sc_input"   style="width: 120px;">
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 225px;">
        行业名称: <input type="text" id="hynm" class="sc_input"   style="width: 120px;">
    </div>
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 225px;">
        产品名称: <input type="text" id="ystp" class="sc_input"   style="width: 120px;">
    </div>

    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">定额标准</div>
    <div class="STCD_DIV">
        <div class="STCD_DIV1" >
            <table id="STCD_TABLE1"    class="bbTable">
            </table>
        </div>
        <div class="STCD_DIV2" >
            <table id="STCD_TABLE2"    class="bbTable">
            </table>
        </div>
     </div>
    <div class="pageDiv"><span class="tolSpan">
         </span><div class="M-box"></div>
    </div>
</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/ysde/dez/dez_new.js"></script>
</html>
