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


	<link href="http://www.jq22.com/jquery/bootstrap-3.3.4.css" rel="stylesheet">


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
        	height: 28;
    		border-radius: 0;
    		border: 1px  white;
    		margin-top: 0;
       }
       .el-autocomplete {
       width: 230;
       }
       
.ztree li {    padding: 10 0 0 0; }
.ztree * {padding:0; margin:0; font-size:16px; font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif}
/* .ztree li a {padding:4px 3px 4 0; margin:0; cursor:pointer; height:17px; color:#333; background-color: transparent; */
.ztree li a.curSelectedNode {background-color:#deefff; color:black; border:none;}
/* .ztree li ul.line {margin-left: 18;} */
.ztree li ul {margin-left: 18;background: url('<%=basePath %>/common/css/ztree/zTreeStyle/img/line_conn.gif') 0 0 repeat-y;}
       </style>
  </head>
  
  <body style="padding: 0;margin: 0;overflow-x:hidden;overflow-y:hidden;">

    <input type="hidden" id="togg" value="1"></input>
    <input type="hidden" id="toggQueryDialog" value="1"></input>
    <input type="hidden" id="toggCheckSet" value="1"></input>
    
  	<div id="query_dialog_div" style="display:none;height:100%;width:360px;position:absolute;right:0px;background:white;box-shadow: 0px 0px 13px #e3e3e3;overflow: hidden auto;">
  	  	<div  style="height:100;">  	  		
			<div id="searchTop" style="margin-top:15;height:40;">
				<img  style="margin-left:-7;" src="images/savewater/searchBG.png"> 
				<span style="position: absolute; left: 0;font-weight:bold;color:white;font-size: 16;font-family: emoji; margin-left: 11;">筛选条件</span> 	
			</div>  
			
			<div id="searchBottom" style="height:30;border: 1px solid #298BFF;
						border-radius: 5px;margin-top:10;margin-left: 13;margin-right: 13;box-shadow: 0px 0px 3px #298BFF;">
				<div style="display: inline;">
					<span style="margin-left: 10;font-weight:bold;color: #5B83D2;font-size: 14;">搜索定位</span> 	
				</div>
				<div id="app" style="display: inline;">				
			    	<el-autocomplete class="inline-input" v-model="state1"  :fetch-suggestions="querySearch" 
			   		placeholder="输入断面关键字" @select="handleSelect" :trigger-on-focus="true"> </el-autocomplete>	
			   		
<!-- 			   		<el-autocomplete class="inline-input" v-model="state2"  :fetch-suggestions="querySearch2"  -->
<!-- 			   		placeholder="输入断面关键字" :trigger-on-focus="true"> </el-autocomplete>		 -->
				</div>
				<div style="display: inline;">
					<img  style="vertical-align: middle;" src="images/savewater/searchRight.png">
<!-- 										<img  style="vertical-align: middle;" src="images/savewater/sy_title_bg.png">  -->
					 
				</div>
			</div>  	  	
	  	  	
  	  	
  	  	</div>
  		<div style="width:100%;height:4;background-color: #e6e6e6;"></div>
  		<div  style="height:40;margin-top: 20;">
 			<span style="position: absolute; left: 0;font-weight:bold;color: black;font-size: 15;margin-left: 20;">2020年印发河湖:21个&nbsp;&nbsp;&nbsp;2021年印发河湖:2个
<br>考核断面:31处&nbsp;&nbsp;&nbsp;
<br>不达标断面:
 				<span style="font-weight:bold;color: red;font-size: 15;" id="totalWDB"></span>处
<!--  				<br>2021年印发河湖:4个&nbsp;&nbsp;&nbsp;考核断面:5处&nbsp;&nbsp;&nbsp;不达标断面:0处 -->
 				
 			</span>
 					
  			<img  style="margin-top: 95;margin-left: 15;" src="images/savewater/regionSelectionBG.png"> 
			<span style="margin-top: 75;position: absolute; left: 0;font-weight:bold;color: black;font-size: 20;margin-left: 20;">区域选择</span>
			 	
		</div>
  		
<!--   		年 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('官厅水库','00000003','1')">    -->
<!--   		    非年 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('淮淀闸（津唐运河）','00000001','1')">     		     -->
<!--   		    管理 -->
<!--   		    <input type="button" value="查询"  onclick="divClick('官厅水库','00000002','2')">    -->




<!--   		  		<div class="content_wrap"  > -->
<!-- 			<div class="zTreeDemoBackground left"> -->
<!-- 				<div  > -->
<!-- 				<ul id="treeDemo" style="margin:0 auto;" class="ztree" ></ul> -->
<!-- 						<ul id="treeDemo" style="margin:0 auto;" class="ztree" ></ul> -->
				<div id='treeSectionDiv' style="margin-top: 50;">
						<ul id="treeDemoCheck" style="width:100%;margin-left: 10;height:74%;" class="ztree" ></ul>						
<!-- 						<div id="treeview1" class=""></div> -->
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
    	src="<%=basePath%>pages/gis/main/hehushengtail/shuiziyuanbaohu/index.html" ></iframe>
    	
<!--     	<div id="checkSetDiv" style="width:30px;height:30px;position:absolute;right:70;bottom:100;"> -->
<!--     		  <img id="checkSetImg" src="<%=basePath %>/images/savewater/checkSet0.png"> -->
<!-- 		</div> -->
    	
    </div>
    
<script type="text/javascript">

var test = [
	          { "value": "十方院(考核)", "STCD":"30806201" },
	          { "value": "淮淀闸(考核)", "STCD":"99990176"},
	          { "value": "淮淀闸(管理)","STCD":"99990095"  },			  
	          { "value": "滦县站(考核)","STCD":"30101400"  },
	          { "value": "大黑汀水库(管理)","STCD":"30101202"  },
	          { "value": "桃林口水库(管理)","STCD":"00000002"  },
	          { "value": "岩山渠首(管理、计算)","STCD":"00000003"  },
	             { "value": "三家店(考核)","STCD":"30700500"  },
	             { "value": "小红门再生水(计算)","STCD":"00000004"  },
	             { "value": "八号桥(管理)","STCD":"30700050"  },
	             { "value": "官厅水库(考核管理)","STCD":"30700100"  },
	             { "value": "卢沟桥(管理)","STCD":"30700700"  },	             
	             { "value": "册田水库(考核)","STCD":"30702400"  },
	             { "value": "石匣里(管理)","STCD":"30702700"  },
	             { "value": "册田水库下游灌区引水口(计算)","STCD":"00000005"  },
	             { "value": "响水堡(考核)","STCD":"30705600"  },
	             { "value": "响水堡水库下游灌区引水口(计算)","STCD":"00000006"  },
	             { "value": "肖家河闸前(考核)","STCD":"00000007"  },
	             { "value": "下清河闸前(考核)","STCD":"00000008"  },
	             { "value": "沈家坟闸前(考核)","STCD":"00000009"  },
	             { "value": "库水位(考核)","STCD":"30503400"  },
	             { "value": "颐和闸(考核、管理)","STCD":"00000010"  },
	             { "value": "苇海区闸下(考核)","STCD":"00000011"  },
	             { "value": "七里海北站(管理)","STCD":"30301050"  },
	             { "value": "潮白新河淮淀闸上(管理)","STCD":"99990095"  },
	             { "value": "洪泥河首闸(考核)","STCD":"31003250"  },
	             { "value": "洪泥河防洪闸(管理)","STCD":"30600651"  },
	             { "value": "老龙凤河闸上(考核)","STCD":"00000012"  },
	             { "value": "南三孔节制闸上(管理)","STCD":"99990077"  },
	             { "value": "筐儿港上(管理)","STCD":"30502200"  },
	             { "value": "岗南水库(考核)","STCD":"30909200"  },
	             { "value": "黄壁庄水库(考核)","STCD":"30909303"  },
	             { "value": "滹沱河小觉站(管理)","STCD":"30909100"  },
	             { "value": "冶河平山站(管理)","STCD":"30912400"  },
	             { "value": "桃林口水库(考核)","STCD":"00000013"  },	             
	         	 { "value": "衡水湖千顷洼(考核)","STCD":"30905500"  },
	             { "value": "南庄(考核、管理)","STCD":"30909000"  },
	             { "value": "省界(考核)","STCD":"00000017"  },
	             { "value": "界河铺(管理)","STCD":"30908800"  },
	             { "value": "册田水库(考核)","STCD":"00000015"  },
	             { "value": "东榆林水库(管理)","STCD":"00000016"  },
	             { "value": "关河水库(考核、管理)","STCD":"31008402"  },
	             { "value": "侯壁水文站(考核)","STCD":"31007650"  },
	             { "value": "云竹水库(管理)","STCD":"00000019"  },
	             { "value": "淜头水电站(管理)","STCD":"00000020"  },
	             { "value": "漳泽水库(考核、管理)","STCD":"31007800"  },
	             { "value": "屯绛水库(考核)","STCD":"31008000"  },
	             { "value": "后湾水库(考核、管理)","STCD":"31008100"  },
	             { "value": "圪芦河水库(管理)","STCD":"31008070"  }
	        ];
var Main = {
	    data() {
	      return {
	        restaurants: [],
	        state1: '',
// 	        state2: '',
// 	        restaurants2: [],
	      };
	    },
	    methods: {
	      querySearch(queryString, cb) {
	        var restaurants = this.restaurants;
	        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
	        // 调用 callback 返回建议列表的数据
	        cb(results);
	      },
// 	      querySearch2(queryString, cb) {
// 		        var restaurants = this.restaurants2;
// 		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
// 		        调用 callback 返回建议列表的数据
// 		        cb(results);
// 		  },
	      createFilter(queryString) {
	        return (restaurant) => {
// 	          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
		          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
	        };
	      },
	      loadAll() {
	        return test;
	      },
	      handleSelect(item) {
// 	        console.log("aaa",item.STCD);
			document.getElementById("gismap").contentWindow.locate(item.STCD);
// 		      this.restaurants2 = test;

	      }
	    },
	    mounted() {
	      this.restaurants = test;
	    }
	  }
	var Ctor = Vue.extend(Main)
	new Ctor().$mount('#app')
		
	
// 	function divClick(nm,stcd,st_tp)
// 	{			
// 		this.restaurants = test;
// 		top.layer.open({
// 	        type: 2,
// 	        title: nm+"断面信息统计",//+'降水量年趋势统计',
// 	        closeBtn: 1,
// 	        shade: 0.3,
// 	        maxmin: true,
// 	        area: ['1300px', '650px'],    
// 	        content: basePath+'pages/szybh/ywgz/ecologyFlow/map/mapDialogTab.jsp?stcd='+stcd+'&st_tp='+st_tp//pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
// 	    });	
// 	}
	
	//gis界面调用此方法
	function divClickCall(obj)
	{		
		console.log("objobjobj",obj);
		var nm = obj.STNM;
// 		var stcd =obj.STCD;
		var stcd =obj.CD;

		var st_tp = obj.ST_TP;
		do_support(nm,stcd,st_tp);
	}
	
	function do_support(nm,stcd,st_tp){
		console.log("do_support:   ",nm,stcd,st_tp);
//		nm="官厅水库" ;
//		stcd='00000003' ;
//		st_tp=1 ;
	 
	   
	   top.layer.open({
	       type: 2,
	       title: nm+"断面信息统计",//+'降水量年趋势统计',
	       closeBtn: 1,
	       shade: 0.3,
	       // maxmin: true,
	       area: ['1300px', '650px'],    
	       content: basePath+'pages/szybh/ywgz/ecologyFlow/map/mapDialogTab.jsp?stcd='+stcd+'&st_tp='+st_tp//pages/szybh/rvlkappraise/map/zQrqDialog.jsp?stcd='+code
	   });	
	}
	
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
<script type="text/javascript" src="<%=basePath%>pages/szybh/ywgz/ecologyFlow/map/map.js"></script>

<script type="text/javascript" src="<%=basePath %>common/js/bootstrap/bootstrap-treeview.js"></script>


</html>
