<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>图片库</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
 <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    
  
    <script>var basePath = '<%=basePath%>';</script>
  </head>
   <style>
        body{background-color:#fff}
        .picitem_outDiv{width: 30%;
		    height: 45%;
		    border: 2px solid #efefef;
		    border-radius: 15px;
		    margin: auto;
		    display: inline-block;
		   	min-width: 430px;
		   	margin-left: 2%;
		   	margin-top:15px;
		    }
		 .picDiv{width:100%;margin:auto;height: calc(100% - 80px);text-align:center;cursor:pointer}
		 .pic_bottomOutDiv{width:100%;height:80px;padding: 5px 0 0 25px;}
		 .picitem_bottomDiv{float:left;width:45%;display:inline-block;line-height: 30px;font-size: 15px;text-overflow: ellipsis;
    white-space: nowrap;}
		 img{width:90%;height: 90%;margin-top: 20px;}
    </style>
  <body>
   <div class="searchDiv">

    &nbsp;&nbsp;&nbsp;&nbsp;
     <div class="sc_div"  style="width: 255px;">
      	时间: 
	     <input autocomplete="off" id=tm type='text' onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
    </div>
     <div class="sc_div"  style="width: 255px;">
      	类型:
      	<select id="pictype" name="pictype" >
			<option value="">全部</option>
			<option value="1">生态流量</option>
			<option value="2">地下水超采综合治理</option>
			<option value="3">饮用水源保护</option>
		</select>
      </div>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div class="sc_div"  style="width: 255px;">
      	关键字:<input id="keyw" placeholder="描述/上传人"  style="width: 180px;">
      </div>

    <input type="button" value="查询" class="s_input2" onclick="search()">
    <input type="button" value="添加" class="a_input2" onclick="newAdd()">
</div>
 <div style="width:100%;height:calc(100% - 60px);"> 
<div id="piccontent" style="width:100%;float:left;height:calc(100% - 60px);min-width: 1425px;overflow: auto;">
		<%-- <div class="picitem_outDiv">
			<div class="picDiv">
			<img src="<%=basePath%>/images/savewater/a1.png" >
			</div>
			<div class="pic_bottomOutDiv" >
				<div class="picitem_bottomDiv" >
					类型:地下水超采区综合治理
				</div>
				<div class="picitem_bottomDiv" >
					描述:地下水超采区综合治理
				</div>
				<div class="picitem_bottomDiv" >
					照片时间:2020-10-22
				</div>
				<div class="picitem_bottomDiv" >
					上传人:张三
					
				</div>
				
			</div>
		</div>
		
		
		
		<div class="picitem_outDiv">
			<div class="picDiv">
			<img src="<%=basePath%>/images/savewater/a1.png" >
			</div>
			<div class="pic_bottomOutDiv" >
				<div class="picitem_bottomDiv" >
					类型:地下水超采区综合治理
				</div>
				<div class="picitem_bottomDiv" >
					描述:地下水超采区综合治理
				</div>
				<div class="picitem_bottomDiv" >
					照片时间:2020-10-22
				</div>
				<div class="picitem_bottomDiv" >
					上传人:张三
				</div>
			</div>
		</div>
		
		
		<div class="picitem_outDiv">
			<div class="picDiv">
			<img src="<%=basePath%>/images/savewater/a1.png" >
			</div>
			<div class="pic_bottomOutDiv" >
				<div class="picitem_bottomDiv" >
					类型:地下水超采区综合治理
				</div>
				<div class="picitem_bottomDiv" >
					描述:地下水超采区综合治理
				</div>
				<div class="picitem_bottomDiv" >
					照片时间:2020-10-22
				</div>
				<div class="picitem_bottomDiv" >
					上传人:张三
				</div>
			</div>
		</div> --%>
	</div>

   <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
 </div>

  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
	 <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/sjzl/picture/picManage.js"></script>
</html>
