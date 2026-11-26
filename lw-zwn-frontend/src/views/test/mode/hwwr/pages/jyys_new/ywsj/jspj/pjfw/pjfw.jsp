<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" pageEncoding="UTF-8"%>
<%@ page import="org.jasig.cas.client.validation.Assertion" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>节水评价范围</title>
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script>var basePath = '<%=basePath%>';</script>
    <style>
        table{table-layout:fixed;}
        /* tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
         td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}*/
        tbody td {
              overflow: hidden;

        }

        .bbTable>tbody>tr>td, th{
            text-align:left;
            line-height:30px;
        }
        td>p{overflow: hidden;}

    </style>
</head>
<body>

<%--    <div class="searchDiv">




   &nbsp;&nbsp;
   <div class="sc_div"  style="width: 235px;">
      年份: <input type="text" id="yr" class="sc_input"   style="width: 130px;"  onClick="WdatePicker({ dateFmt: 'yyyy'})">
   </div>

&nbsp;&nbsp;
   <div class="sc_div"  style="width: 235px;">
      是否海河流域：
       <select id="ishwcc" class="sc_input">
           <option value="">全部</option>
           <option value="0">否</option>
           <option value="1">是</option>
       </select>
   </div>

    &nbsp;&nbsp;&nbsp;&nbsp;
    <input type="button" value="查询" class="s_input" onclick="search()">
    <input type="button" value="添加" class="a_input" onclick="newAdd()">
    <input type="button" value="导出" class="a_input" onclick="dlexcel()">
</div>   --%>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv">节水评价范围</div>
    <table class="bbTable">
        <thead>
        <tr>
         <%--   <td style="width:8%;">序号</td>--%>
            <td style="width:15%;">范围</td>
             <td style="width:20%;">具体范围</td>
             <td style="width:20%;">评价环节</td>
             <td style="width:35%;">评价内容</td>
        </tr>

        </thead>
        <tbody id="tbody">
        <tr>
            <td>与取用水相关的水利规划</td>
            <td>包括区域供水工程规划、引水调水规划、水库建设规划、灌区建设规划等</td>
            <td>规划制定阶段开展节水评价，在规划报告中编写节水评价章节</td>
            <td>重点分析现状供用水水平与节水潜力，供需水量预测成果及水资源配置方案的节水符合性、节水目标指标的合理性与先进性，节水措施的可行性与节水效果等，评价规划取用水的合理性与可行性</td>
        </tr>

        <tr>
            <td>与取用水相关的水利工程项目</td>
            <td>包括蓄水工程、引水工程、提水工程、调水工程、地下水利用工程等</td>
            <td>在工程规划、项目立项阶段开展节水评价，在项目规划报告、项目建议书、项目可行性研究报告中编写节水评价章节</td>
            <td>重点分析现状供用水水平与节水潜力，供需水量预测成果及水资源配置方案的节水符合性，节水措施的可行性与节水效果等，评价水利工程项目供水的必要性与取用水规模的合理性</td>
        </tr>

        <tr>
            <td>需开展水资源论证的相关规划</td>
            <td>包括城镇新区规划、工业园区规划、经济技术开发区规划、高耗水行业的专项规划、涉及取用水的相关产业发展规划等</td>
            <td>在水资源论证阶段开展节水评价，在水资源论证报告书中编写节水评价章节</td>
            <td>重点分析现状供用水水平与节水潜力，供需水量预测成果及水资源配置方案的节水符合性、节水目标指标的合理性与先进性，节水措施的可行性与节水效果等，评价规划取用水的合理性与可行性</td>
        </tr>

        <tr>
            <td>办理取水许可的非水利建设项目</td>
            <td>包括直接从江河、湖泊、地下以及水库、渠道等取水，并需要申请取水许可的非水利建设项目</td>
            <td>在取水许可阶段开展节水评价，在水资源论证报告书中将用水合理性分析等内容强化为节水评价章节</td>
            <td>重点分析用水节水相关政策的符合性，节水工艺技术、循环用水水平、用水指标的先进性等，评价建设项目取用水的必要性和规模的合理性</td>
        </tr>
        <tr>
            <td colspan="4" >注：从城市公共管网等取水的高耗水建设项目宜参照本意见开展节水评价</td>

        </tr>


        </tbody>
    </table>

</center>
</body>
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/jyys_new/ywsj/jspj/pjfw/pjfw.js"></script>
</html>
