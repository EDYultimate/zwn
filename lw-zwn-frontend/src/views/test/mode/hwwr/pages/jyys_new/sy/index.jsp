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
    <link rel="stylesheet" href="../jsxw.css" type="text/css">

    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery.SuperSlide.2.1.3.js"></script>
    <%--<script type="text/javascript" src="<%=basePath %>common/js/jquery3/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/jquery3/jquery.SuperSlide.2.1.3.js"></script> --%>
    <script type="text/javascript" src="<%=basePath %>common/js/viewer/viewer.min.js"></script>

    <script>var basePath = '<%=basePath%>';</script>
    <title>Title</title>

    <style>
        .more {
            float:right;
            margin-right:100px;
        }
        .titletype{
            text-align:left;
            text-indent: 100px;
            font-weight:bold;
        }
        .line{
            border: 0.5px solid gray;
            width:85%;
        }
        .newscontent{
            width:85%;
        }

        textarea {
            line-height:25px;
            font-size:16px;
            border: none;
            text-indent: 100px
            width:100%;
            resize:none;
            background-color:#EEF3F6;
            overflow:auto;
            font-family: 微软雅黑;
        }

        .bbTable{
            border:0px;
        }

        .bbTable>tbody>tr>td, th{
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
        .more:hover{
            cursor:pointer;
        }

        .newsdiv {width:1000px;}

        /* 轮播 */
       .picScroll-left  {
           overflow: hidden;
           position: relative;
           border: 1px solid #ccc;
       }

       .pic{
           margin:5px 10px;
       }

        img{
            width:350px;
            height:250px;
           /* padding:2px;*/
            border:1px solid #ccc;
        }

        li{
            float:left;
        }

    </style>
</head>
<body>
<%--<div class="searchDiv">
    &nbsp;&nbsp;
    <div class="sc_div"  style="width: 255px;">
        新闻标题: <input type="text" id="jsTitle" class="sc_input"   style="width: 180px;">
    </div>

    <input type="button" value="查询" class="s_input" onclick="search()">
</div>--%>
<center class="conent" style="height:100%;overflow-y:hidden;">
    <div>
                <div  id='textareaDiv'  style="height:80px;width:1000px;">
                    <div  class="titletype" style="text-align:left;text-indent: 100px;font-weight:bold;">事项提醒</div>
                    <div  class="line"  style="border: 0.5px solid gray;width:85%;"></div>
                    <textarea id='textarea'  style="height:60px;width:820px;overflow-y:hidden;"  disabled="disabled"></textarea>
                </div>

            <div  id="topDiv"  class='newsdiv' >
                    <div  class="more"  style="float:right;margin-right:100px;" onclick="getMore('#jsyw')">更多 >></div>
                    <div  class="titletype" style="text-align:left;text-indent: 100px;font-weight:bold;">通知公告</div>
                    <div  class="line"  style="border: 0.5px solid gray;width:85%;">  </div>
                    <div  class="newscontent"  style="width:85%:">
                        <table class="bbTable">
                            <tbody id="tzgg">
                            </tbody>
                        </table>
                    </div>
            </div>
         <%--   <div  id="middleDiv"   style="width:600px;height:400px;" >
                  <img src="<%=basePath%>pages/jyys_new/sy/images/01.png"/>
                  <img src="<%=basePath%>pages/jyys_new/sy/images/02.png"  class="hide"/>
                  <img src="<%=basePath%>pages/jyys_new/sy/images/03.png" class="hide"/>
                 <img src="<%=basePath%>pages/jyys_new/sy/images/04.png"  class="hide"/>
                 <img src="<%=basePath%>pages/jyys_new/sy/images/05.png"  class="hide"/>
            </div>--%>

        <div class="picScroll-left"  style="width:850px;height:250px;">
        <%--    <div class="hd">
                <a class="next"></a>
                <ul><li class="on">1</li><li class="">2</li><li class="">3</li><li class="">4</li></ul>
                <a class="prev"></a>
                <span class="pageState"><span>1</span>/4</span>
            </div>--%>
            <div class="bd">
                <div class="tempWrap" style="overflow:hidden; position:relative; width:850px">
                    <ul class="picList" style="width: 850px; left: 0px; position: relative; overflow: hidden; padding: 0px; margin: 0px;">
                    <li style="float: left; width: 300px;">
                        <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/01.png"></div>
                        <div class="title">效果图1</div>
                    </li>
                    <li style="float: left; width: 300px;">
                        <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/02.png"></div>
                        <div class="title">效果图2</div>
                    </li>
                    <li style="float: left; width: 300px;">
                        <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/03.png"></div>
                        <div class="title">效果图3</div>
                    </li>
                    <li style="float: left; width: 300px;">
                        <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/04.png"></div>
                        <div class="title">效果图4</div>
                    </li>
                    <li style="float: left; width: 300px;">
                        <div class="pic"><img src="<%=basePath%>pages/jyys_new/sy/images/05.png"></div>
                        <div class="title">效果图5</div>
                    </li>
                </ul></div>
            </div>
        </div>
    </div>

            <div   style="height:80px;border-top:5px #78b3de solid;padding-top:20px;width:1000px;" >
                <div style="padding-left: 20px;float:right;margin-right:120px;">
                    <div style="float:left;width: 150px;"><a href="http://qgjsb.mwr.gov.cn/" target="_blank">全国节约用水办公室</a></div>
                    <div style="float:left;width: 130px;"><a href="http://swj.beijing.gov.cn/" target="_blank">北京市水务局</a></div>
                    <div style="float:left;width: 130px;"><a href="http://swj.tj.gov.cn/" target="_blank">天津市水务局</a></div>
                    <div style="float:left;width: 130px;"><a href="http://slt.hebei.gov.cn/" target="_blank">河北省水利厅</a></div>
                    <div style="float:left;width: 130px;"><a href="http://slt.shanxi.gov.cn/" target="_blank">山西省水利厅</a></div>
                </div>
                <div style="text-align:left;margin-left:100px;font-size: 16px; font-weight: bolder;">网站导航</div>
            </div>
    </div>

</center>

</body>

<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script src="<%=basePath %>pages/jyys_new/jsxw/newsView.js"></script>
<script src="sy.js"></script>
</html>
