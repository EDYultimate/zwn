<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<!--     		<link rel="stylesheet" href="<%=basePath %>pages/szybh/ywgz/ecologyFlow/map/ztree/css/demo.css" type="text/css"> -->
    
    <link rel="stylesheet" href="<%=basePath%>common/css/ztree/zTreeStyle/zTreeStyleCustom.css" type="text/css">
    <script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath%>common/js/common.js"></script>
        
    <title>考核设置</title>

    <script>
    var basePath = '<%=basePath%>';
   </script>
    <style>
       ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #ced5d6;
        }
        .check {
            height: 15px;
            width: 20px;
        }
        .ckin {
            width: 20px;
        }
        .ztree li span.button.chk.checkbox_true_part {
            background-position:-14px 0
        }
        .ztree li span.button.chk.checkbox_false_part {
            background-position: 0 0;
        }

        /*为了适配国产系统火狐浏览器*/
        .bbTable {
            border-collapse: separate;
        }
        
        ul.ztree {
        overflow: auto scroll;
        }
        
        .ztree li {    padding: 10 0 0 0; }
		.ztree * {padding:0; margin:0; font-size:16px; font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif}
		/* .ztree li a {padding:4px 3px 4 0; margin:0; cursor:pointer; height:17px; color:#333; background-color: transparent; */
		.ztree li a.curSelectedNode {background-color:#deefff; color:black; border:none;}
		.ztree li ul.line {margin-left: 18;}
		.ztree li ul {margin-left: 18;background: url('<%=basePath %>/common/css/ztree/zTreeStyle/img/line_conn.gif') 0 0 repeat-y;}
		
       </style>

  </head>
  
  <body style="overflow: hidden;">
   
	<div>

    <div style="width: 310; float: left; height: calc(100% - 250px); margin-top: 20px; ">
		<ul id="treeDemoCheck" style="width:100%;margin-left: 10;height:560px;" class="ztree" ></ul>						
    </div>

    <div style="width: 65%; float: right; height: 660; overflow-y: auto ">
        <div   style="height:100%;">
            <div style="text-align: center;">
                <span id="gbtitle" style="font-weight:bold;color:black;font-size: 16;font-family: Microsoft YaHei;">断面考核阈值设置</span>
            </div>
            <div style="width: 95%; overflow-x: auto;margin-top: 20;">
            
                <table id="table" class="bbTable" style="height: 10%;" >
                    <thead id="theads">
 				<tr>
            <td rowspan="2" >考核指标</td>
            <td rowspan="2">考核评价长</td>
            <td rowspan="2" >考核目标</td>
            <td rowspan="2">考核期</td>
        	</tr>
                    </thead>
                    <tbody id="TableData">
                    <tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							
						</tr>
                    </tbody>
                </table>
            </div>


            <div id="charts" style="width: 99%; height: 500px; margin-top: 20px;margin-bottom: 20px;">
	

            </div>
        </div>
    </div>

</div>
   


  </body>
  
<script type="text/javascript" src="<%=basePath%>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.core.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.excheck.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/szygb/common/types.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/szybh/ywgz/ecologyFlow/checkSet/checkSet.js"></script>

</html>
