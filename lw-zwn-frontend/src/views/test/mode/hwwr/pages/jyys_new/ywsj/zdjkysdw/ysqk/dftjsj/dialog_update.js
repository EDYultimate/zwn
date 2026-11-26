let param = {}
$(function () {
  buildForm(id)
})

function buildForm(id) {
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getYsdwDftjEditInfo', param, function (result) {
    const data = result.list
    $('#yr').val(isNull(data[0].YR))
    $('#ad_cd').val(isNull(data[0].AD_NM))
    $('#levels').val(isNull(data[0].LEVELS))
    $('#industry').val(isNull(data[0].INDUSTRY))
    $('#org').val(isNull(data[0].ORG))

    $('#w').val(isNull(data[0].W))

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
  param.w = $('#w').val()

  jQuery.getJSON(basePath + 'jyys/ywsj/updateYsdwDftjInfo', param, function (data) {
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
