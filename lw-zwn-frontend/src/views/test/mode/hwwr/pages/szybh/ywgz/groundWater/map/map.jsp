<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title></title>    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" href="<%=basePath %>common/css/common.css" type="text/css">
	
	<link rel="stylesheet" href="<%=basePath%>common/js/elementUI/index.css" type="text/css">
	
	
<!-- 		<link rel="stylesheet" href="<%=basePath %>pages/szybh/ywgz/ecologyFlow/map/ztree/css/demo.css" type="text/css"> -->
		    <link rel="stylesheet" href="<%=basePath%>common/css/ztree/zTreeStyle/zTreeStyleCustom.css" type="text/css">
		<script type="text/javascript" src="<%=basePath %>common/js/jquery/jquery-1.7.2.js"></script>
		
<!-- 	<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.core.js"></script> -->


<!-- <script type="text/javascript"  src="<%=basePath %>/pages/szybh/rvlkappraise/map/map.js"></script> -->
<script type="text/javascript" src="<%=basePath %>common/js/layer/layer.js"></script>

<script type="text/javascript" src="<%=basePath %>common/js/elementUI/vue.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/elementUI/index.js"></script>


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
        
        .el-input__inner{
        	height: 30px;
    		border-radius: 0;
    		border: 1px  white;
    		    width: 100%;
       }
        .ztree li {    padding: 10 0 0 0; }
.ztree * {padding:0; margin:0; font-size:16px; font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif}
/* .ztree li a {padding:4px 3px 4 0; margin:0; cursor:pointer; height:17px; color:#333; background-color: transparent; */
.ztree li a.curSelectedNode {background-color:#deefff; color:black; border:none;}
.ztree li ul.line {margin-left: 18;}
        
       </style>
  </head>
  
  <body style="padding: 0;margin: 0;overflow-x:hidden;overflow-y:hidden;">

    <input type="hidden" id="togg" value="1"></input>
    <input type="hidden" id="toggQueryDialog" value="1"></input>
    <input type="hidden" id="toggCheckSet" value="1"></input>
    
  	<div id="query_dialog_div" style="overflow: hidden auto;display:none;height:100%;width:360px;position:absolute;right:0px;background:white;box-shadow: 0px 0px 13px #e3e3e3;">
  	  	<div  style="height:100;">  	  		
			<div id="searchTop" style="margin-top:15;height:40;">
				<img  style="margin-left:-7;" src="images/savewater/searchBG.png"> 
				<span style="position: absolute; left: 0;font-weight:bold;color:white;font-size: 16;font-family: emoji; margin-left: 11;">筛选条件</span> 	
			</div>  
			
			<div id="dateSelDiv" style="height:30;
						margin-top:10;margin-left: 13;margin-right: 13;">
						
				<div id="rectLeftDiv" style=" height: 30;width: 30;border-radius: 3px;display: inline;">		
					<input type="button" value="<" style="border-radius: 3px; height: 30;width: 30;color: gray;" onclick=""> 		 
				</div>
				<div id="leftLine" style="width:30;height:1px;background-color:#8aabe5;overflow:hidden;margin-left: 30;
					 		position:absolute;top:80;background-color: gray;"></div>
					 		
					 		
				<div style="display: inline;">
					 <input id='nianFenInput' type='text'  style="width:213;border-radius: 5px;margin-left: 25;" onClick="WdatePicker({ dateFmt: 'yyyy'})"/>
				</div>	 		
					 		
					 		
				
				<div id="rightLine" style="width:30;height:1px;background-color:#8aabe5;overflow:hidden;right: 44;
					 		position:absolute;top:80;background-color: gray;"></div>
				
				<div id="rectRightDiv" style="height: 30;width: 30;border-radius: 3px;right:0;display: inline;float: right;">		
					<input type="button" value=">" style="border-radius: 3px; height: 30;width: 30;color: gray;" onclick=""> 		 
				</div>

			</div>  
 	  	
  	  	
  	  	<div id="searchBottom" style="height:30;border: 1px solid #298BFF;border-radius: 5px;margin-top:10;margin-left: 13;margin-right: 13;box-shadow: 0px 0px 3px #298BFF;">
				<div style="display: inline;">
					<span style="margin-left: 10;font-weight:bold;color: #5B83D2;font-size: 14;">搜索定位</span> 	
				</div>
				<div id="app" style="display: inline;">				
			    	<el-autocomplete class="inline-input" v-model="state1"  :fetch-suggestions="querySearch" 
			   		placeholder="输入断面关键字" @select="handleSelect" :trigger-on-focus="true"> </el-autocomplete>		
				</div>
				<div style="display: inline;">
					<img  style="margin-left:30;vertical-align: middle;" src="images/savewater/searchRight.png"> 
				</div>
			</div>  
  	  	
  	  	
  	  	</div>
  		<div style="width:100%;height:4;background-color: #e6e6e6;margin-top: 40;"></div>
  		<div  style="height:40;margin-top: 20;">
  			<img  style="margin-top: 15;margin-left: 10;" src="images/savewater/regionSelectionBG.png"> 
			<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 16;margin-left: 20;">区域选择</span> 	
		</div>
  		
<!--   		年 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('官厅水库','00000003','1')">    -->
<!--   		    非年 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('永定河','00000001','1')">     		     -->
<!--   		    管理 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('官厅水库','00000002','2')">    -->




<!--   		  		<div class="content_wrap"  > -->
<!-- 			<div class="zTreeDemoBackground left"> -->
<!-- 				<div  > -->
<!-- 				<ul id="treeDemo" style="margin:0 auto;" class="ztree" ></ul> -->
<!-- 						<ul id="treeDemo" style="margin:0 auto;" class="ztree" ></ul> -->
				<div id='treeSectionDiv'>
						<ul id="treeDemoCheck" style="width:100%;margin-left: 10;height:73%;" class="ztree"></ul>
				</div>
<!-- 				</div> -->
<!-- 			</div> -->
<!-- 		</div> -->
  	</div>
  	
  	<div id="query_arrow_div" style="width:30px;height:100px;position:absolute; right:-13px; float:right; margin-top:25%;padding-top:8px;cursor: pointer;
    		z-index: 100;">
    			<img src="<%=basePath %>/images/savewater/right.png">
   	</div>
  
  
    <div id="gsFrame" style="width:100%;height:98%;padding: 0;margin: 0;">    	
    	<iframe id="gismap" name="gismap"  style="z-index:1;width:100%;height:100%;border: 0px;" 
    	src="<%=basePath%>pages/gis/main/hehushengtail/huabeidixiashui/index.html" ></iframe>
    	
<!--     	<div id="checkSetDiv" style="width:30px;height:30px;position:absolute;right:70;bottom:100;"> -->
<!--     		  <img id="checkSetImg" src="<%=basePath %>/images/savewater/checkSet0.png"> -->
<!-- 		</div> -->
    	
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
	          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase())!= -1);
	        };
	      },
	      loadAll() {
	        return [
// 	           { "value": "补水河湖", "STCD":"1111111" },
 { "value": "滹沱河", "STCD":"1"},
 { "value": "滏阳河","STCD":"2"  },			  			  
 { "value": "南拒马河","STCD":"3"  },
  { "value": "永定河","STCD":"4"  },
   { "value": "七里河-顺水河","STCD":"5"  },
    { "value": "唐河","STCD":"6"  },
    { "value": "沙河-潴龙河","STCD":"7"  },
    { "value": "北拒马河-白沟河","STCD":"8"  },
    { "value": "瀑河","STCD":"9"  },	
    { "value": "泜河","STCD":"10"  },
    { "value": "南运河","STCD":"11"  },
    { "value": "七里海","STCD":"12"  },
    { "value": "大黄堡洼","STCD":"13"  },
    { "value": "北大港","STCD":"14"  },
    { "value": "团泊洼","STCD":"15"  },
    { "value": "白洋淀","STCD":"16"  },
    { "value": "衡水湖","STCD":"17"  },
    { "value": "南大港","STCD":"18"  },
    { "value": "漳河","STCD":"19"  },
    { "value": "卫河","STCD":"20"  },
    { "value": "潮白河","STCD":"21"  },
    { "value": "北运河","STCD":"22"  },
    { "value": "华北地下水系统没有","STCD":"23"  }
	        ];
	      },
	      handleSelect(item) {
// 	        console.log("aaa",item.STCD);
			document.getElementById("gismap").contentWindow.locate(item.STCD);
	      }
	    },
	    mounted() {
	      this.restaurants = this.loadAll();
	    }
	  }
	var Ctor = Vue.extend(Main)
	new Ctor().$mount('#app')
		
	
	function divClick(RV_NM,RV_CD ){
		console.log("divClick:   ",RV_NM,RV_CD);
		//	var stcd='00000001' ;

		top.layer.open({
	        type: 2,
	        title: RV_NM+"补水详情",
	        closeBtn: 1,
	        shade: 0.3,
	        area: ['800px', '650px'],   
	   	     content: basePath+'pages/szybh/ywgz/groundWater/map/bsxqDialog.jsp?RV_CD='+RV_CD
	    });	
	}
	
// 	function divClick(nm,stcd,st_tp)
// 	{
// 	   top.layer.open({
// 	        type: 2,
// 	        title: nm+"补水详情",
// 	        closeBtn: 1,
// 	        shade: 0.3,
// 	        maxmin: true,
// 	        area: ['800px', '650px'],   
// 	        offset: '100px',
// 	        content: basePath+'pages/szybh/ywgz/groundWater/map/bsxqDialog.jsp?stcd='+stcd+'&st_tp='+st_tp//pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
// 	    });	
// 	}
	
// 	function divWarnDetailClick()
// 	{
// 		var src=basePath+"/pages/szybh/ywgz/ecologyFlow/warnDetail/warnDetail.jsp";
// 		$("#gismap").attr("src",src);
// 	}
    </script>
  </body>
  <script type="text/javascript" src="<%=basePath%>common/js/layer/layer.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/scroll/jquery.mCustomScrollbar.js"></script>
<script type="text/javascript" src="<%=basePath%>common/js/jquery/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/customtable/customtable.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/echart/echarts.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.core.js"></script>
<script type="text/javascript" src="<%=basePath %>common/js/ztree/jquery.ztree.excheck.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/rcgl/szygb/common/types.js"></script>
<script type="text/javascript" src="<%=basePath%>pages/szybh/ywgz/groundWater/map/map.js"></script>

</html>
