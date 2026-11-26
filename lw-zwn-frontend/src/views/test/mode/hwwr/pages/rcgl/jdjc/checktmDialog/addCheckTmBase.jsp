<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
 String id = request.getParameter("id")==null?"":request.getParameter("id");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>新建巡查次数基础信息</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
 <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/multselect/mselect.css">
    <link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
    <script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
    <style type="text/css">
        tr {
            cursor: auto;
            text-align:center;
            line-height:30px
        }

        input {
            width: 200px;
        }


        .a-upload {
            position: relative;
            width:60px;
            background: #fafafa;
            overflow: hidden;
            display: inline-block;
            padding:0px 10px 0 2px;
            border-radius: 15px;
            border: 1px solid #E1E1E1;
            background-color: rgba(2, 194, 153, 1);
            outline: none;
            color: #FFFFFF;
            height: 20px;
            cursor: pointer;
            text-decoration: none;
            
        }

        .a-upload  input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            opacity: 0;
            filter: alpha(opacity = 0);
        }


        .loadfilespan {
            margin-left: 5px;
        }

        .sred {
            color: red;
        }
        .addDiv{
            width: 20px;
		    height: 20px;
		    border: 1px solid #4e4a4a;
		    border-radius: 50px;
		    text-align: center;
		   	margin:auto;
		    line-height: 20px;
		    cursor: pointer;
		    margin-top:5px
		    }
    </style>
  </head>
  
<body style="overflow: auto;">
   
<table id="table" class="bbTable" >
    <tbody>
    <tr>
   		<td>巡查时间<span class="sred">*</span></td><td><input id="tm" name="pram" onclick="WdatePicker({onpicking: initNM, dateFmt: 'yyyy-MM-dd'})"></input></td>
        <td>巡查人员<span class="sred">*</span></td><td><input id="xc_per" name="pram"></input></td>
    </tr>
    <tr>
       <td>相关取水许可证<span class="sred">*</span></td><td onclick="wiuPage()"><button style='cursor:pointer' id="wpc_sn" name="pram">选择</button></td>
    </tr>
    </tbody>
</table>
   
   <div style="width:100%;">
		<table   class="bbTable" style="font-size: 14px;font-family: fantasy;">
		<thead>
			<tr>
			<td width="210px">取水许可证</td>
			<td>取水口</td>
			<td>取水权人</td>
			<td>操作</td>
			</tr>
		</thead>
		<tbody id="wpcListDiv" >
		</tbody>
		</table>
   </div>
    <input type="button" value="保存" class="sb_input" style="width:90px;margin-left:45%;margin-top:20px" onclick="saveXcBase()">
  </body>
 
  <script type="text/javascript">
    var basePath = "<%=basePath%>";
    var id = "<%=id%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/jdjc/checktmDialog/addCheckTmBase.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/multselect/jquery.mselect.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/verify/verify.js"></script>
</html>
