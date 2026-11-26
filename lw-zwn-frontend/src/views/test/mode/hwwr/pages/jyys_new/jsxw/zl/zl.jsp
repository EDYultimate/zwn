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

        .newsdiv {
          /*  height:150px;*/
            width:1000px;
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
    <%--<div  style="overflow:auto;">--%>
            <div  id="topDiv"  class='newsdiv' >
                <div  class="more"  style="float:right;margin-right:100px;" onclick="getMore('#jsyw')">更多 >></div>
                <div  class="titletype" style="text-align:left;text-indent: 100px;font-weight:bold;">节水要闻</div>
                <div  class="line"  style="border: 0.5px solid gray;width:85%;">  </div>
                <div  class="newscontent"  style="width:85%:">
                    <table class="bbTable">
                        <tbody id="jsyw">
                        </tbody>
                    </table>
                </div>


            </div>
            <div  id="middleDiv"  class='newsdiv'  >
                <div  class="more"  onclick="getMore('#hwdt')">更多 >></div>
                <div  class="titletype">海委动态</div>
                <div  class="line" ></div>
                <div  class="newscontent" >
                    <table  class="bbTable" >
                        <tbody id="hwdt">
                        </tbody>
                    </table>
                </div>

            </div>

            <div  id="bottomDiv"  class='newsdiv' >
                <div  class="more"  onclick="getMore('#lydt')">更多 >></div>
                <div  class="titletype">流域动态</div>
                <div class="line"></div>
                <div  class="newscontent" >
                    <table class="bbTable">
                        <tbody id="lydt">
                        </tbody>
                    </table>
                </div>
            </div>
           <%-- <div   style="height:80px;border-top:5px #78b3de solid;padding-top:20px;width:1000px;" >

                <div style="padding-left: 20px;float:right;margin-right:120px;">
                    <div style="float:left;width: 150px;"><a href="http://qgjsb.mwr.gov.cn/" target="_blank">全国节约用水办公室</a></div>
                    <div style="float:left;width: 130px;"><a href="http://swj.beijing.gov.cn/" target="_blank">北京市水务局</a></div>
                    <div style="float:left;width: 130px;"><a href="http://swj.tj.gov.cn/" target="_blank">天津市水务局</a></div>
                    <div style="float:left;width: 130px;"><a href="http://slt.hebei.gov.cn/" target="_blank">河北省水利厅</a></div>
                    <div style="float:left;width: 130px;"><a href="http://slt.shanxi.gov.cn/" target="_blank">山西省水利厅</a></div>
                </div>
                <div style="text-align:left;margin-left:100px;font-size: 16px; font-weight: bolder;">网站导航:</div>

            </div>--%>
    </div>

</center>

</body>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script src="<%=basePath %>pages/jyys_new/jsxw/newsView.js"></script>
<script src="zl.js"></script>
</html>
