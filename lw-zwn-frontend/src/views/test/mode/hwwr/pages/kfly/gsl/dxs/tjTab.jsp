<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'tjTab.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  </head>
  <script>
  	$(function(){
  		var getBodyH=document.body.clientHeight;//得到body高
  		var getBodyW=document.body.clientWidth;//得到body宽
  		$("#tbFrame").css("height",getBodyH);
  		$("#tbFrame").css("width",getBodyW);
  		
  		$("#modleIframe").css("height",getBodyH);
  		$("#modleIframe").css("width",getBodyW-20);
  		$("#rel_div").css("top", $(document).scrollTop()+200 );
  		$("#tbFrame").css("left",getBodyW);
  		$("#rel_div").click(function(){
  		$("#modleIframe").attr("src","<%=basePath%>/pages/kfly/gsl/dxs/sssj/sssj.jsp");
  			//$("#tbFrame").animate({width: 'toggle'},350);
  			if($("#togg").val()=="1"){
  				$("#rel_div").html("&nbsp;<br/>关<br/>&nbsp;<br/>闭");
  				$("#togg").val("0");
  				$("#tbFrame").css("left",0);
  			}else{
  				$("#rel_div").html("统<br/>计<br/>信<br/>息");
  				$("#togg").val("1");
  				$("#tbFrame").css("left",getBodyW);
  			}
  		});
  	});
  	</script>
  <body style="padding: 0;margin: 0;overflow-x:hidden;overflow-y:hidden;">
  <input type="hidden" id="togg" value="1">
    <div id="rel_div" style="width:30px;height:100px;position:absolute; right:-3px; float:right; padding-top:8px;cursor: pointer;
    background:#1B539D;text-align:center;z-index: 100;font-family: '微软雅黑';font-weight: bold;font-size:15px;color:#ffffff;-webkit-border-radius: 6px;-moz-border-radius: 6px; ">
    	统<br/>计<br/>信<br/>息
    </div>
    <div id="gsFrame" style="width:100%;height:100%;padding: 0;margin: 0;">
    	<iframe id="gismap" name="gismap"  style="z-index:1;width:100%;height:100%;border: 0px;" src=""></iframe>
    </div>
      <div id="tbFrame" style="position:absolute;z-index:5;background:#ffffff; padding: 0;margin: 0;top:0;">
      <iframe id="modleIframe"  style="background:#ffffff;position:absolute;border: 0px;left:20px;" src="<%=basePath%>/pages/gis/mains/index.jsp"></iframe>
      </div>
  </body>
</html>
