function genTableTemp(m, year) {
  if (m < 1) {
    return
  }
  const M = 12 * m

  const first =
    '<td id="year_2019" rowspan="12" style="width: 72px;">' +
    '<div>' +
    year +
    '年度' +
    '<div style="position: relative;margin-top: 5px;display: none">' +
    '<button>-</button>' +
    '</div>' +
    '</div>' +
    '</td>' +
    '<td colspan="3">月份</td>' +
    '<td >1</td>' +
    '<td >2</td>' +
    '<td >3</td>' +
    '<td >4</td>' +
    '<td >5</td>' +
    '<td >6</td>' +
    '<td >7</td>' +
    '<td >8</td>' +
    '<td >9</td>' +
    '<td >10</td>' +
    '<td >11</td>' +
    '<td >12</td>' +
    '<td >合计</td>'

  const template =
    '<tr>' +
    '<td rowspan="3">生产状况</td>' +
    '<td colspan="2">设计规模</td>' +
    '<td ><input id="des_scal|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="des_scal|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td colspan="2">实际生产</td>' +
    '<td ><input id="act_prod|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="act_prod|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td colspan="2">生产效率</td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="prod_effi|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td rowspan="8">用水情况</td>' +
    '<td rowspan="2">许可水量</td>' +
    '<td>地表水</td>' +
    '<td colspan="13" ><input id="ww_s|' +
    year +
    '" style="width:150px;"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td >地下水</td>' +
    '<td colspan="13" ><input id="ww_g|' +
    year +
    '" style="width:150px;"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td rowspan="2">申请计划</td>' +
    '<td>地表水</td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="app_ww_s|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td >地下水</td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="app_ww_g|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td rowspan="2">批复计划</td>' +
    '<td>地表水</td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="rep_ww_s|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td >地下水</td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="rep_ww_g|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td rowspan="2">实际用水</td>' +
    '<td>地表水</td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="act_ww_s|' +
    year +
    '-13"></input></td>' +
    '</tr>' +
    '<tr>' +
    '<td >地下水</td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-01"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-02"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-03"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-04"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-05"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-06"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-07"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-08"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-09"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-10"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-11"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-12"></input></td>' +
    '<td ><input id="act_ww_g|' +
    year +
    '-13"></input></td>' +
    '</tr>'

  // 第一次加载
  if (m === 1) {
    $('#yearInfo').attr('rowspan', M)
    $('#yearInfo').parent().append(first)
    $(template).insertBefore($('#table tbody tr').last())
  } else {
    $('#yearLsInfo').attr('rowspan', M - 12)
    const frow = '<tr>' + first + '</tr>'
    $(frow + template).insertBefore($('#historyDataTable tbody tr').last())
    //        $(frow+template).insertBefore($('#table tbody tr').last());
  }
}
