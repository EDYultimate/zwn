$(function () {
  const hh = document.body.clientHeight
  const height = hh - $('.searchDiv').height() - 50
  $('.conent').css('height', hh - $('.searchDiv').height() - 50)
  initYear()
})

function initYear() {
  jQuery.getJSON('/hwwr/message/wnnb/getSzyNb_WnYear', { tp: '038' }, function (data) {
    console.info(data)
    if (data) {
      $('#year').val(data)
    }
    search()
  })
}
function search() {
  $('#t_year').text('')
  const year = $('#year').val()
  $('#t_year').text(year)
  const fw = $('#fw').val()
  $('#tbody').empty()
  jQuery.getJSON(
    parent.basePath + '/message/wnnb/getSzyNb_ssjdgl_xkz',
    { yr: year, type: fw },
    function (data) {
      let str = ''
      if (data != null && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          str +=
            '<tr><td  style="width:150px">' +
            isNull(data[i].NM) +
            '</td>' +
            '<td>' +
            isNull(data[i].DB_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].DB_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].DX_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].DX_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].DRS_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].DRS_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].KQS_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].KQS_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].SYQT_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].SYQT_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].SY_TOLNUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].SY_TOLSL) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZLS_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZLS_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZLS_SH) +
            '</td>' +
            '<td>' +
            isNull(data[i].SH_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].SH_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].GY_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].GY_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZLHD_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].ZLHD_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].NY_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].NY_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].QT_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].QT_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOL_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].TOL_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].SLXK_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].SLXK_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].QTXK_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].QTXK_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].ST_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].ST_SL) +
            '</td>' +
            '<td>' +
            isNull(data[i].JLSS_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].SPH_NUM) +
            '</td>' +
            '<td>' +
            isNull(data[i].TSSZ_NUM) +
            '</td>' +
            '</tr>'
        }
        $('#tbody').html(str)
      }
    }
  )
}
