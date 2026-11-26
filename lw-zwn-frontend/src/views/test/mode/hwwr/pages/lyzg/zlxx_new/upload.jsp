<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String proj_cd = request.getParameter("proj_cd")==null?"":request.getParameter("proj_cd");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'upload.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script>
		var basePath = '<%=basePath%>';
		var proj_cd = '<%=proj_cd%>';
	</script>
	

  </head>
  <style type="text/css">
  .mainTableCss{
	table-layout:fixed;
	border-collapse: collapse;
    border-spacing: 0;
    border-left: 1px solid #d8d8d8;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    border-right: 1px solid #d8d8d8;
	background-color:#FFFFFF;
	width: 100%;
	margin:0;
}

.mainTableCss td{
	border-right: 1px;
	border-right-color: #d8d8d8;
	border-right-style: solid;
	border-bottom: 1px;
	border-bottom-color: #d8d8d8;
	border-bottom-style: solid;
	text-align: center;
	
}

.mainTableCss thead td{

	background-color: #F5F5F5; 
	font-size: 12px;
	color:#4c4c4c;
	height: 28px;
	letter-spacing: 3px;
	font-family: '微软雅黑';
	background-position: right;
	background-repeat: no-repeat;
}
.mainTableCss thead tr{
	height:30px;
    font-weight: bold;
}
.mainTableCss tbody tr{
	font-size: 12px;
	height: 30px;
}
.mainTableCss tbody td{
	
}
table   input{
	width: 100%;
	height: 30px;
	text-align: left;	
	border: 1px solid #a5a5a5;
	border-style:solid;
	border-radius:2px;
}

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
	
  </style>
  <body>
  		<div>
				<form id="uploadfileform" action="<%=basePath %>sjtj/sjqk_new/uploadFile"   enctype="multipart/form-data"  method="POST"  style="font-size: 14px;">
					<table class="mainTableCss"  style="margin-top: 10px;">
						<thead>
							<tr>
								<td colspan="3">附件上传</td>
							</tr>
						</thead>				
						<tbody>
							<tr style="display:none;">
								<td><input name="proj_cd"  value="<%=proj_cd %>"></input></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>
									附件类型: 
									<select id="attachtype"   name="type_id"  style="width:60%; height:22px; color:#000000;border:1px solid #a5a5a5">
									</select>
									
									<div onclick="attachs()" style="background-image:url('<%=basePath %>/images/index/qsxk-01.png');float: right;
									    width: 9%;
									    height: 22px;
									    background-size: contain;
									    background-repeat: no-repeat;
									    background-position: left;
									    cursor:pointer">
									
									</div>
								</td>
								<td>
									<input type="file" name="file" id="file"  value=""  style="margin-left: 15px;border: none;padding-top: 4px;width: 190px;"/>
								</td>
								<td>
									<input type="submit"  value="上传"  style="width: 40px;height: 22px;background-color: white;"></input>
								</td>
							</tr>
						</tbody>
					</table>
				</form>
  		</div>
		<table class="mainTableCss"  style="margin-top: 10px;">
			<thead>
				<tr>
					<td>附件类型</td>
					<td>附件</td>
					<td>操作</td>
				</tr>
			</thead>				
			<tbody id="attatchs">
				
			</tbody>
		</table>
	</table>   	

  </body>
  <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
  <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
  <script type="text/javascript" src="<%=basePath%>common/js/jquery/jquery.form.js"></script>
  <script>
  $(document).ready(function(){
	$("#uploadfileform").submit(function(event) {
		var index = layer.load();
			$.ajax({
				url : $('#uploadfileform').attr('action'),
				type : 'POST',
				contentType : false,
				processData: false,
				data : new FormData($("#uploadfileform")[0]),
				success : function(data) {
					layer.close(index);
					// 
					if (data && data.STATUS=="Y") {
						addrow();
					}
					else {
						alert("上传失败");
					}
					
				},
				error : function(data) {
					layer.close(index);
					alert("上传失败");
				}
			});
			return false;
		});

		var date = new Date();
		var getYr = date.getFullYear();
		for (var i = 0; i < 7; i++) {
			if (i == 6) {
				opt.attr("selected", true);
			}
			var opt = $('<option>');
			opt.attr("value", (getYr + i - 5));
			opt.html((getYr + i - 5));
			opt.appendTo($('#yr'));
		}

		getattachtype();
		addrow();
	});

			function upload() {
				layer.open({
					type : 1,
					title : false,
					closeBtn : 0,
					area : '516px',
					skin : 'layui-layer-nobg', //没有背景色
					shadeClose : true,
					content : $('#uploadfileform')
				})
			}

			function getattachtype() {
				$('#attachtype').empty();
				$.get(basePath + 'sjtj/sjqk_new/getFileType', {},
						function(data) {
							if (data != null && data.length > 0) {
								var str = "";
								for (var i = 0; i < data.length; ++i) {
									str += "<option value='"+data[i].id+"'>"
											+ data[i].name + "</option>";
								}
								$('#attachtype').append(str);
							}

						});

			}

			function addrow() {

				$.post(
						basePath + 'sjtj/sjqk_new/getProjectFiles',
						{
							PROJ_CD : proj_cd
						},
						function(data) {
							$('#attatchs').empty();
							if (data && data.length > 0) {
								var strs = "";
								for (var i = 0; i < data.length; ++i) {
									var row = data[i];
									var str = "<tr>";
									str += "<td style='display:none;'>"
											+ row.file_id + "</td>";
									str += "<td style='display:none;'>"
											+ row.proj_cd + "</td>";
									str += "<td style='display:none;'>"
											+ row.type_id + "</td>";
									str += "<td style='display:none;'>"
											+ row.file_org_name
											+ "</td>";
									str += "<td style='display:none;'>"
											+ row.file_path + "</td>";
									str += "<td style=''>"
											+ row.type_nm + "</td>";
									str += "<td style=''>"
											+ row.file_name + "</td>";
									str += "<td style=''><a href='javascript:downloadf(\""
											+ row.file_path
											+ "\",\""
											+ row.file_org_name
											+ "\")'>下载</a>";
									if((row.file_org_name).substring(row.file_org_name.length-3,row.file_org_name.length)=='pdf')		
									{str +=	"&nbsp;<a href='javascript:ylf(\""
												+ row.file_path
												+ "\",\""
												+ row.file_org_name
												+ "\")'>预览</a>";}
											
								str += "&nbsp;<a href='javascript:delf(\""
											+ row.proj_cd
											+ "\",\""
											+ row.file_id
											+ "\")'>删除</a></td>";
									str += "</tr>";
									strs += str;
								}
								$('#attatchs').append(strs);
							}
							else {
								var strs = "";
								for (var i = 0; i < 3; ++i) {
									var str = "<tr>";
									str+="<td></td>";
									str+="<td></td>";
									str+="<td></td>";
									str+="</tr>";
									strs+=str;
								}
								$('#attatchs').append(strs);
							}
						})

			}

			function downloadf(file_path, file_name) {
				window.location.href=basePath+"/sjtj/sjqk_new/downloadfile?filepath="+file_path+"&filename="+file_name;
			}
			function ylf(file_path, file_name) {
				window.open(basePath+"/sjtj/sjqk_new/tempName?filepath="+file_path+"&filename="+file_name);
			}

			function delf(proj_cd, file_id) {
				$.get(basePath+'sjtj/sjqk_new/delProjectFile',{
					FILE_ID: file_id,
					PROJ_CD: proj_cd
				},function(data){
					addrow();
				})
			}

			function attachs() {
				  parent.layer.open({
					  type: 2,
					  title : ["附件类型" , true],
					  area: ['345px', '450px'], //宽高
					  content: basePath+"pages/lyzg/zlxx_new/attach.jsp",
					  cancel: function() {
						  getattachtype();
					  }
					});
			}
			
		</script>
</html>
