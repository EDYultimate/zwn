<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>水资源信息服务系统</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath %>common/css/index/index.css" type="text/css">
	<script>var basePath = "<%=basePath%>"; </script>
  <style>
  body{background-color:#e7ebf1}
	 li{font-size:16px} 
	.child_menu_div {
	    width: 175px;
	}
	
	.top_menu {
    width: 750px;
/*     height: 80px; */
/*     float: right; */
    /* margin-top: 27px; */
    margin-right: 20px;
}
  </style>
  </head>
	<script>
		var roleCode='<%=request.getRemoteUser()%>';
		console.log('roleCode() ',roleCode);
		
		if(roleCode!=null){
			for(var i=0;i<result.length;i++){
				if("370902199001104829"==roleCode){
					$("#rcgl").css("display","none");
					$("#kfly").css("display","none");
					$("#szybh").css("display","none");
					$("#lyzg").css("display","none");
				}
				if("210423197303210425"==roleCode||"350121198004136735"==roleCode
						||"370902199001104829"==roleCode||"210882198310031229"==roleCode
						||"13020319811118331X"==roleCode||"130924199402273213"==roleCode
						||"230208199404300428"==roleCode){
					$("#szybhgl").css("display","block");
				}
	
			/*	if("hwwr-01"==roleCode){
					$("#rcgl").css("display","");
					$("#lyzg_log").css("display","");
				}*/
			}

		}
		
	</script>
  <body style="overflow:auto;min-width:1296px;">
     <div id="mainDiv" style="width:100%;height:calc(100% - 5px);">
    	<div id="titDiv" class="head">
    		<div class="headleft"><div class="top_title"></div></div>
    		<div class="headright">
    			<div class="top_user">
    			<img style="margin-left:15px;margin-top:8px;" src="<%=basePath%>images/index/user.png">
    			<span style="width:48px;">用户名</span>
    			</div>
    			<div class="top_menu">
    				<ul>
    					<li id="kfly" style="border-left:1px solid #5b5a65e3;border-right:1px solid #5b5a65e3;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/kfly.png"></div><span>开发利用</span></li>
    					<li id="jyys" style="border-right:1px solid #5b5a65e3;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/jyys.png"></div><span>节约用水</span></li>
    					<li id="szybh" style="border-right:1px solid #5b5a65e3;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/szybh.png"></div><span>水资源保护</span></li>
    					<li id="lyzg" style="border-right:1px solid #5b5a65e3;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/lyzg.png"></div><span>流域直管</span></li>
    					<%--<li id="rcgl" style="border-right:1px solid #5b5a65e3;display: none;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/rcgl.png"></div><span>日常管理</span></li>--%>
						<li id="rcgl" style="border-right:1px solid #5b5a65e3;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/rcgl.png"></div><span>日常管理</span></li>
						<li id="jyys_new" style="border-left:1px solid #5b5a65e3;border-right:1px solid #5b5a65e3"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/jsgl.png"></div><span>节水管理</span></li>
<!-- 						<li id="szybhgl" style="display:none;width: 120;border-right:1px solid #5b5a65e3;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/szybh.png"></div><span>水资源保护管理</span></li> -->
						<li id="szybhgl" style="display:block;width: 120;border-right:1px solid #5b5a65e3;"><div style="height:30px;padding: 15 0 0 0;"><img height='25px' src="<%=basePath %>/images/index/szybh.png"></div><span>水资源保护管理</span></li>
						
    				</ul>
    			</div>
    		</div>
    	</div>
    	<div id="bodyDiv" class="body">
    		<div id="bodyLeftDiv" class="body_left">
    			<ul id="kfly_ul" class="left_url">
    				<li id="jsl"><a><img src="<%=basePath%>images/index/jsl-01.png" /><span>降水量</span></a></li>
    				<li id="szyl"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水资源量</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -30px;">
    						<ul class="child_menu">
    							<li id="dbs"><span>地表水</span></li>
    							<li id="szyl_dxs"><span>地下水</span></li>
    							<li id="szyzl"><span>水资源总量</span></li>
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				<li id="crjsl"><a><img src="<%=basePath%>images/index/crjsl-01.png" /><span>出入境水量</span></a></li>
    				<li id="skxsl"><a><img src="<%=basePath%>images/index/skxsl-01.png" /><span>水库蓄水量</span></a></li>
    				<li id="gsl"><a><img src="<%=basePath%>images/index/gsl-01.png" /><span>供水量</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -30px;">
    						<ul class="child_menu">
    							<li id="nsbd"><span>南水北调</span></li>
    							<li id="dxs"><span>地下水</span></li>
    							<li id="gsfx"><span>供水分析</span></li>
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				<li id="ysl"><a><img src="<%=basePath%>images/index/ysl-01.png" /><span>用水量</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -15px;">
    						<ul class="child_menu">
    							<li id="qysjc"><span>取用水监测</span></li>
    							<li id="ysfx"><span>用水分析</span></li>
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				<li id="hsl"><a><img src="<%=basePath%>images/index/hsl-01.png" /><span>耗水量</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -15px;">
    						<ul class="child_menu">
    							<li id="ETjc"><span>ET监测</span></li>
    							<li id="hsfx"><span>耗水分析</span></li>
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				<li id="psl" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/psl-01.png" /><span>排污量</span></a></li>
    				<%-- <li id="qsxk" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/qsxk-01.png" /><span>取水许可</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -30px;">
    						<ul class="child_menu">
    							<li id="szylz"><span>水资源论证</span></li>
    							<li id="qsxkl"><span>取水许可</span></li>
    							<li id="szyfzssy"><span>水资源费征收使用</span></li>
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li> --%>
    			</ul>
    			<ul id="jyys_ul" class="left_url" style="display:none;">
    				<li id="qsjh"><a><img src="<%=basePath%>images/index/jsl-01.png" /><span>取水计划</span></a></li>
    				<li id="ysxl" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>用水效率</span></a></li>
    		<%--		<li id="yswdgl" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>文档管理</span></a></li>--%>
    				<li id="jsjg" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>节水技改</span></a></li>
    				<li id="xyjssh" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>县域节水</span></a></li>
    				<li id="jsztjs" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>节水载体</span></a></li>
				<%--	<li id="sstwmjs" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水生态文明建设</span></a></li>--%>
    			</ul>

				<ul id="jyys_new_ul" class="left_url" style="display:none;">
					<li id="jssy"><a><img src="<%=basePath%>images/index/jssy-01.png" /><span>首页</span></a></li>
					<li id="jsxw"><a><img src="<%=basePath%>images/index/jsxw-01.png" /><span>节水新闻</span></a></li>
					<li id="lygk" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/lygk-01.png" /><span>流域概况</span><div class="triangle-facing-right"></div></a>
                        <div class="child_menu_div" style="top: -30px;">
                            <ul class="child_menu">
                               <!--  <li id="jsgk"><span>节水概况</span></li> -->
                                <li id="gzzn"><span>工作职能</span></li>
                                <li id="jgsz"><span>机构设置</span></li>
                                <li id="txl"><span>通讯录</span></li>
                                <li id="zjk"><span>专家库</span></li>
                                <li id="xwtj"><span>新闻统计</span></li>
                            </ul>
                            <div class="triangle-facing-left"></div>
                        </div>
                    </li>
					<li id="zcfg" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/zcfg-01.png" /><span>政策法规</span></a></li>
					<li id="tzwj" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/tzwj-01.png" /><span>总结计划</span></a></li>
				<%--	<li id="gzdt" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>工作动态</span></a></li>--%>
					<li id="ywsj" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/ywsj-01.png" /><span>业务数据</span><div class="triangle-facing-right"></div></a>
                        <div class="child_menu_div" style="top: -30px;">
                            <ul class="child_menu">
                                <li id="xydb"><span>县域达标</span></li>
                                <li id="ysde"><span>用水定额</span></li>
                                <li id="jhys"><span>计划用水</span></li>
                                <li id="zdjkysdw"><span>重点监控用水单位</span></li>
                                <li id="jspj"><span>节水评价</span></li>
                                <li id="jskh"><span>节水考核</span></li>
                                <li id="jsztjstj"><span>节水载体建设</span></li>
                            </ul>
                            <div class="triangle-facing-left"></div>
                        </div>
                    </li>
					<li id="ztyj" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/ztyj-01.png" /><span>专题研究</span></a></li>
					<li id="zlk" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/zlk-01.png" /><span>资料图库</span></a></li>
				</ul>

    			<ul id="szybh_ul" class="left_url" style="display:none;">
    				<li id="sgnq"><a><img src="<%=basePath%>images/index/jsl-01.png" /><span>水功能区</span></a></li>
    				<li id="rhpwk"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>入河排污口</span></a></li>
    				<li id="yysyd"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水源地</span></a></li>
    				<li id="szybh_sjdm"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水质站</span></a></li>
    				<li id="szybh_szzd" ><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水质自动站</span></a></li>
    				<li id="zdhhpg" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>生态流量管控</span></a></li> 
    				
<!--     				<li id="lygk"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>流域概况</span><div class="triangle-facing-right"></div></a> -->
<!--     					<div class="child_menu_div" style="top: -30px;"> -->
<!--     						<ul class="child_menu"> -->
<!--     							<li id="szybhgk"><span>水环境概况</span></li> -->
<!--     							<li id="gzzn2"><span>工作职能</span></li> -->
<!--     							<li id="jgsz"><span>机构设置</span></li> -->
<!--     							<li id="txl2"><span>通讯录</span></li> -->
<!--     						</ul> -->
<!--     						<div class="triangle-facing-left"></div> -->
<!--     					</div> -->
<!--     				</li> -->
<!--     				<li id="xwdt" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/water-01.png" /><span>新闻动态</span></a></li>     				 -->
<!--     				<li id="ywgz"><a><img src="<%=basePath%>images/index/ztyj-01.png" /><span>业务管理</span><div class="triangle-facing-right"></div></a> -->
<!--     					<div class="child_menu_div" style="top: -30px;"> -->
<!--     						<ul class="child_menu"> -->
<!--     							<li id="stllgk"><span>生态流量管控</span></li> -->
<!--     							<li id="dxsccqzhzl"><span>地下水超采区综合治理</span></li> -->
<!--     							<li id="yysszybh"><span>饮用水水源保护</span></li> -->
<!--     							<li id="tfswryd"><span>突发水污染应对</span></li> -->
<!--     							<li id="shjzl"><span>水环境质量</span></li> -->
<!--     							<li id="szybhyb"><span>水资源保护月报</span></li> -->
<!--     						</ul> -->
<!--     						<div class="triangle-facing-left"></div> -->
<!--     					</div> -->
<!--     				</li> -->
    				
<!--     				<li id="sjtb"><a><img src="<%=basePath%>images/index/tzwj-01.png" /><span>数据填报</span><div class="triangle-facing-right"></div></a> -->
<!--     					<div class="child_menu_div" style="top: -30px;"> -->
<!--     						<ul class="child_menu"> -->
<!--     							<li id="dxstb"><span>地下水通报</span></li> -->
<!--     							<li id="zysyd"><span>重要水源地</span></li> -->
<!--     							<li id="dxssz"><span>地表水水质</span></li> -->
<!--     							<li id="dbssz"><span>地下水水质</span></li> -->
<!--     						</ul> -->
<!--     						<div class="triangle-facing-left"></div> -->
<!--     					</div> -->
<!--     				</li> -->
    				
<!--     				<li id="sjzl"><a><img src="<%=basePath%>images/index/jsxw-01.png" /><span>资料管理</span><div class="triangle-facing-right"></div></a> -->
<!--     					<div class="child_menu_div" style="top: -30px;"> -->
<!--     						<ul class="child_menu"> -->
<!--     							<li id="xmgl"><span>项目管理</span></li> -->
<!--     							<li id="dsj"><span>大事记</span></li> -->
<!--     							<li id="wjzl"><span>文件资料</span></li> -->
<!--     							<li id="flfgbz"><span>法律法规与标准规范</span></li> -->
<!--     							<li id="txl"><span>通讯录</span></li>    							 -->
<!--     							<li id="zjk2"><span>专家库</span></li> -->
<!--     							<li id="tpk"><span>图片库</span></li> -->
<!--     						</ul> -->
<!--     						<div class="triangle-facing-left"></div> -->
<!--     					</div> -->
<!--     				</li> -->
    				<%-- <li id="qxjdm"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>区县界断面</span></a></li> --%>
    			</ul>


    			<ul id="szybhgl_ul" class="left_url" style="display:none;">
<!--     				<li id="sgnq"><a><img src="<%=basePath%>images/index/jsl-01.png" /><span>水功能区</span></a></li> -->
<!--     				<li id="rhpwk"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>入河排污口</span></a></li> -->
<!--     				<li id="yysyd"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水源地</span></a></li> -->
<!--     				<li id="szybh_sjdm"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水质站</span></a></li> -->
<!--     				<li id="szybh_szzd" ><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水质自动站</span></a></li> -->
<!--     				<li id="zdhhpg" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>生态流量管控</span></a></li>  -->
    				
    				<li id="szybhglsy"><a><img src="<%=basePath%>images/index/jssy-01.png" /><span>首页</span></a></li>    				    				
    				<li id="lygk"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>流域概况</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -30px;">
    						<ul class="child_menu">
    							<li id="szybhgk"><span>水环境概况</span></li>
    							<li id="gzzn2"><span>工作职能</span></li>
    							<li id="jgsz"><span>机构设置</span></li>
<!--     							<li id="txl2"><span>通讯录</span></li> -->
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				<li id="xwdt" style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/water-01.png" /><span>新闻动态</span></a></li>     				
    				<li id="ywgz"><a><img src="<%=basePath%>images/index/ztyj-01.png" /><span>业务管理</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -30px;">
    						<ul class="child_menu">
    							<li id="stllgk"><span>生态流量管控</span></li>
    							<li id="dxsccqzhzl"><span>地下水超采区综合治理</span></li>
    							<li id="yysszybh"><span>饮用水水源保护</span></li>
    							<li id="tfswryd"><span>突发水污染应对</span></li>
    							<li id="shjzl"><span>水环境质量</span></li>
<!--     							<li id="szybhyb"><span>水资源保护月报</span></li> -->
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				
    				<li id="sjtb"><a><img src="<%=basePath%>images/index/tzwj-01.png" /><span>数据填报</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -30px;">
    						<ul class="child_menu">
    							<li id="dxstb"><span>地下水通报</span></li>
    							<li id="zysyd"><span>重要水源地</span></li>
    							<li id="dxssznb"><span>地下水水质年报</span></li>
    							<li id="dbsszyb"><span>地表水水质月报</span></li>
    							<li id="stllkh"><span>生态流量评价信息</span></li>
    							
<!--     							<li id="dbssz"><span>地表水水质</span></li> -->
<!--     							<li id="dxssz"><span>地下水水质</span></li> -->
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				
    				<li id="sjzl"><a><img src="<%=basePath%>images/index/jsxw-01.png" /><span>资料管理</span><div class="triangle-facing-right"></div></a>
    					<div class="child_menu_div" style="top: -30px;">
    						<ul class="child_menu">
    							<li id="xmgl"><span>项目管理</span></li>
    							<li id="dsj"><span>大事记</span></li>
    							<li id="wjzl"><span>文件资料</span></li>
    							<li id="flfgbz"><span>法律法规与标准规范</span></li>
    							<li id="txl"><span>通讯录</span></li>    							
    							<li id="zjk2"><span>专家库</span></li>
    							<li id="tpk"><span>图片库</span></li>
    						</ul>
    						<div class="triangle-facing-left"></div>
    					</div>
    				</li>
    				<%-- <li id="qxjdm"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>区县界断面</span></a></li> --%>
    			</ul>


    			<ul id="lyzg_ul" class="left_url" style="display:none;">
    				<li id="zgsyd"><a><img src="<%=basePath%>images/index/jsl-01.png" /><span>饮用水水源地</span></a></li>
    				<li id="zgsgnq"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水功能区</span></a></li>
    				<li id="lyzg_sjdm"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>省界水质站</span></a></li>
    				<%-- <li id="lyzg_yyssyd"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>饮用水水源地</span></a></li> --%>
    				<li id="lyzg_swllz"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>省界水文站</span></a></li>
    				<li id="lyzg_ldswz"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>雷达水位站</span></a></li>
    				<li id="lyzg_szzdz"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水质自动站</span></a></li>
    				
    			</ul>
    			<ul id="rcgl_ul" class="left_url" style="display:none;">
    				<li id="rcgl_spgcgl"><a><img src="<%=basePath%>images/index/jsl-01.png" /><span>审批过程管理</span></a></li>
    				<li id="rcgl_wfzgl"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>委发证管理</span></a></li>
    				<%--<li id="rcgl_ssfzgl"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>省市发证管理</span></a></li>--%>
    				<%--<li id="rcgl_llfztj"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>流域发证统计</span></a></li>--%>
					<li id="rcgl_llfztj"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>发证统计</span></a></li>
    				<li id="rcgl_dsgl"  style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>调水管理</span></a></li>
    			<li id="lyzg_zysjtj" ><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>数据统计</span></a></li>
    				<li id="lyzg_zlxx"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>项目管理</span></a></li>
    				<li id="lyzg_szygb" ><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水资源公报</span></a></li>
    				<li id="lyzg_szynb"  style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>水资源年报</span></a></li>
    				<li id="lyzg_sthx"  style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>三条红线</span></a></li>
    				<li id="lyzg_flfg"  style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>法律法规</span></a></li>
					<li id="lyzg_jdjc"  style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>取用水监督检查</span></a></li>
					<li id="lyzg_expert"  style="border-bottom-width:1px"><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>专家库</span></a></li>
					<li id="lyzg_log"  style="border-bottom-width:1px; "><a><img src="<%=basePath%>images/index/szyl-01.png" /><span>日志记录</span></a></li>
    			</ul>
    		</div>
    		<div id="bodyrightDiv" class="body_right">
    			<iframe id="bodyIframe" style="width:100%;height:100%" border="none" src=""></iframe>
    		</div>
    	</div>
    </div>
  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
      <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  
  <script type="text/javascript" src="<%=basePath %>pages/index/index.js"></script>
  
</html>
