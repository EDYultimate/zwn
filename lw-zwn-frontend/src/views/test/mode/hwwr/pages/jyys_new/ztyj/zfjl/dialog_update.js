let param = {}
const uid = ''
$(function () {
  buildForm(id)
})

function buildForm(id) {
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ztyj/getProZfjlEditInfo.action', param, function (result) {
    const data = result.list
    $('#nm').val(isNullZ(data[0].NM))
    $('#firamount').val(isNullZ(data[0].FIRAMOUNT))
    $('#firtm').val(isNullZ(data[0].FIRTM))
    $('#secamount').val(isNullZ(data[0].SECAMOUNT))
    $('#sectm').val(isNullZ(data[0].SECTM))
    $('#thiamount').val(isNullZ(data[0].THIAMOUNT))
    $('#thitm').val(isNullZ(data[0].THITM))

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(id, uid)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id, uid) {
  const param = {}

  /*    var nm=$("#nm").val();
    if (nm == null||nm =='') {
        alert("请填写项目名称");
        return;
    }

    param.nm=$("#nm").val(); //项目名称*/

  const firamount = $('#firamount').val()
  if (firamount == null || firamount == '') {
    alert('请填写第一笔金额')
    return
  }

  param.firamount = $('#firamount').val() //第一笔金额
  param.firtm = $('#firtm').val() //支付时间
  param.secamount = $('#secamount').val() //第二笔金额
  param.sectm = $('#sectm').val() //支付时间
  param.thiamount = $('#thiamount').val() //第三笔金额
  param.thitm = $('#thitm').val() //支付时间

  param.tm = getCurrentDate()
  param.id = id
  jQuery.getJSON(basePath + 'jyys/ztyj/saveProZfjlInfo', param, function (data) {
    alert(data.info)
    parent.search(1)
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
