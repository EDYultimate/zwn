function finished() {
	
}

function clickRow(idx) {
	var row = ctable.data[idx];
	layer.open({
	      type: 2,
	      title: row.PLAIN_NM,
	      shadeClose: false,
	      shade: 0.2,
	      maxmin: false, //开启最大化最小化按钮
	      area: ['850px', '500px'],
	      content: hwwr.basePath+'/pages/kfly/gsl/dxs/gbsj/pydxs_year_qs.jsp?wrcs_cd='+row.WRCS_CD+"&plain_nm="+row.PLAIN_NM+"&fq="+row.FQ
	    });
}

function inittable() {
	// 查询最近有数据的年份
	$.post(hwwr.basePath+'message/gb/getSzyGb_Year', {
		tp: 008
	}, function(data){
		if (!data || (data && data.length<1) ) {
			return;
		}
		var obj = JSON.parse(data);
		changeyear(obj[0].YEAR);
		maketable();
	});
}

function maketable() {
	$.post(hwwr.basePath+'message/gb/getPydxsGb', {
		year: hwwr.option.year
	}, function(data){
		var results = JSON.parse(data);
		if (!results || results.length<1) {
			results = makeEmptyData();
		}
		option = {
				// 真实表头
				realth: $("#realth tr th[data-field]"),
				// 需要在列中合并单元格
				mergeincols: [4],
				// 最大合并的单元格个数
				mergecolcellsize: 10,
				// 需要在行中合并单元格
				mergeinrows: [1,5,14,18,19],
				// 最大合并列单元格个数
				mergerowcellsize:5,
				// 数字保留小数位数(-1为不设置保留小数位)
				numfixed:2
		};
		ctable = cgrid.instance("table", option);
		ctable.finished = finished;
		ctable.clickRow = clickRow;
		ctable.genTable(results);
		
		// 生成图形
		makecharts(results);
	})
}

function changeyear(year) {
	$('#year').val(year);
	$('#cyear').text(year);
	hwwr.option.year = year;
}

function querybyyear() {
	var year = $('#year').val();
	$('#cyear').text(year);
	hwwr.option.year = year;
	maketable();
}

// 构造空数据
function makeEmptyData() {
	return [{"WRCS_CD": "C010000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C010000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"滦河及冀东沿海","DW_A":"","PLAIN_NM":"滦冀平原"},
	        {"WRCS_CD": "C020000110000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"北京市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"北四河平原"},
	        {"WRCS_CD": "C020000120000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"天津市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"北四河平原"},
	        {"WRCS_CD": "C020000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"北四河平原"},
	        {"WRCS_CD": "","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"合计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"合计"},
	        {"WRCS_CD": "C030000110000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"北京市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河平原"},
	        {"WRCS_CD": "C030000120000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"天津市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河平原"},
	        {"WRCS_CD": "C030000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河淀西"},
	        {"WRCS_CD": "C030000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河淀东"},
	        {"WRCS_CD": "C030000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"子牙河"},
	        {"WRCS_CD": "C030000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"漳卫河"},
	        {"WRCS_CD": "C030000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"黑龙港及运东"},
	        {"WRCS_CD": "C030000410000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河南省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"卫河平原"},
	        {"WRCS_CD": "","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"合计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"合计"},
	        {"WRCS_CD": "C040000130000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"徒马河平原"},
	        {"WRCS_CD": "C040000410000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河南省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"徒马河平原"},
	        {"WRCS_CD": "C040000370000","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"山东省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"徒马河平原"},
	        {"WRCS_CD": "","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"合计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"合计"},
	        {"WRCS_CD": "","WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"海河流域总计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河流域总计","DW_A":"","PLAIN_NM":"海河流域总计"}
	        ];
}

$(document).ready(function(){

	var hh = document.body.clientHeight;
	var height = hh-$(".searchDiv").height()-50;
	$(".conent").css("height",height);

	inittable();
})