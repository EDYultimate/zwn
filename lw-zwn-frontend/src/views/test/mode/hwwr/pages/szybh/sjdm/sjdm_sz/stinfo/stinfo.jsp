<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>测站基础信息</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/layers.css" type="text/css">
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	<script>var basePath = '<%=basePath%>';</script>
  </head>
  <body>
    <div>
    	<table>
    		<tbody id="tbody">
    		<tr>
    			<td style="width:80px;">测站名称</td>
    			<td id="st_nm"></td>
    			<td style="width:80px;">管理单位</td>
    			<td id="org_nm"></td>
    		</tr>
    		<tr>
    			<td>测站类别</td>
    			<td id="st_tp"></td>
    			<td>所在地</td>
    			<td id="loc"></td>
    		</tr>
    		<tr>
    			<td>测站岸别</td>
    			<td id="stbk"></td>
    			<td>水流流向</td>
    			<td id="flow_dir"></td>
    		</tr>
    		<tr>
    			<td>基面类型</td>
    			<td id="dat_tp"></td>
    			<td>基面高程</td>
    			<td id="dat_elev"></td>
    		</tr>
    		<tr>
    			<td>修正基值</td>
    			<td id="mod_bas_val"></td>
    			<td>修正参数</td>
    			<td id="mod_para"></td>
    		</tr>
    		<tr>
    			<td>监测方式 A</td>
    			<td id="mon_tp_a"></td>
    			<td>监测方式 B</td>
    			<td id="mon_tp_b"></td>
    		</tr>
    		<tr>
    			<td>设站年月</td>
    			<td id="est_st_ym"></td>
    			<td>运行状况</td>
    			<td id="run_cond"></td>
    		</tr>
    		</tbody>
    	</table>
    </div>
  </body>
  <script type="text/javascript" src="<%=basePath %>pages/szybh/sjdm/sjdm_sz/stinfo/stinfo.js"></script>
</html>
