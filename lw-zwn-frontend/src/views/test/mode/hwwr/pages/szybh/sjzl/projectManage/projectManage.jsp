<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
<head>
    <base href="<%=basePath%>">
    <title>项目管理</title>
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
			.titleItemDiv{    
			width: 24%;
		    height: 100%;
		    float: left;
		    border: 1px solid #efefef;
		    text-align: center;
		    line-height: 100px;
		    }
		.imgdiv>img{width:40px;height:40px;}
	.infotext{    
		    display: inline-block;
		    margin-left: 30px;
		    font-size: 15px;
		    }
	.infonum{font-size:26px;display: inline-block;}
	.imgdiv{display: inline-block;}
       </style>
</head>
<body>

<div class="searchDiv">
   <div class="sc_div" style="width:210px">
       立项年份：
     <input id='tm' type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})" autocomplete="off"/>
    </div>
   
     <div class="sc_div"  style="width: 210px;">
      	业务分类: 
	      	<select id="ywtp"   style="width: 120px;">
				<option value="">全部</option>
				<option value="1">生态流量</option>
				<option value="2">地下水超采</option>
				<option value="3">饮用水源保护</option>
			</select>
    </div>
   
     <div class="sc_div"  style="width: 210px;">
      	项目阶段: 
	      	<select id="pro_stage"   style="width: 120px;">
				<option value="">全部</option>
				<option value="1">立项申报</option>
				<option value="2">招投标</option>
				<option value="3">实施</option>
				<option value="4">已验收</option>
			</select>
    </div>
     
      <div class="sc_div"  style="width: 210px;">
      	项目名称:<input id="project_nm" placeholder="请输入关键字"  style="width: 120px;">
      </div>

    <input type="button" value="查询" class="s_input2" onclick="search()">
    <input type="button" value="添加" class="a_input2" onclick="newAdd()">
</div>
<center class="conent" style="overflow:hidden;padding-bottom:10px;height:90%">
    <div class="titleDiv" style="width:90%;height:100px;border: 0px;margin-top:10px">
    <div class="titleItemDiv" style="">
    	<div class="imgdiv"><img src="images/savewater/allicon.png"></div>
    	<div class="infonum" id="totalnum"></div>个
    	<div class="infotext" >委托项目总数</div>
    </div>
     <div class="titleItemDiv">
     	<div class="imgdiv"><img src="images/savewater/targeticon.png"></div>
     	<div class="infonum" id="level1num"></div>个
    	<div class="infotext" >一级项目数</div>
    </div>
     <div class="titleItemDiv">
     	<div class="imgdiv"><img src="images/savewater/watericon.png"></div>
     	<div class="infonum" id="level2num"></div>个
    	<div class="infotext" >二级项目数</div>
    </div>
     <div class="titleItemDiv" style="min-width: 240px;">
     	<div class="imgdiv"><img src="images/savewater/moneyicon.png"></div>
     	<div class="infonum" id="totalcash"></div>万元
    	<div class="infotext" >累计支付金额</div>
    </div>
    </div>
    <table class="bbTable" style="margin-top:20px;width:97%">
        <thead>
        <tr>
            <td>序号</td>
            <td style="width:15%;">对外委托项目名称</td>
            <td style="width:5%;">立项时间</td>
            <td >所属一级项目</td>
            <td>所属二级项目</td>
            <td >委托形式</td>
            <td>委托金额(万元)</td>
            <td>承建单位</td>
            <td>项目阶段</td>
            <td>已支付进度</td>
            <td>已支付金额</td>
            <td>业务分类</td>
            <td style="width:10%;">操作</td>
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
<script type="text/javascript" src="<%=basePath %>pages/szybh/sjzl/projectManage/projectManage.js"></script>
</html>
