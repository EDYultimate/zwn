function finished() {
	
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
				mergeincols: [3],
				// 最大合并的单元格个数
				mergecolcellsize: 10,
				// 需要在列中合并单元格
				mergeinrows: [1,5,14,18,19],
				// 最大合并列单元格个数
				mergerowcellsize:4,
				// 数字保留小数位数(-1为不设置保留小数位)
				numfixed:2
		};
		ctable = cgrid.instance("table", option);
		ctable.finished = finished;
		ctable.genTable(results);
		
		// 生成图形
		makecharts(results);
	})
}

function changeyear(year) {
	$('#chooseyear').val(year);
	$('#cyear').text(year);
	hwwr.option.year = year;
}

function querybyyear() {
	var year = $('#chooseyear').val();
	$('#cyear').text(year);
	hwwr.option.year = year;
	maketable();
}

// 构造空数据
function makeEmptyData() {
	return [{"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C010000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"滦河及冀东沿海","DW_A":"","PLAIN_NM":"滦冀平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"北京市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"北四河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"天津市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"北四河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"北四河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"合计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C020000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河北系","DW_A":"","PLAIN_NM":"合计"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"北京市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"天津市","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河淀西"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"大清河淀东"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"子牙河"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"漳卫河"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"黑龙港及运东"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河南省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"卫河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"合计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C030000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河南系","DW_A":"","PLAIN_NM":"合计"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河北省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"徒马河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"河南省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"徒马河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"山东省","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"徒马河平原"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"合计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"C040000","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"徒骇马颊河(二级)","DW_A":"","PLAIN_NM":"合计"},
	        {"WSV1980":"","WD_1980":"","STZ_A":"","UP_WSV":"","XZQ":"","RZ_A":"","DW_SVC":"","DG_WYL":"","AD_NM":"海河流域总计","DW_ZRN":"","ST_SVC":"","UP_SVC":"","DW_WSV":"","ST_ZRN":"","SG_ACT_EW":"","FQ":"","SUM_WSV":"","WD_CURR":"","UP_ZRN":"","ST_WSV":"","WRZ_NM":"海河流域总计","DW_A":"","PLAIN_NM":"海河流域总计"}
	        ];
}

$(document).ready(function(){
	inittable();
})