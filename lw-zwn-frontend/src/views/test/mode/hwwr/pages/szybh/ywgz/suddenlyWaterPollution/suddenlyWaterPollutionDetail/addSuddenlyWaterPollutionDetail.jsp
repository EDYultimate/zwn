<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>新增突发水污染案例</title>
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="<%=basePath%>common/css/jquery.multiselect.css">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	<link rel="stylesheet" href="<%=basePath%>common/js/elementUI/index.css" type="text/css">
	
	
	<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
	 <script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
	<script type="text/javascript" src="<%=basePath%>common/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="<%=basePath%>common/js/jquery.multiselect.js"></script>
	
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.ui.widget.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.iframe-transport.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-process.js'></script>
	<script type='text/javascript' src='<%=basePath%>common/js/jquery/FileUpload/jquery.fileupload-validate.js'></script>
	
	<script type="text/javascript" src="<%=basePath %>common/js/elementUI/vue.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/elementUI/index.js"></script>


	<style>
	body{font-size:14px}
	table{border-collapse:collapse;border-spacing:0;border-left:1px solid #999;border-top:1px solid #999;border-bottom:1px solid #999;font-size:14px}
	table>th,.table>td{border-right:1px solid #999;padding:5px 15px;}
	table>tbody>tr>td{border:1px solid #999;height:31px;width: 90px;}
	table>thead>tr>td{border-right:1px solid #999;padding:5px 15px;}
	textarea{width:350px; height:90px;}
	input[type="text"]{height:25px;width:100%;border:none}
	.a-upload {
	    position: relative;
	    background: #fafafa;
	    overflow: hidden;
	    display: inline-block;
	    padding: 0px 20px 0 20px;
	    border-radius: 15px;
	    border: 1px solid #E1E1E1;
	    /* background-color: rgba(2, 194, 153, 1); */
	    background-color:#17BDB0;
	    outline: none;
	    color: #FFFFFF;
	    width:70px;
	    height: 22px;
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
table tr td:nth-child(odd){      /* 基数列 */
    background-color:#f5f4f3;
    font-size: 14px;
    font-weight: bold;
}

.el-autocomplete {
      width: 170;
      }
      
      .el-input__inner {  
 		  border-radius: 15px;
  		 height: 30px;   
}
	</style>
  </head>
  <script>
  	var basePath = "<%=basePath%>";
  </script>
  <body style="overflow: hidden;">
  	  <div id="bbxxDiv" style="width: 100%;height: 95%;overflow: hidden;margin-top: 15px;">
     	<div style="width:100%;padding-left:10px;height:100%;overflow-y:scroll; ">
     		<div id="bbTableDiv" style="width:100%;">
     		<input id="fileuid" style="display: none;">
     		
	     		<table width="700" height="30">
				<tr>
						<td ><div align="center" style="color:red">*案例名称</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="CASE_NM" name="CASE_NM"  >
						</td>
						<td><div align="center">所在河湖</div><div align="center"></div></td>
						<td style="text-align:center">
							<div id="app" style="display: inline;">				
			    				<el-autocomplete id="RIVER_NM" class="inline-input" v-model="state1"  :fetch-suggestions="querySearch" 
			   					  @select="handleSelect" > </el-autocomplete>		
							</div>
						</td>
			
<!-- 				    <td><div align="center">性别</div><div align="center"></div></td> -->
<!-- 				    <td style="text-align:center"> -->
<!-- 						<select id="EXP_SEX"> -->
<!-- 							<option value="1">男</option> -->
<!-- 							<option value="2">女</option> -->
<!-- 							<option value="3">其他</option> -->
<!-- 						</select> -->
<!-- 				    </td> -->
				  </tr>
					<tr>
<!-- 						<td><div align="center">所在处室:</div>     -->
<!-- 						  <div align="center"></div></td> -->
<!-- 						<td style="text-align: center;"> -->
<!-- 							<input id='office' type='text'/> -->
<!-- 							<input id='BRITHDAY' type='text' onClick="WdatePicker({ dateFmt: 'yyyy-MM-dd'})"/> -->
<!-- 						</td> -->
					
					<td><div align="center" style="color:red">*发生地点</div><div align="center"></div></td>
					<td colspan="3" style="text-align:center">
						<input type="text" id="ADDRESS" name="ADDRESS"  >
					</td>
					</tr>
					
					<tr>
					<td><div align="center">类别</div><div align="center"></div></td>
					<td style="text-align:center">
						<select id="TP" name="TP">
								<option value="1">蓝藻爆发</option>
								<option value="2">人为泄露</option>
								<option value="3">日常排污</option>
								<option value="4">其它</option>
							</select>
					</td>
					
					<td><div align="center" style="color:red">*发生时间</div><div align="center"></div></td>
					<td style="text-align:center">
						<input id='H_DATE' type='text' onClick="WdatePicker({ dateFmt: 'yyyyMM'})"/>
					</td>
					</tr>
					
					<tr>
<!-- 					<td><div align="center">*手机号</div><div align="center"></div></td> -->
<!-- 					<td style="text-align:center"> -->
<!-- 						<input type="text" id="phoneNumber" name="officePhoneNumber"  > -->
<!-- 					</td> -->
					<td><div align="center">应急处置方法</div><div align="center"></div></td>
					<td colspan="3" style="text-align:center">
						<input type="text" id="HANDLE" name="HANDLE"  >
					</td>					
					</tr>
					
					<tr>
						<td><div align="center">是否上报水利部</div></td> 
						<td  style="text-align:center">
							<select id="REPORT" name="REPORT">
								<option value="1">是</option>
								<option value="0">否</option>								
							</select>
						</td>	
						<td><div align="center">处置结果</div><div align="center"></div></td>
						<td style="text-align:center">
							<input type="text" id="RES" name="RES"  >
						</td>			
					</tr>
					<tr>
						<td><div align="center" style="color:red">*是否重大</div></td> 
						<td  colspan="3" style="text-align:center">
							<select id="IMP" name="IMP">
								<option value="1">是</option>
								<option value="0">否</option>								
							</select>
						</td>									
					</tr>
<!-- 					<tr> -->
<!-- 					<td><div align="center">备注</div><div align="center"></div></td> -->
<!-- 					<td  colspan="3" style="text-align:center"> -->
<!-- 						<textarea rows="5" cols="5" id="remark" name="remark"></textarea> -->
<!-- 					</td> -->
<!-- 					</tr> -->
<!-- 					<tr> -->
<!-- 					<td><div align="center">专家类型</div><div align="center"></div></td> -->
<!-- 					<td style="text-align:center"> -->
<!-- 						<select id="EXP_TYPE" name="EXP_TYPE" > -->
<!-- 							<option value=""></option> -->
<!-- 							<option value="1">水利专业专家</option> -->
<!-- 							<option value="2">生产行业专家</option> -->
<!-- 							<option value="3">环境保护</option> -->
<!-- 						</select> -->
<!-- 					</td> -->
					
<!-- 					<td><div align="center">职务/职称</div><div align="center"></div></td> -->
<!-- 					<td style="text-align:center"> -->
<!-- 						<input type="text" id="JOB" name="JOB"  > -->
<!-- 					</td> -->
<!-- 					</tr> -->
					
					
					
<!-- 					<tr> -->
<!-- 					<td><div align="center">通讯地址</div><div align="center"></div></td> -->
<!-- 					<td style="text-align:center"> -->
<!-- 						<input type="text" id="ADDRESS" name="ADDRESS"  > -->
<!-- 					</td> -->
<!-- 					<td>单位类型</td> -->
<!-- 					<td> -->
<!-- 					<select id="unittype" name="unittype"> -->
<!-- 						<option value="1">水利部</option> -->
<!-- 						<option value="2">流域机构</option> -->
<!-- 						<option value="3">省市水利（务）厅（局）</option> -->
<!-- 						<option value="4">环保部门</option> -->
<!-- 						<option value="5">其他</option> -->
<!-- 					</select> -->
<!-- 					</td> -->
<!-- 					</tr> -->
					
				 
				  </table>
     		
     		</div>
     		<div>
     			<div id="bbbcButton" style='float: right;width: 70px;height: 24px;line-height: 22px;margin-top:30px;margin-right: 325px;color: #FFFFFF;background-color: #17BDB0;border-radius: 12px;text-align: center;cursor: pointer;font-size: 12px;' onclick="save()">
					保存
				</div>
     			
     		</div>
     	</div>
     </div> 
     
     
     
<script type="text/javascript">

var Main = {
	    data() {
	      return {
	        restaurants: [],
	        state1: ''
	      };
	    },
	    methods: {
	      querySearch(queryString, cb) {
	        var restaurants = this.restaurants;
	        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
	        // 调用 callback 返回建议列表的数据
	        cb(results);
	      },
	      createFilter(queryString) {
	        return (restaurant) => {
	          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
	        };
	      },
	      loadAll() {
	        return [
	                { "value": "滦河", "STCD":"1111111" },
	                { "value": "闪电河", "STCD":"1111114"},
	                { "value": "小滦河","STCD":"1111113"  },			  			  
	                { "value": "伊逊河","STCD":"1111113"  },
	                 { "value": "武烈河","STCD":"1111113"  },
	                  { "value": "青龙河","STCD":"1111113"  },
	                   { "value": "吐力根河","STCD":"1111113"  },
	                   { "value": "陡河","STCD":"1111113"  },
	                   { "value": "陡河","STCD":"1111113"  },
	                   { "value": "潮河","STCD":"1111113"  },	
	                   { "value": "大清河","STCD":"1111113"  },
	                   { "value": "引滦总干渠","STCD":"1111113"  },
	                   { "value": "引滦入黎河水渠","STCD":"1111113"  },
	                   { "value": "引滦入还水渠","STCD":"1111113"  },
	                   { "value": "蓟运河","STCD":"1111113"  },
	                   { "value": "州河","STCD":"1111113"  },
	                   { "value": "黎河","STCD":"1111113"  },
	                   { "value": "泃河","STCD":"1111113"  },
	                   { "value": "箭杆河","STCD":"1111113"  },
	                   { "value": "还乡河","STCD":"1111113"  },
	                   { "value": "还乡河分洪道","STCD":"1111113"  },
	                   { "value": "潮白河","STCD":"1111113"  },
	                   { "value": "潮河","STCD":"1111113"  },
	                   { "value": "白河","STCD":"1111113"  },
	                   { "value": "怀河","STCD":"1111113"  },
	                   { "value": "京密引水渠","STCD":"1111113"  },
	                   { "value": "潮白新河","STCD":"1111113"  },
	                   { "value": "运潮减河","STCD":"1111113"  },
	                   { "value": "引句入潮","STCD":"1111113"  },
	                   { "value": "青龙湾减河","STCD":"1111113"  },
	               	{ "value": "北运河","STCD":"1111113"  },
	                   { "value": "温榆河","STCD":"1111113"  },
	                   { "value": "北沙河","STCD":"1111113"  },
	                   { "value": "东沙河","STCD":"1111113"  },
	                   { "value": "南沙河","STCD":"1111113"  },
	                   { "value": "牛牧屯引河","STCD":"1111113"  },
	                   { "value": "永定河","STCD":"1111113"  },
	                   { "value": "永定新河","STCD":"1111113"  },
	                   { "value": "金钟河","STCD":"1111113"  },
	                   { "value": "洋河","STCD":"1111113"  },
	                   { "value": "二道河","STCD":"1111113"  },
	                   { "value": "东洋河","STCD":"1111113"  },
	                   { "value": "鄂卜平河","STCD":"1111113"  },
	               	 { "value": "南洋河", "STCD":"1111114"},
	                { "value": "清水河","STCD":"1111113"  },			  			  
	                { "value": "桑干河","STCD":"1111113"  },
	                 { "value": "浑河","STCD":"1111113"  },
	                  { "value": "壶流河","STCD":"1111113"  },
	                   { "value": "七里河","STCD":"1111113"  },
	                   { "value": "妫水河","STCD":"1111113"  },
	                   { "value": "北京排污河","STCD":"1111113"  },
	                   { "value": "独流减河","STCD":"1111113"  },
	                   { "value": "独流减河","STCD":"1111113"  },
	                   { "value": "白沟河","STCD":"1111113"  },
	                   { "value": "拒马河","STCD":"1111113"  },
	                   { "value": "北拒马河","STCD":"1111113"  },
	                   { "value": "南拒马河","STCD":"1111113"  },
	                   { "value": "小清河","STCD":"1111113"  },
	                   { "value": "新盖房分洪道","STCD":"1111113"  },
	                   { "value": "大清河","STCD":"1111113"  },
	                   { "value": "白沟引河","STCD":"1111113"  },
	                   { "value": "大沙河","STCD":"1111113"  },
	                   { "value": "赵王新渠","STCD":"1111113"  },
	                   { "value": "漕河","STCD":"1111113"  },
	                   { "value": "甘河沟","STCD":"1111113"  },
	                   { "value": "唐河","STCD":"1111113"  },
	                   { "value": "潴龙河","STCD":"1111113"  },
	                   { "value": "沙河","STCD":"1111113"  },
	                   { "value": "郜河","STCD":"1111113"  },
	                   { "value": "陈村分洪道","STCD":"1111113"  },
	                   { "value": "慈河","STCD":"1111113"  },
	                   { "value": "木刀沟","STCD":"1111113"  },
	               	{ "value": "漕河","STCD":"1111113"  },
	                   { "value": "子牙新河","STCD":"1111113"  },
	                   { "value": "滹沱河","STCD":"1111113"  },
	                   { "value": "冶河","STCD":"1111113"  },
	                   { "value": "滏阳河","STCD":"1111113"  },
	                   { "value": "洨河","STCD":"1111113"  },
	                   { "value": "午河","STCD":"1111113"  },
	                   { "value": "姊河","STCD":"1111113"  },
	                   { "value": "抵河","STCD":"1111113"  },
	                   { "value": "顺水河","STCD":"1111113"  },
	                   { "value": "南澧河","STCD":"1111113"  },
	                   { "value": "滏阳新河","STCD":"1111113"  },
	                   { "value": "子牙河","STCD":"1111113"  },
	               	 { "value": "卫河", "STCD":"1111114"},
	                { "value": "卫运河","STCD":"1111113"  },			  			  
	                { "value": "漳卫新河","STCD":"1111113"  },
	                 { "value": "老减河","STCD":"1111113"  },
	                  { "value": "漳河","STCD":"1111113"  },
	                   { "value": "浊漳河","STCD":"1111113"  },
	                   { "value": "浊漳北源","STCD":"1111113"  },
	                   { "value": "浊漳化源","STCD":"1111113"  },
	                   { "value": "浊漳西源","STCD":"1111113"  },
	                   { "value": "浊漳南源","STCD":"1111113"  },
	                   { "value": "清漳河","STCD":"1111113"  },
	                   { "value": "清漳东源","STCD":"1111113"  },
	                   { "value": "清漳西源","STCD":"1111113"  },
	                   { "value": "卫河","STCD":"1111113"  },
	                   { "value": "大沙河","STCD":"1111113"  },
	                   { "value": "共产主义渠","STCD":"1111113"  },
	                   { "value": "淇河","STCD":"1111113"  },
	                   { "value": "汤河","STCD":"1111113"  },
	                   { "value": "安阳河","STCD":"1111113"  },
	                   { "value": "安阳河","STCD":"1111113"  },
	                   { "value": "人民胜利渠","STCD":"1111113"  },
	                   { "value": "南运河","STCD":"1111113"  },
	                   { "value": "捷地减河","STCD":"1111113"  },
	                   { "value": "马颊河","STCD":"1111113"  },
	                   { "value": "德惠新河","STCD":"1111113"  },
	                   { "value": "徒骇河","STCD":"1111113"  },
	                   { "value": "沙河","STCD":"1111113"  },
	                   { "value": "山子河","STCD":"1111113"  },
	                   { "value": "京杭大运河","STCD":"1111113"  },
	               	{ "value": "潮河","STCD":"1111113"  },
	                   { "value": "青静黄排水渠","STCD":"1111113"  },
	                   { "value": "沧浪渠","STCD":"1111113"  },
	                   { "value": "沧浪渠","STCD":"1111113"  },
	                   { "value": "北排水河","STCD":"1111113"  },
	                   { "value": "南排水河","STCD":"1111113"  },
	                   { "value": "滏东排河","STCD":"1111113"  },
	                   { "value": "小漳河","STCD":"1111113"  },
	                   { "value": "老漳河","STCD":"1111113"  },
	                   { "value": "老盐河","STCD":"1111113"  },
	                   { "value": "清凉河","STCD":"1111113"  },
	                   { "value": "宣惠河","STCD":"1111113"  },
	                   { "value": "大浪淀排水渠","STCD":"1111113"  },
	                   { "value": "老石碑河","STCD":"1111113"  }           	
	        ];
	      },
	      handleSelect(item) {
// 	    	  console.log($("#riverName").val());

// 	        console.log("aaa",item.STCD);
	      }
	    },
	    mounted() {
	      this.restaurants = this.loadAll();
	    }
	  }
	var Ctor = Vue.extend(Main)
	new Ctor().$mount('#app')
		
	

	
    </script>
     
  </body>
	<script type="text/javascript" src="<%=basePath%>/common/js/jquery.form.js"></script>
	<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
	<script src="<%=basePath%>/pages/szybh/ywgz/suddenlyWaterPollution/suddenlyWaterPollutionDetail/addSuddenlyWaterPollutionDetail.js" type="text/javascript"></script>
</html>
