<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/css/jyys.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/viewer/viewer.min.css" type="text/css">
<%--    <link rel="stylesheet" href="../jsxw.css" type="text/css">--%>

    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery.SuperSlide.2.1.3.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/viewer/viewer.min.js"></script>

    <script>var basePath = '<%=basePath%>';</script>
    <title>Title</title>

    <style>

        .title{
            margin-left: 10px;
            height:35px;
            line-height:35px;
            font-weight:bold;
        }
        .line{
            border: 0.5px solid gray;
        }

        /*通知公告样式 */
        .bbTable {
            border:0px;
        }

        .bbTable>tbody>tr>td, th {
            border:0px;
        }
        a {
            text-decoration: none;
            color: black;
        }
        a:hover{
            text-decoration:underline;
            color: blue;
        }

        .more {
            height:35px;
            line-height:35px;
        }

        .more:hover{
            height:35px;
            line-height:35px;
            cursor:pointer;
        }

        /* 轮播 */
        .picScroll-left  {
            overflow: hidden;
            position: relative;
        }
        img{
            width:325px;
            height:200px;
           /* border:1px solid #ccc;*/
        }
        .tempWrap > ul > li{
            list-style:none;
            margin: 20px 5px;
            width:325px;
            float: left;
        }
        .pictitle{
            height:35px;
            line-height:35px;
            text-align:center;
        }
    </style>
</head>
<body>
<div  style="height:98%;width:98%;min-width:1000px;overflow:auto;margin-top:10px;margin-left:10px;background-color: #fff">
    <div  id="top"  style="height:230px;">
        <div  style="height:230px;border:1px solid #ccc;float:left;width:69%;">
            <div class="more"  style="float:right;margin-right:20px;"  onclick="getMore('#jsyw')">查看更多>> </div>
            <div class="title"  style="">通知公告</div>
            <div class="line"></div>
            <div  class="newscontent"   style="margin-top:10px;">
                <table class="bbTable">
                    <tbody id="tzgg">
                    </tbody>
                </table>
            </div>
        </div>
        <div  style="height:230px;border:1px solid #ccc;float:right;width:30%;">
            <div class="title"  style="">事项提醒</div>
            <div class="line"></div>
            <div  style="height:130px;">
                <div  style="position:relative;top:50%;margin-top:-35px;margin-left:20px;">
                    <img  style="float:left;height:60px;width:60px;" src="<%=basePath%>pages/jyys_new/sy/images/jsxw.png">
                    <div style="float:left;margin-left:15px;font-weight:bold;">本月节水新闻发布数量<br/><span style='font-size:30px;'  id="newsnum">0</span> &nbsp;&nbsp;条</div>
                    <img  style="float:right;height:30px;width:20px;margin-top:15px;margin-right:10px;cursor:hand;" src="<%=basePath%>pages/jyys_new/sy/images/more.png"   onclick="turnToXwtj()">
                </div>
            </div>

            <div  style="height:130px;">
                <div  style="position:relative;top:50%;margin-top:-35px;margin-left:20px;">
                    <img  style="float:left;height:60px;width:60px;" src="<%=basePath%>pages/jyys_new/sy/images/ysdw.png">
                    <div style="float:left;margin-left:15px;font-weight:bold;">超计划水量监控用水单位<br/><span style='font-size:30px;'  id="ysdwnum">0</span> &nbsp;&nbsp;个</div>
                    <img style="float:right;height:30px;width:20px;margin-top:15px;margin-right:10px;cursor:hand;" src="<%=basePath%>pages/jyys_new/sy/images/more.png"  onclick="turnToQysjksj()">
                </div>
            </div>
        <%--    <div  style="height:130px;line-height:130px;margin:0 auto;">超计划水量重点监控用水单位<br/>0个</div>--%>
        </div>
    </div>
    <div  id="middle"   style="height:300px;border:1px solid #ccc;margin-top:10px;">
          <div class="title"  style="">图片展示</div>
          <div class="line"></div>
        <div class="picScroll-left"  style="height:250px;">
            <div class="bd">
                <div class="tempWrap" style="overflow:hidden; position:relative;">
                    <ul class="picList"    id="picList" style="left: 0px; position: relative; overflow: hidden;">
                        <li style="float: left; "  class="picli">
                            <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/01.png"></div>
                            <div class="pictitle">效果图1</div>
                        </li>
                        <li style="float: left; "   class="picli">
                            <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/02.png"></div>
                            <div class="pictitle">效果图2</div>
                        </li>
                        <li style="float: left; "  class="picli">
                            <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/03.png"></div>
                            <div class="pictitle">效果图3</div>
                        </li>
                        <li style="float: left; "  class="picli">
                            <div  class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/04.png"></div>
                            <div class="pictitle">效果图4</div>
                        </li>
                        <li style="float: left;"  class="picli">
                            <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/05.png"></div>
                            <div class="pictitle">效果图5</div>
                        </li>
                    </ul></div>
            </div>
        </div>
    </div>
    <div id="bottom"   style="height:100px;border:1px solid #ccc;margin-top:10px;">
          <div class="title"  style="">网站导航</div>
          <div class="line"></div>
          <div style="float:left;margin-top:20px;width:100%;">
            <div style="float:left;width:20%;text-align:center;"><a href="http://qgjsb.mwr.gov.cn/" target="_blank">全国节约用水办公室</a></div>
            <div style="float:left;width:20%;text-align:center;"><a href="http://swj.beijing.gov.cn/" target="_blank">北京市水务局</a></div>
            <div style="float:left;width:20%;text-align:center;"><a href="http://swj.tj.gov.cn/" target="_blank">天津市水务局</a></div>
            <div style="float:left;width:20%;text-align:center;"><a href="http://slt.hebei.gov.cn/" target="_blank">河北省水利厅</a></div>
            <div style="float:left;width:20%;text-align:center;"><a href="http://slt.shanxi.gov.cn/" target="_blank">山西省水利厅</a></div>
        </div>
    </div>

</div>

</body>

<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script src="<%=basePath %>pages/jyys_new/jsxw/newsView.js"></script>
<script src="sy.js"></script>
</html>
