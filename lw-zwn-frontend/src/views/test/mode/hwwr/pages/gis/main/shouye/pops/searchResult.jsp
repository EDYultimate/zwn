<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>My JSP 'searchResult.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<link rel="stylesheet" type="text/css" href="../css/searchResult.css">
  </head>
  
  <body>
    <div class="popGroup">
    <div class="CZGroup">
    	<div class='PopItem'>测站</div>
    	<div class="itemHeader">
	    	<div class="itemTHNM">名称</div>
	    	<div class="itemTHTP">类型</div>
	    	<div class="itemTHDW">操作</div>
    	</div>
    	<div class="CZContent">
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-泵站</div>
    			<div class="CZDW unSelected">定位</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-沉箱</div>
    			<div class="CZDW unSelected">定位</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-隧洞</div>
    			<div class="CZDW unSelected">定位</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-涵管</div>
    			<div class="CZDW unSelected">定位</div>
    		</div>
    			<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-分水闸</div>
    			<div class="CZDW unSelected">定位</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-泵站</div>
    			<div class="CZDW unSelected">定位</div>
    		</div>
    	</div>
    </div>
      <div class="CZGroup">
    	<div class='PopItem'>功能</div>
    	<div class="itemHeader">
	    	<div class="itemTHNM">名称</div>
	    	<div class="itemTHTP">类型</div>
	    	<div class="itemTHDW">操作</div>
    	</div>
    	<div class="CZContent">
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">流量统计分析</div>
    			<div class="CZDW unSelected">打开</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">水位统计分析</div>
    			<div class="CZDW unSelected">打开</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">库容统计分析</div>
    			<div class="CZDW unSelected">打开</div>
    		</div>
    	</div>
    </div>
    <div class="CZGroup">
    	<div class='PopItem'>文档</div>
    	<div class="itemHeader">
	    	<div class="itemTHNM">名称</div>
	    	<div class="itemTHTP">类型</div>
	    	<div class="itemTHDW">操作</div>
    	</div>
    	<div class="CZContent">
    		<div class="CZItem">
    			<div class="CZNM">年度各站逐月降雨量表</div>
    			<div class="CZTP">遥测-泵站</div>
    			<div class="CZDW unSelected">查看</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">二干渠管理处年度雨量统计</div>
    			<div class="CZTP">遥测-沉箱</div>
    			<div class="CZDW unSelected">查看</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-隧洞</div>
    			<div class="CZDW unSelected">查看</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-涵管</div>
    			<div class="CZDW unSelected">查看</div>
    		</div>
    			<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-分水闸</div>
    			<div class="CZDW unSelected">查看</div>
    		</div>
    		<div class="CZItem">
    			<div class="CZNM">三干渠进口</div>
    			<div class="CZTP">遥测-泵站</div>
    			<div class="CZDW unSelected">查看</div>
    		</div>
    	</div>
    </div>
    </div>
  </body>
</html>
