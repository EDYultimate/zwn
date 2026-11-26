<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>突发水污染案例</title>
    
    <link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath %>common/js/pagination/pagination.css" type="text/css">
    <link rel="stylesheet" href="<%=basePath%>common/js/elementUI/index.css" type="text/css">
    
    
    <script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/common.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/excel/excel-gen.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/FileSaver.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/excel/jszip.js"></script>
    
    <script type="text/javascript" src="<%=basePath %>common/js/elementUI/vue.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/elementUI/index.js"></script>
    <script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>
    
<script type="text/javascript">

	
// 	$(document).ready(function(){
// 		$.fn.zTree.init($("#treeDemo"), setting, zNodes);
// 	});
	var basePath = '<%=basePath%>';
  	<%-- $(function(){
  		var getBodyH=document.body.clientHeight;//得到body高
  		var getBodyW=document.body.clientWidth;//得到body宽




  		$("#rel_div").css("top", $(document).scrollTop()+200 );
  		$("#tbFrame").css("left",getBodyW);
  			//$("#tbFrame").animate({width: 'toggle'},350);
  			$("#rel_div").click(function(){
  		$("#modleIframe").attr("src","<%=basePath%>pages/kfly/jsl/ylxx/ylxx.jsp");
  			//$("#tbFrame").animate({width: 'toggle'},350);
  			if($("#togg").val()=="1"){
  				$("#rel_div").html("&nbsp;<br/>关<br/>&nbsp;<br/>闭");
  				$("#togg").val("0");
  				$("#tbFrame").css("left",0);
  			}else{
  				$("#rel_div").html("实<br/>时<br/>信<br/>息");
  				$("#togg").val("1");
  				$("#tbFrame").css("left",getBodyW);
  			}
  			changeParentTag();
  		});
  	});
  	
  	function changeParentTag() {
  	  	// 控制父页面标签
	  	parent.changeTag($("#togg").val());
  	} --%>
  
	
	
  	</script>
    <style>
     .bbTable>thead>tr>td, th {
   		 border-color: #e4e4e4;
  		 background: #F5F5F5;
		}
	.searchDiv {
    	background-color: white;
    }
        table{table-layout:fixed;}
        tbody td{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        td>p{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
        table tr:nth-child(even){
			background: #f3f8ff;
			}
			
	
	
/* 	.center_text{ */
/* 		　display:inline-block; */
/* 　　width:500px;} */

.scQuery_div {
/* 	width: 180px; */
	height: 40px;
/* 	text-align: center; */
/* 	background-color:white; */
/* 	border: 1px solid #aebac9; */
/* 	border-radius: 8px; */
	line-height: 2.7;
	display:inline-block;
}

.scQuery_div select {
	width: 170;
}

.query_input {
	height: 25;
    width: 70;
    border-radius: 8px;
    border: 1px solid #E1E1E1;
    background-color: #469dff;
    color: #FFFFFF;
    border-color: #7491d4;
    font-size: 16px;
    vertical-align: middle;
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
  
  <body style="overflow: auto;">
   <div class="searchDiv" style="margin-top: 60;">
<!--    <h1><font size="3" face="verdana">&nbsp;河湖生态流浪预警评估详细信息</font></h1> -->
<!--    <hr class="hr" size=6   color="#cde2fd"  /> -->
   
    &nbsp;
    <div class="scQuery_div"  style="width:250;">
      	河流名称: 
	      	<div id="app" style="display: inline;">				
			    	<el-autocomplete id="riverName" class="inline-input" v-model="state1"  :fetch-suggestions="querySearch" 
			   		placeholder="输入河流名称" @select="handleSelect" > </el-autocomplete>		
				</div>
    </div>
   &nbsp;
      <div class="scQuery_div"  style="width: 200;">
      	关键字:<input id="caseName" style="width: 120;" placeholder="名称"  >
      </div>

    <input type="button" value="查询" class="query_input" onclick="search()">
        <input type="button" value="添加" class="query_input" onclick="newAdd()">
     
        <input type="button" value="打印" class="query_input" style="margin-right: 20;float: right;" onclick="printpage()">
<!--             <input type="button" value="导出" class="s_input2"  id="waterReport_btn_generate_excel"> -->
    
</div>



<center class="conent" style="overflow:hidden;padding-bottom:10px;height:100%">
   
	<div id="dydiv">
	    <table id="dytable" class="bbTable" style="margin-top:20px;width:97%" >
	        <thead>
	        <tr>
	            <td rowspan="2" style="width:10%;">序号</td>
	            <td rowspan="2">案例名称</td>
	            <td rowspan="2" style="width:10%;">所在河湖</td>
	            <td rowspan="2">发生地点</td>
	            <td rowspan="2">类别</td>
	            <td rowspan="2">是否重大</td>	            
	            <td rowspan="2">发生时间</td>
	            <td rowspan="2">应急处置方法</td>
	            <td rowspan="2">是否上报水利部</td>
	            <td rowspan="2">处置结果</td>
	            <td rowspan="2">操作</td>
	            
	        </tr>
	        </thead>
	        <tbody id="TableData">	
<!-- 	       		 <tr> -->
<!-- 		            <td >1</td> -->
<!-- 		            <td >漳河上游苯胺污染事件</td> -->
<!-- 		            <td >漳河</td> -->
<!-- 		            <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>         -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >2</td> -->
<!-- 		            <td >卫运河下游氨水泄露事件</td> -->
<!-- 		            <td >卫运河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>           -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >3</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >4</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >5</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >6</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >7</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >8</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >9</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
<!-- 	       		 <tr> -->
<!-- 		            <td >10</td> -->
<!-- 		            <td >桑干河上游倍硫磷泄露</td> -->
<!-- 		            <td >桑干河</td> -->
<!-- 		             <td >山东省德州市王各庄村西侧</td> -->
<!-- 		            <td >人为泄露</td> -->
<!-- 		            <td >2009.06</td> -->
<!-- 		           	<td >隔离泄露污染区</td> -->
<!-- 		            <td >是</td> -->
<!-- 		            <td >已处理</td> -->
<!-- 		           <td style='width:20%;' >  -->
<!-- 		           		<a href="javascript:;" onclick="update()"> -->
<!-- 		           			<img style='cursor: pointer;' title='编辑' src='<%=basePath %>/images/savewater/editbtn.png'> -->
<!-- 		           		</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
<!-- 		           		<a href="javascript:;" onclick="del()"> -->
<!-- 		           			<img style='cursor: pointer;' title='删除' src='<%=basePath %>/images/savewater/delbtn.png'> -->
<!-- 		           		</a> -->
<!-- 		           	</td>             -->
<!-- 	       		 </tr> -->
	        </tbody>
	    </table>    
    </div>
    <div class="pageDiv"><span class="tolSpan"></span><div class="M-box"></div></div>
    


</center>

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
		
	
	function divClick(nm,stcd,st_tp)
	{
	   top.layer.open({
	        type: 2,
	        title: nm+"测站详情",//+'降水量年趋势统计',
	        closeBtn: 1,
	        shade: 0.3,
	        // maxmin: true,
 			area: ['1300px', '650px'],    
	        content: basePath+'pages/szybh/ywgz/waterEnvQuality/belowWaterQuality/mapDialogTab.jsp?stcd='+stcd+'&st_tp='+st_tp
	    });	
	}
	
    </script>


  </body>
  
<script src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
<script type="text/javascript" src="<%=basePath %>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/pagination/jquery.pagination.js"></script>
<script type="text/javascript" src="<%=basePath %>pages/szybh/ywgz/suddenlyWaterPollution/suddenlyWaterPollutionDetail/suddenlyWaterPollutionDetail.js"></script>

</html>
