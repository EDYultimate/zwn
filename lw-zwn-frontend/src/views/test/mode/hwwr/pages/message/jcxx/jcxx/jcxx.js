function finished() {
  initstyle()
}

function initstyle() {}

function maketable() {
  $.post(hwwr.basePath + '/dpjc/dpjc/getRiverInfo', {}, function (data) {
    option = {}
    ctable = cgrid.instance('table', option)
    ctable.finished = finished
    ctable.genTable(JSON.parse(data))
  })
}

function query() {
  maketable()
}

function init() {}

$(document).ready(function () {
  init()
  maketable()
})
