var ptype = "update";
var calYear = year;
var idx = 1;

var wpc_obj = {
		wpc_cd: '',
		wpc_sn: '',
		wrp_nm: '',
		conc_org: '',
		ad_nm: '',
		ww: '',
		gw: '',
		sw: '',
		draw_staff: ''
};

$(document).ready(function() {
	if (id===null || id==="null" || id ===undefined || id ==="") {
		id=UUID();
	}
	if (wpc_cd===null || wpc_cd==="null" || wpc_cd ===undefined || wpc_cd ==="") {
		wpc_cd = "";
		$("#wpc_cd").val("");
		ptype = "add";
	}else{
		$("#wpc_cd").val(wpc_cd);
		$("#wpc_sn").attr("disabled","disabled");
		
	}
	if (year===null || year==="null" || year ===undefined || year ==="") {
		var date = new Date();
//		 year = "2019";
		 year = date.getFullYear();
	}
	
	 initUpload('QSYS');
	 getFile('QSYS');
	initData();
	addInfo();
}) 

function initData() {
	var  monthWater;
	
	
	if (wpc_cd && wpc_cd!="null") {
		$.ajax({
	        type: "GET",
	        url: basePath+'qsys/getWSYSInfoAndMnWater?wpc_cd='+wpc_cd+'&year='+year,
	        contentType: 'application/json',
	        async: true,
	        success: function (result) {
	        	
	        	var data=result.listBase;
	        	 monthWater=result.listMonthW;
	        	 console.info(monthWater);
	        	if (data && data.length>0) {
	        		
	        		var row = data[0];
	        		for (var k in row) {
	        			$("#"+k).val(row[k]);
	        		}
	        		var wpc_sn=row.wpc_sn;

					setOption(data);
					
					
	        	};

	        }
		});
		$.ajax({
			type: "GET",
			url: basePath+'qsys/getQSYS?wpc_cd='+wpc_cd+'&tyear='+year,
			contentType: 'application/json',
			async: true,
			success: function (result) {
				console.info(result);
				var ww_s=0;
				var data=result.data;//基础数据和本年数据列表
				for (var year in data) {//判断监测的信息是地表还是地下水信息
					ww_s=data[year].ww_s;
				}
				
				//===监测信息先赋值，上报信息再赋值 可以覆盖监测信息，以上报为主，监测为辅
				  for(var i=0;i<monthWater.length;i++){
					 
				    	var mn=monthWater[i].MN;
				    	var w=monthWater[i].W;
				    	var str=""
				    	if(ww_s>0){//判断检测的是地表水还是地下水,ww_s地表水
				    		str="act_ww_s";
				    	}else{
				    		str="act_ww_g";
				    	}
				    	
				    	$(document.getElementById(str+'|'+mn)).val(isNull(w));//监测数据
				    	$(document.getElementById(str+'|'+mn)).css("color","green");
				    }
				//=======
				
				
				var zfill = function(num, fill) {
					var len = ('' + num).length;
					return (Array(
						fill > len ? fill - len + 1 || 0 : 0
					).join(0) + num);
				}
				var set = function(year, type, list) {
					for (var i=0; i<list.length; ++i) {
						var date = year + '-'+ zfill(i+1, 2);
						var item = document.getElementById(type+'|'+date);
						if(list[i]!=null){
							$(item).val(list[i]);
							$(item).css("color","black");
						}
					}
				};
				for (var year in data) {
					set(year, 'act_prod', data[year].act_prod);
					set(year, 'act_ww_g', data[year].act_ww_g);
					set(year, 'act_ww_s', data[year].act_ww_s);
					set(year, 'app_ww_g', data[year].app_ww_g);
					set(year, 'app_ww_s', data[year].app_ww_s);
					set(year, 'des_scal', data[year].des_scal);
					set(year, 'prod_effi', data[year].prod_effi);
					set(year, 'rep_ww_g', data[year].rep_ww_g);
					set(year, 'rep_ww_s', data[year].rep_ww_s)
                    $(document.getElementById('ww_s|'+year)).val(data[year].ww_s);
					$(document.getElementById('ww_g|'+year)).val(data[year].ww_g);
				}
				
				//+++++++++++++算选年份往前推近三年历史数据++++++++++
				var hisData=result.hisData;//历史3年详细地表地下水数据列表
				var hisBase=result.hisBase;//历史3年基础信息数据列表
				
				for(var i=0;i<hisBase.length;i++){
					var year=hisBase[i].tyear;
					console.info(hisBase[i]);
					genTableTemp(idx, year);
					++idx;
				}
				
				for (var year in hisData) {
					set(year, 'act_prod', hisData[year].act_prod);
					set(year, 'act_ww_g', hisData[year].act_ww_g);
					set(year, 'act_ww_s', hisData[year].act_ww_s);
					set(year, 'app_ww_g', hisData[year].app_ww_g);
					set(year, 'app_ww_s', hisData[year].app_ww_s);
					set(year, 'des_scal', hisData[year].des_scal);
					set(year, 'prod_effi', hisData[year].prod_effi);
					set(year, 'rep_ww_g', hisData[year].rep_ww_g);
					set(year, 'rep_ww_s', hisData[year].rep_ww_s)
                    $(document.getElementById('ww_s|'+year)).val(hisData[year].ww_s);
					$(document.getElementById('ww_g|'+year)).val(hisData[year].ww_g);
				}
				if(hisBase.length>0){
					$("#historyDataDiv").show();
				}
			
			}
		});
	}else{
		setOption({});
		
	}
}

//
function saveInfo() {
    var json = {};
    json.id =id;//uuid
    json.wpc_cd =$("#wpc_cd").val();//取用许可证id编码
    json.year = year;//年
    json.prj_nm = $('#prj_nm').val();//取水项目名
    json.wpc_sn = $('#wpc_sn').val();//取水许可证编号
    json.wrp_nm = $('#wrp_nm').val();//取水权人
    json.lr_nm = $('#lr_nm').val();//法人代表人
    json.conc_org = $('#conc_org').val();//联系人
    json.ww = $('#ww').val();//许可取水量
    json.int_use = $('#int_use').val();//int_use
  
	var infos = $('#type_id').getInfos();
    var seltype = $('#type_id').getSelected();

    if(json.wpc_cd==""){
    	alert("取水许可证编号不能为空");
    	return;
    }
    
    if (seltype && seltype.hasOwnProperty("ids")) {
		json.typeid = seltype.ids[0];
		var timeList = [];
		for (var i in options) {
			var item = options[i];
			timeList.push(infos[item.id]);
		}
		json.typetimes = timeList.toString();
	}
    
//    console.info(JSON.stringify(json));

    $.ajax({
        url: basePath+'qsys/saveQSYSInfo',
        type:'POST',
        data:JSON.stringify(json),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data){
        }
    })
}

function save() {

    saveInfo();
    calcYear();

    var resole = getResole();
	var pdata = [];

	for (var k in resole) {
		var json = {};
		json.year=k;
		json.wpc_cd = $("#wpc_cd").val();
		for (var j in resole[k]) {
			json[j] = resole[k][j];
		}
		pdata.push(json);
	}
	
	$.ajax({
		url: basePath+'qsys/saveQSYS',
		type:'POST',
		data:JSON.stringify(pdata),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		success: function(data){
            parent.search();
            parent.layer.closeAll();
		}
	})
}


function getResole() {
    var inputs = $('#table input');
    var resole = {};
    var prefix = ['des_scal','act_prod','prod_effi','app_ww_s','app_ww_g','rep_ww_s','rep_ww_g','act_ww_s','act_ww_g'];
    var pww = ['ww_s','ww_g'];
    for (var i=0; i<inputs.length; ++i) {
        var r = $('#table input')[i];
        if (r.id && prefix.indexOf(r.id.split('|')[0])>=0) {
            var pr = r.id.split('|')[0];
            var date = r.id.split('|')[1];
            var year = date.split('-')[0];
            if (!resole.hasOwnProperty(year)) {
                resole[year] = {};
                resole[year][pr] = [r.value];
            }
            else if (!resole[year].hasOwnProperty(pr)) {
                resole[year][pr] = [r.value];
            }
            else {
                resole[year][pr].push(r.value);
            }
        }
        else if (r.id && pww.indexOf(r.id.split('|')[0])>=0) {
            var pr = r.id.split('|')[0];
            var year = r.id.split('|')[1];
            if (!resole.hasOwnProperty(year)) {
                resole[year] = {};
                resole[year][pr] = r.value;
            }
            else {
                resole[year][pr] = r.value;
            }
        }
    }

    return resole;
}


function calcYear() {
    var resole = getResole();
    var prefix = ['des_scal','act_prod','prod_effi','app_ww_s','app_ww_g','rep_ww_s','rep_ww_g','act_ww_s','act_ww_g'];

    // 计算每年的和
    for (var year in resole) {
        var item = resole[year];
        var sum = 0;
        for (var k in prefix) {
            var pk = prefix[k];
            for (var i=0; i<12; ++i) {
                if (isStrEmpty(item[pk][i])) {
                    continue;
                }
                else {	
                   sum += Number(item[pk][i]);
                }
            }
            // 赋值 和
            if (sum!==0) {
                item[pk][12] = ""+sum;
               
                    $(document.getElementById(pk+'|'+year+'-13')).val(sum);
                    sum = 0;
              
               
            }
            else {
                item[pk][12] = "";
                $(document.getElementById(pk+'|'+year+'-13')).val("");
            }
        }
    }
}


// true:数值型的，false：非数值型
function myIsNaN(value) {
  return typeof value === 'number' && !isNaN(value);
}

function cancel() {
	parent.layer.closeAll();
}



function addInfo() {
	if (calYear==="") {
//		calYear = '2019';
		calYear = parseInt(moment().format('YYYY'));
	}
	else {
		calYear = parseInt(year);
	}

	genTableTemp(idx, calYear);
	++idx;
	--calYear;
}

var options = [
	{id:'01', 'name': '接收材料:'},
	{id:'02', 'name': '审查:'},
	{id:'03', 'name': '计划批复:'},
	{id:'04', 'name': '结束:'}
];

function setOption(data) {
	if(data.length>0){
		var type_id = data[0].typeid;
		var type_times = data[0].typetimes.split(',');
		var type_no = parseInt(type_id)-1;

		var infos = {};
		for (var i=1; i<type_times.length+1; ++i) {
			infos['0'+i] =  type_times[i-1];
		}

		if (type_id) {
			$('#choose_tm').val(type_times[type_no]);
			var item = $('#type_id').getItemById(options, type_id);
			$("#type_id").val(item.name+" "+type_times[type_no]);
		
			$("#type_id").cusSelect(options, [type_id], true, infos, ckInfo);
		}
	}else{
		var tm=getCurrentYMD();
		$('#choose_tm').val([tm,'','','']);
		var item = $('#type_id').getItemById(options, "01");
		$("#type_id").val(item.name+" "+tm);
		$("#type_id").cusSelect(options, ["01"], true,{'01':tm,02:"",03:"",04:""},ckInfo);
	}
	

}

// 点击修改时间
var sids;
function ckInfo(id, e) {
	//var sids = $('#type_id').getSelected().ids;
	sids = id;
	$('#choose_tm').val(e.innerText);
	layer.open({
		type: 1,
		title: false,
		content: $('#clooseTM'),
		btnAlign: 'c',
		btn: ['确定'],
		yes: function(index, layero){
			$($('.select_multi_li [value="'+sids+'"]').parent().children()[2]).text($('#choose_tm').val());
			$('#type_id').val($('#type_id').getSelected().vals[0]);
			layer.closeAll();
		}
	});
}

function updateTM() {
	var tm = $('#choose_tm').val();
	if (tm===null || tm==="") {
		alert('请选择时间');
		return;
	}
	layer.closeAll();
}


function setInput(wpc_cd, wpc_sn,wrp_nm,conc_org,ad_nm,ww,gw,sw,lr_nm,draw_staff,int_use) {

	$.ajax({
        type: "GET",
        url: basePath+'qsys/getWSYSInfoAndMnWater?wpc_cd='+wpc_cd+'&year='+year,
        contentType: 'application/json',
        async: true,
        success: function (result) {
        	console.info(result);
        	var data=result.listBase;
        	var monthWater=result.listMonthW;
        	if (data && data.length>0) {
        		alert(year+"年"+wpc_sn+"数据已存在,请重新选择新的取水许可证");
        	}else{
        		 	$('#wpc_sn').val(wpc_sn);//许可证编码
        		    $('#wrp_nm').val(wrp_nm);//取水权人
        		    $('#lr_nm').val(lr_nm);//法人代表
        		    $('#conc_org').val(conc_org);//监管单位
        		    $('#ww').val(ww);//总取水许可
        		    $('#int_use').val(int_use);//用途
        		    $("#wpc_cd").val(wpc_cd);//许可证id
        		    $(document.getElementById('ww_s|'+year)).val(sw);//地表水
        		    $(document.getElementById('ww_g|'+year)).val(gw);//地下水
        		    for(var i=0;i<monthWater.length;i++){
        		    
        		    	var mn=monthWater[i].MN;
        		    	var w=monthWater[i].W;
        		    	var str=""
        		    	if(gw>0){//判断检测的是地表水还是地下水
        		    		str="act_ww_g";
        		    	}else{
        		    		str="act_ww_s";
        		    	}
        		    	$(document.getElementById(str+'|'+mn)).val(isNull(w));//监测数据
        		    	$(document.getElementById(str+'|'+mn)).css("color","green");
        		    }
        		    
        	}

        }
	});
	
	

}


function wiuPage() {
    layer.open({
        type: 2,
        title: '取水许可证',
        shadeClose: false,
        shade: 0.2,
        maxmin: false, //开启最大化最小化按钮
        area: ['650px', '400px'],
        content: basePath+"pages/rcgl/jdjc/dialog/wiu.jsp"
    })
}





/**
 * =======================================
 *  文件上传
 * =======================================
 */

// 信息传递中所保存的所有文件名称
var fileNames = [];
var fileIds = [];
// 从保存的数组中删除对应文件
var deleteFIleFromArray = function(fileid) {
    if (fileid) {
        if (fileIds.indexOf(fileid)<0) {
            return;
        }
        fileNames.splice(fileIds.indexOf(fileid), 1);
        fileIds.splice(fileIds.indexOf(fileid), 1);
    }
}

// 添加文件名称
var addFileName = function(filename, fileid) {
    if (filename) {
        if (fileNames.indexOf(filename)>=0) {
            return false;
        }
        fileNames.push(filename);
        fileIds.push(fileid);
        return true;
    }
    return false;
}
//删除文件名称
var rmFileName = function(filename, fileid) {
    if (filename) {
        if (fileNames.indexOf(filename)<0) {
            return false;
        }
        fileNames.splice(fileNames.indexOf(filename), 1);
        fileIds.splice(fileIds.indexOf(fileid), 1);
        return true;
    }
    return false;
}

// 生成文件上传div
var getFileDiv = function(filename, fileid, filesize, mang_cd) {
    var filediv = "<tr id='file"+fileid+"' ><td><a onclick='javascript:viewfile(\""+fileid+"\")'>"+filename+"</a></td><td><span id='filesize"+fileid+"' >"+filesize+"</span>" +
        "<span id='progress"+fileid+"' ></span></td><td><a onclick=\"deletefile('"+fileid+"', '"+mang_cd+"')\" style='cursor:pointer;color: rgb(4, 84, 195);'>删除</a>" +
        "</td><td><a onclick=\"dlfile('"+fileid+"', '"+filename+"', '"+mang_cd+"')\" style='cursor:pointer;color: rgb(4, 84, 195);'>下载</a></td></tr>";
    addFileName(filename,fileid);
    return filediv;
}

// 删除文件上传对应div
var removeFileDiv = function(fileid) {
    var element = document.getElementById("file"+fileid);
    element.parentNode.removeChild(element);
}

// 控制进度条
var progressctrl = function(fileid, proc) {
    $('#progress'+fileid).text(" ("+proc+")");
}

/* 校验文件
* 判断文件大小及是否已上传
*/
var validfile = function(filename, filesize) {
    if (fileNames.indexOf(filename)>=0) {
        alert(filename+" 已上传，请选择其他文件");
        return false;
    }

    if (filesize>6291456) {
        alert(filename+" 大于5M，请选择小于5M的文件");
        return false;
    }

    if (filesize==0) {
        alert(filename+" 是空文件，请重新选择上传文件");
        return false;
    }

    return true;
}

function genUUID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

//32位UUID
function UUID() {
    return genUUID(32,Math.floor(Math.random() * 32) + 10 );
}

function getFile(mang_cd) {
    pdata = {
        conc_id: id,
    };

    var url = convertJsonToUrl(pdata);
  if(id!=null&&id!=""){
	  $.ajax({
	        url: basePath + 'jdjc/getConcProblemFile'+url,
	        type: "GET",
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function (data) {
	            if (data && data.length>0) {
	                for (var i=0; i<data.length; ++i) {
	                    $("#uploadfiles").append(getFileDiv(data[i].FILE_TITL+data[i].FILE_EXT,data[i].FILE_ID,data[i].FILE_SIZE+"KB", data[i].MANG_CD));
	                }
	            }
	        }
	    });
  }
  

}

// 上传文件
var initUpload = function(mang_cd) {
    var FileController = basePath + "jdjc/upload";

    $('#uploadfile').fileupload({
        url: FileController,
        add: function (e, data) {
            // 生成文件uuid
            var uuid = UUID();
            var filename = data.files[0].name;
            var filesize = Math.ceil(data.files[0].size/1024);

            $("#uploadfiles").append(getFileDiv(filename,uuid,filesize+"KB", mang_cd));
            var scrollheight = $('#uploadfiles').height();
            $('#scrollfiles').scrollTop(scrollheight);
            data.fileUUID = uuid;
         
            // 添加文件uuid到request,总表主ID：conc_id
            data.formData = {file_id:uuid, conc_id:id, c_id:"", file_size:filesize, mang_cd:mang_cd};
            data.submit();
        },
        done: function (e, data) {
            var fileid = data.fileUUID;
            progressctrl(fileid,"100%");
            var res = data.result;
            if (!res) {
                // 上传错误，则删除文件上传div
                removeFileDiv(fileid);
                deleteFIleFromArray(fileid);
                alert("上传失败");
            }
            else if (fileIds.indexOf(fileid)<0){
                fileIds.push(fileid);
            }
        },
        progress: function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            if (progress==100) {
                // 前台传递100%之后，后台需要消耗存储时间
                progress=98;
            }
            var fileid = data.fileUUID;
            progressctrl(fileid,progress+"%");
        }
    });
}

// 删除文件
var deletefile = function(fileid, mang_cd) {
    pdata = {
        id: id,
        file_id : fileid,
        mang_cd: mang_cd
    };
    $.ajax({
        url:basePath+'jdjc/delConcFile',
        type:"POST",
        data: JSON.stringify(pdata),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data){
            if (!data) {
                alert(data.message);
                return;
            }
            removeFileDiv(fileid);
            deleteFIleFromArray(fileid);
        }
    })
}

// 获取文件后缀名
var getFileExt = function(filename) {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
};

function dlfile(file_id, filename, mang_cd) {
    $.fileDownload(basePath + 'spgc/downloadfileProblem', {
        httpMethod : 'POST',
        data : {
            id: id,
            file_id : file_id,
            mang_cd: mang_cd
        },
        successCallback : function(url) {
            debugger;
        }
    })
}