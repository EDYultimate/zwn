let param = {}
$(function () {
  buildForm(id)
})

function buildForm(id) {
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwYsjhEditInfo', param, function (result) {
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#ad_cd').val(isNull(data[0].AD_NM))
    $('#levels').val(isNull(data[0].LEVELS))
    $('#industry').val(isNull(data[0].INDUSTRY))
    $('#org').val(isNull(data[0].ORG))

    $('#jan').val(isNull(data[0].JAN))
    $('#feb').val(isNull(data[0].FEB))
    $('#mar').val(isNull(data[0].MAR))
    $('#apr').val(isNull(data[0].APR))
    $('#may').val(isNull(data[0].MAY))
    $('#june').val(isNull(data[0].JUNE))
    $('#july').val(isNull(data[0].JULY))
    $('#aug').val(isNull(data[0].AUG))
    $('#sept').val(isNull(data[0].SEPT))
    $('#oct').val(isNull(data[0].OCT))
    $('#nov').val(isNull(data[0].NOV))
    $('#dec').val(isNull(data[0].DEC))
    $('#total').val(isNull(data[0].TOTAL))

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(id)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id) {
  const param = {}

  /*    var org = $("#org").val();
        if(org==null||org==''){
            alert("单位名称不能为空");
            return;
        }*/

  param.id = id
  param.jan = $('#jan').val()
  param.feb = $('#feb').val()
  param.mar = $('#mar').val()
  param.apr = $('#apr').val()
  param.may = $('#may').val()
  param.june = $('#june').val()
  param.july = $('#july').val()
  param.aug = $('#aug').val()
  param.sept = $('#sept').val()
  param.oct = $('#oct').val()
  param.nov = $('#nov').val()
  param.dec = $('#dec').val()

  param.total = $('#total').val()

  jQuery.getJSON(basePath + 'jyys/ywsj/updateYsdwYsjhInfo', param, function (data) {
    alert(data.info)
    parent.search()
    parent.layer.closeAll()
  })
}
/**
 * 获得当前时间
 */
function getCurrentDate() {
  const currentDate = new Date() //当前时间
  let dayTM = currentDate.getDate()
  let monthTM = currentDate.getMonth() + 1
  const yearTM = currentDate.getFullYear()
  if (parseInt(dayTM) < 10) {
    dayTM = '0' + parseInt(dayTM)
  }
  if (parseInt(monthTM) < 10) {
    monthTM = '0' + parseInt(monthTM)
  }
  return yearTM + '-' + monthTM + '-' + dayTM
}
