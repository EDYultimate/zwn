let param = {}
$(function () {
  //一二级行业联动
  $('#industry').change(function () {
    initSecIndustry()
  })

  //初始化二级行业
  initSecIndustry()

  buildForm(id)
})

function buildForm(id) {
  param = {}
  param.id = id
  const index_ = parent.layer.load()
  jQuery.getJSON(basePath + 'jyys/ywsj/getMlglEditInfo', param, function (result) {
    const data = result.list

    $('#ad_cd').val(isNull(data[0].AD_CD))
    $('#levels').val(isNull(data[0].LEVELS))
    $('#industry').val(isNull(data[0].INDUSTRY))

    initSecIndustry(isNull(data[0].SECINDUSTRY)) //获取默认的二级行业

    /* $("#secindustry").val(isNull(data[0].SECINDUSTRY));*/

    $('#org').val(isNull(data[0].ORG))
    $('#org_cd').val(isNull(data[0].ORG_CD))

    const yr = isNull(data[0].YR)

    parent.layer.close(index_)
    $('#saveButton').click(function () {
      saveDbBase(id, yr)
    })
  })
}

function closediv() {
  parent.layer.closeAll()
}
// 保存
function saveDbBase(id, yr) {
  const param = {}

  const org = $('#org').val()
  if (org == null || org == '') {
    alert('单位名称不能为空')
    return
  }

  param.ad_cd = $('#ad_cd').val()
  param.levels = $('#levels').val()
  param.industry = $('#industry').val()
  param.secindustry = $('#secindustry').val()
  param.org = $('#org').val()
  param.org_cd = $('#org_cd').val()

  param.id = id
  param.yr = yr
  debugger
  jQuery.getJSON(basePath + 'jyys/ywsj/saveMlglFileInfo', param, function (data) {
    alert(data.info)
    debugger
    parent.search(yr)
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

//初始化二级行业
function initSecIndustry(cd) {
  $('#secindustry').empty()
  let secindustryhtml
  const param = {}
  param.industry_cd = $('#industry').val()
  jQuery.getJSON(basePath + '/jyys/ywsj/getSecIndustryInfo', param, function (data) {
    if (data != null) {
      const dataList = data.list
      if (dataList.length > 0) {
        for (let i = 0; i < dataList.length; i++) {
          if (cd == dataList[i].INDUSTRY_CD) {
            secindustryhtml +=
              "<option  selected  value='" +
              dataList[i].INDUSTRY_CD +
              "'>" +
              dataList[i].INDUSTRY_NM +
              '</option>'
          } else {
            secindustryhtml +=
              "<option value='" +
              dataList[i].INDUSTRY_CD +
              "'>" +
              dataList[i].INDUSTRY_NM +
              '</option>'
          }
        }
      }
    }
    $('#secindustry').html(secindustryhtml)
  })
}
