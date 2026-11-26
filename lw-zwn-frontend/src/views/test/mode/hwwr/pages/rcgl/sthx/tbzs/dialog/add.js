$(document).ready(function () {
  loadData()
})

const keys = [
  'ADDVNM',
  'AD_CD',
  'GYNDMB',
  'GYNDSJ',
  'NTLYMB',
  'NTLYSJ',
  'SGNQMB',
  'SGNQSJ',
  'YSZLMB',
  'YSZLSJ'
]

// 清空
function clear() {
  for (const i in keys) {
    const key = keys[i]
    $('input[name="' + key + '"]').val('')
  }
}

function loadData() {
  if (sthxDate) {
    let dt = sthxDate
    if ($('#sthxDate').val() === '') {
      $('#sthxDate').val(dt)
    } else if ($('#sthxDate').val() != dt) {
      dt = $('#sthxDate').val()
      sthxDate = dt
    }

    clear()

    $.getJSON(basePath + '/rcgl/sthx/getSthxData', { tm: dt }, function (data) {
      const listMap = data.result
      for (let i = 0; i < listMap.length; i++) {
        const row = listMap[i]
        for (const j in keys) {
          const key = keys[j]
          if (!row.hasOwnProperty(key)) {
            continue
          }
          // 农田灌溉有效利用系数 需要除以100
          if (key === 'NTLYMB' || key === 'NTLYSJ') {
            row[key] = (new Number(row[key] / 100).toFixed(3) * 1000) / 1000
          }
          $('#' + row.AD_CD + ' > td > input[name="' + key + '"]').val(row[key])
        }
      }
    })
  }
}

function save() {
  const json = { data: [], year: sthxDate }
  const rows = $('#table > tbody > tr')
  for (const i in rows) {
    const row = rows[i]
    if (row.id) {
      const entity = {}
      entity.ad_cd = row.id
      // 一行
      const cols = row.children
      // 跳过第一列
      for (let j = 1; j < cols.length; ++j) {
        const col = cols[j]
        const key = col.children[0].getAttribute('name')
        if (!key) {
          continue
        }
        const val = $(col.children).val()
        entity[key.toLowerCase()] = val
      }
      json.data.push(entity)
    }
  }

  $.ajax({
    type: 'POST',
    url: basePath + 'rcgl/sthx//updateSthx',
    contentType: 'application/json',
    async: true,
    data: JSON.stringify(json),
    success: function (data) {
      const res = JSON.parse(data)
      if (res.success) {
        alert('保存成功')
        cancel()
      } else {
        alert('保存失败')
      }
    }
  })
}

function cancel() {
  parent.layer.closeAll()
}
