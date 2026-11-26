function finished() {
	initstyle();
}

function initstyle() {
	// 标题宽度设置为和表格宽度相同
	var width = $('#table').width();
	$('.titleDiv').width(width);
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
	$.post(hwwr.basePath+'message/gb/getSkXslGb', {
		year: hwwr.option.year
	}, function(data){
		var results = JSON.parse(data);
		if (!results || results.length<1) {
			results = makeEmptyData();
		}
		option = {
				// 需要在列中合并单元格
				mergeincols: [2],
				// 需要合并的行索引(不包含隐藏)
				mergeinrows:[9],
				// 最大合并列单元格个数
				mergecolcellsize:10,
				// 最大合并行单元格个数 
				mergerowcellsize:2
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

//构造空数据
function makeEmptyData() {
	return [
	{"WRCS_CD":"C010000040000","STYPE":"大型水库","WRCS_NM":"滦河及冀东沿海","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"C020000040000","STYPE":"大型水库","WRCS_NM":"海河北系","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"C030000040000","STYPE":"大型水库","WRCS_NM":"海河南系","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"C000000040000","STYPE":"大型水库","WRCS_NM":"合计","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"C010000040000","STYPE":"中型水库","WRCS_NM":"滦河及冀东沿海","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"C020000040000","STYPE":"中型水库","WRCS_NM":"海河北系","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"C030000040000","STYPE":"中型水库","WRCS_NM":"海河南系","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"C000000040000","STYPE":"中型水库","WRCS_NM":"合计","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""},
	{"WRCS_CD":"","STYPE":"海河流域合计","WRCS_NM":"海河流域合计","RES_YSW":"","RES_YEW":"","WRB_CD":"0400002013009","RES_NUM":"","RES_CAL":""}
	];
}

$(document).ready(function(){
	initstyle();
	inittable();
	//
})