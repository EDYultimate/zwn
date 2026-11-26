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
		tp: 002
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
	$.post(hwwr.basePath+'message/gb/getDbzJslGb', {
		year: hwwr.option.year
	}, function(data){
		var results = JSON.parse(data);
		option = {
				// 真实表头
				realth: $("#realth tr th[data-field]"),
				// 需要在列中合并单元格
				mergeincols: [2,3],
				// 最大合并的单元格个数
				mergecolcellsize: 2
		};
		ctable = cgrid.instance("table", option);
		ctable.finished = finished;
		ctable.genTable(results);
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

$(document).ready(function(){
	var hh = document.body.clientHeight;
	var height = hh-$(".searchDiv").height()-50;
	$(".conent").css("height",height);

	initstyle();
	inittable();
})