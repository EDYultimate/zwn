<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String wpc_cd = request.getParameter("wpc_cd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>审批过程管理</title>
<link rel="stylesheet" href="<%=basePath%>common/css/common.css" type="text/css">
<link rel="stylesheet"  href="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.css" >
<script type="text/javascript" src="<%=basePath%>common/js/echart/echarts-all-3.js"></script>
<script type="text/javascript">
	var basePath = "<%=basePath%>";
	var wpc_cd = "<%=wpc_cd%>";
</script>
<style type="text/css">
	
	html{
	  height:100%;
	  margin-top:5px;
	  margin-bottom:20px;
	}
	tr {
	    cursor: auto;
	}
	
	/* input {
		width: 200px;
	} */
	
	
	.a-upload {
	    position: relative;
	    background: #fafafa;
	    overflow: hidden;
	    display: inline-block;
	    padding: 0px 20px 0 20px;
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
	
	
	.bbTable>tbody>tr>td, th {
    height: 5px;
    padding: 0px 0px;

    }
    
    .bbTable>tbody>tr {
    height: 5px;   
    }
    
    input {
	  height: 20px;
	  width: 50px;
	}
	
	tbody>tr>td{
	   height: 25px;
	}
	
</style>
</head>
<body style="height:100%">
	 <div style="overflow:auto;height:90%;">
		<table id="table" class="bbTable"  >
			<tbody>
				<tr>
					<td colspan='4'>取水许可证编号</td><td colspan='13'><input id="WPC_SN"  style="width:300px;"></input></td>
					<!-- <td colspan='4'>取水项目名</td><td colspan='13'><input style="width:300px;"></input></td>	 -->				
				</tr>
				<tr>
					<td colspan='4'>取水权人名称</td><td colspan='13'><input id="WRP_NM" style="width:300px;"></input></td>
				</tr>
			    <tr>				
					<td colspan='4'>法人代表</td><td colspan='13'><input id="LR_NM" style="width:300px;"></input></td>
				</tr>
				<tr>			
					<td colspan='4'>联系人</td><td colspan='13'><input id="DRAW_STAFF" style="width:300px;"></input></td>
				</tr>
				<tr>
					<td colspan='4'>联系电话</td><td colspan='13'><input id="DRAW_TEL" style="width:300px;"></input></td>					
				</tr>
				<tr>
					<td colspan='4'>变更记录</td><td colspan='13'><input  style="width:300px;"></input></td>
				</tr> 
				<tr>
					<td colspan='4'>延续记录</td><td colspan='13'><input style="width:300px;" ></input></td>
				</tr> 
				<tr>
					<!-- <td rowspan="9">取水户动态信息</td>	 -->
					<td rowspan="24">取水户动态信息</td>
					<td rowspan="8"><input id='yr01'></input></td>	
					<td colspan='2'>月份</td>	
					<td >1</td>
					<td >2</td>	
					<td >3</td>	
					<td >4</td>	
					<td >5</td>
					<td >6</td>
					<td >7</td>	
					<td >8</td>	
					<td >9</td>	
					<td >10</td>
					<td >11</td>	
					<td >12</td>	
					<td >合计</td>							
				</tr>				
				<tr>
					<td rowspan="3">生产状况</td>	
					<td >设计规模</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>							
				</tr>
				<tr>		
					<td >实际生产</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>										
				</tr>
				<tr>	
					<td >生产效率</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>										
				</tr>
				<tr>
					<td rowspan="4">用水情况</td>	
					<td >许可水量</td>	
					<td colspan="13" ><input style="width:150px;"></input></td>
											
				</tr>
				<tr>		
					<td >申请计划</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>										
				</tr>
				<tr>	
					<td >批复计划</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>										
				</tr>
				<tr>	
					<td >实际用水</td>	
				<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>					
					<td rowspan="8"><input id='yr02'></input></td>	
					<td colspan='2'>月份</td>	
					<td >1</td>
					<td >2</td>	
					<td >3</td>	
					<td >4</td>	
					<td >5</td>
					<td >6</td>
					<td >7</td>	
					<td >8</td>	
					<td >9</td>	
					<td >10</td>
					<td >11</td>	
					<td >12</td>	
					<td >合计</td>							
				</tr>				
				<tr>
					<td rowspan="3">生产状况</td>	
					<td >设计规模</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>						
				</tr>
				<tr>		
					<td >实际生产</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>	
					<td >生产效率</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>
					<td rowspan="4">用水情况</td>	
					<td >许可水量</td>	
					<td colspan="13"><input style="width:150px;"></input></td>
											
				</tr>
				<tr>		
					<td >申请计划</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>	
					<td >批复计划</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>	
					<td >实际用水</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				
				<tr>					
					<td rowspan="8"><input id='yr03'></input></td>	
					<td colspan='2'>月份</td>	
					<td >1</td>
					<td >2</td>	
					<td >3</td>	
					<td >4</td>	
					<td >5</td>
					<td >6</td>
					<td >7</td>	
					<td >8</td>	
					<td >9</td>	
					<td >10</td>
					<td >11</td>	
					<td >12</td>	
					<td >合计</td>							
				</tr>				
				<tr>
					<td rowspan="3">生产状况</td>	
					<td >设计规模</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>						
				</tr>
				<tr>		
					<td >实际生产</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>	
					<td >生产效率</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>
					<td rowspan="4">用水情况</td>	
					<td >许可水量</td>	
					<td colspan="13"><input style="width:150px;"></input></td>
											
				</tr>
				<tr>		
					<td >申请计划</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>	
					<td >批复计划</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				<tr>	
					<td >实际用水</td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>
					<td ><input></input></td>	
					<td ><input></input></td>	
					<td ><input></input></td>								
				</tr>
				
				
				
				<tr>
					<td rowspan="6" colspan='2'>监管检查动态信息</td> 
					<td rowspan="3">时间</td>	
					<td >检查概况</td>	
					<td colspan="13"><input style="width:300px;"></input></td>										
				</tr>
				<tr>	
					<td >发现问题</td>	
					<td colspan="12"><input style="width:300px;"></input></td>					
					<td style="cursor:pointer"> 
					    <a href="javascript:;" class="a-upload">
							<input id="uploadfile" type="file">附件上传
						</a>
					</td>							
				</tr>
				<tr>	
					<td >整改要求</td>	
					<td colspan="12"><input style="width:300px;"></input></td>	
					<td style="cursor:pointer">
						  <a href="javascript:;" class="a-upload">
								<input id="uploadfile" type="file">附件上传
						</a></td>							
				</tr>
				<tr>
					<td rowspan="3">时间</td>	
					<td >检查概况</td>	
					<td colspan="13"><input style="width:300px;"></input></td>							
				</tr>
				<tr>	
					<td >发现问题</td>	
					<td colspan="12"><input style="width:300px;"></input></td>					
					<td style="cursor:pointer">
					         <a href="javascript:;" class="a-upload">
									<input id="uploadfile" type="file">附件上传
							 </a>					
					</td>							
				</tr>
				<tr>	
					<td >整改要求</td>	
					<td colspan="12"><input style="width:300px;"></input></td>	
					<td style="cursor:pointer">
					         <a href="javascript:;" class="a-upload">
									<input id="uploadfile" type="file">附件上传
							 </a>
					</td>							
				</tr>	
			</tbody>
		</table>
		
		<!-- <div style="height:20px;bottom: 5px; left: 35%;">
			<input type="button" value="取消" class="sb_input" style="width:90px" onclick="cancel()">
			<input type="button" value="保存" class="sb_input" style="width:90px;margin-left:50px" >
	    </div> -->

	</div>
		
	 <div style="height: 5%; position: absolute; bottom: 2%; left: 45%;margin-bottom:0.5%;">
			<input type="button" value="取消" class="sb_input" style="width:90px" onclick="cancel()">
			<input type="button" value="保存" class="sb_input" style="width:90px;margin-left:50px" onclick="save()">
	</div>
</body>
<script type="text/javascript">
var basePath = "<%=basePath%>";
</script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.ui.widget.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.iframe-transport.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-upload/jquery.fileupload.js"  ></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery-download/jquery.fileDownload.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript"  src="<%=basePath %>common/js/perfect-scrollbar/perfect-scrollbar.jquery.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/rcgl/wfzgl/xbyxkz/dialog/check.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/calendar/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/moment/moment-with-locales.min.js"></script>
</html>