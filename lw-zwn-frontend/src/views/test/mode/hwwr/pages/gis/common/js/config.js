/*
 * 全局配置文件
 */
const commonConfig = {
  url: 'http://10.3.250.91:6080' /*图层默认ip*/,
  ip: 'http://10.3.250.91:6080',
  queryUrl: '',
  libUrl: 'http://219.138.108.99:9080/zhia/pages/gis/common/js/'
  //		basePath:"http://localhost:8080/zhia"
}
window.onload = function () {
  const pathName = window.location.pathname.substring(1)
  const webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'))
  if (webName == '') {
    commonConfig.basePath = window.location.protocol + '//' + window.location.host
  } else {
    commonConfig.basePath = window.location.protocol + '//' + window.location.host + '/' + webName
  }
}
/*水源地点击事件*/
function graphicCickHander_syd(stcd, stnm) {
  parent.initLayer(stcd, stnm)
}
/*降水量点击事件*/
function graphicCickHander_jsl(stcd) {}
function graphicCickHander_crjsl() {
  alert('出入境水量点击事件')
}
function graphicCickHander_sjdm(stcd) {
  parent.szDialogShow(stcd)
}
/*水位流量站*/
function graphicCickHander_swllz(stcd, stnm) {
  //parent.szDialogShow(stcd);
  parent.initLayer(stcd, stnm)
}
/*雷达水位站*/
function graphicCickHander_ldswz(stcd, stnm) {
  //alert("雷达水位站"+stcd+stnm);
  parent.initLayer(stcd, stnm)
}
/*入河排污口*/
function graphicCickHander_rhpwk(stcd) {
  //parent.szDialogShow(stcd);
}
