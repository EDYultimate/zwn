<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
        String yr = request.getParameter("yr")==null?"":request.getParameter("yr");
      String wpc_cd = request.getParameter("id")==null?"":request.getParameter("id");
  
  
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>取水证检查内容-问题修改（只能修改，不能新增）</title>
    <link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/layui/css/layui.css">
        <link rel="stylesheet" href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css">
      <link rel="stylesheet" href="<%=basePath %>common/js/layui/css/modules/mutiselect/mutiselect.css">
    <style type="text/css">
        tr {
            cursor: auto;
        }

        input {
            width: 200px;
        }

.problemTable input{width:120px}
.problemTable{margin-top:10px}

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
<input id="wpc_cd" style="display:none">
<table id="table" class="bbTable"  style="height: 80%;">
    <tbody>
    <tr>
        <td><span class="sred">*</span>问题列表</td>
        <td>
<!--         <input id="yr" name="pram" onclick="WdatePicker({onpicking: initNM, dateFmt: 'yyyy'})"></input>
 -->     
 			<form class="layui-form">  
 				 <div class="layui-tab-item layui-show">
                       <div id="ad_select" class="layui-block">
                                    <div id="ad_nm_pr" class="layui-input-inline ad_input" >
                                        <input id="problemSel" name="problemSel" multiple lay-search lay-case lay-omit lay-tools lay-filter="problemSel">
                                    </div>
                         </div>
                  </div>
            </form>

  </td>
        <td><span class="sred">*</span>取水许可证</td><td ><input style='cursor:pointer' id="wpc_sn" name="pram">
        </td>
    </tr>
    <tr>
        <td><span class="sred">*</span>监管单位</td><td><input id="conc_org" name="pram"></input></td>
        <td><span class="sred">*</span>取水权人</td><td><input id="wrp_nm" name="pram" style="background-color: white;"></input></td>
    </tr>
   
    </tbody>
</table>


<div class="layui-tab layui-tab-card" lay-filter="ListFilter" lay-allowclose="true">
  <ul class="layui-tab-title">
 
  </ul>
  <div class="layui-tab-content">
   
  </div>
  
  
</div>






<div id="problemDiv" style="width:100%;">

</div>

<!-- <table id="filetable" class="bbTable"  style="height: 15%;">
    <tbody>
    <tr style="height:90px">
        <td style="width:102px">
            <a href="javascript:;" class="a-upload">
                <input id="uploadfile" type="file" name="files" >上传文件
            </a>
        </td>
        <td style="height: 75px;">
            <div id="scrollfiles"  style="height: 70px;overflow-y: auto;">
                <table style="width:100%">
                    <tbody id="uploadfiles" >

                    </tbody>
                </table>
            </div>
        </td>
    </tr>
    </tbody>
</table>

 -->
<div style="height: 5%; position: absolute; left: 45%;margin-top: 7px">
    <input type="button" value="保存" class="sb_input" style="width:90px;" onclick="saveProblem()">
<!--     <input type="button" value="保存" class="sb_input" style="width:90px;margin-left:50px" onclick="saveProblem()"> -->
</div>

</body>
<script type="text/javascript">

    var basePath = "<%=basePath%>";
 
    var  yr= "<%=yr%>";
    var  wpc_cd= "<%=wpc_cd%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layui/layui.all.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/layui/lay/modules/mutiselectform.js"></script>

<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>

<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/verify/verify.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/jdjc/checktmDialog/editProblemInfo.js"></script>

</html>