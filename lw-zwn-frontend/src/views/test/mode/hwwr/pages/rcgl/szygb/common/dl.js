$(document).ready(function () {
  if (type === 'l1') {
    $('#l1table').css('display', 'block')
  } else if (type === 'l2') {
    $('#l2table').css('display', 'block')
  } else if (type === 'l3') {
    $('#l3table').css('display', 'block')
  } else if (type === 'l4') {
    $('#l4table').css('display', 'block')
  } else if (type === 'l5') {
  } else if (type === 'l6') {
    $('#l6table').css('display', 'block')
  }

  readparentids()
  if (existNotFull()) {
    $('#checkBtn').attr('value', '全选')
  }
})

function existNotFull() {
  const ck_size = $('#' + type + 'table input').length
  let cked_size = 0
  for (let i = 0; i < ck_size; ++i) {
    if ($('#' + type + 'table input')[i].checked) {
      ++cked_size
    }
  }
  if (cked_size > 0 && ck_size > cked_size) {
    return true
  }
  return false
}

function checkToggle() {
  const ck_size = $('#' + type + 'table input').length
  let cked_size = 0
  for (let i = 0; i < ck_size; ++i) {
    if ($('#' + type + 'table input')[i].checked) {
      ++cked_size
    }
  }

  if (ck_size == cked_size) {
    $('#checkBtn').attr('value', '全选')
    $('#' + type + 'table input').removeAttr('checked')
  } else {
    $('#checkBtn').attr('value', '取消全选')
    $('#' + type + 'table input').attr('checked', 'checked')
  }
}

function confirmBtn() {
  setparentids()

  if (parent.typeids.length === 0) {
    alert('请至少选择一个分区')
    return
  }

  parent.layer.closeAll()
}

function readparentids() {
  const table = $('#' + type + 'table input')
  for (let i = 0; i < table.length; ++i) {
    if (parent.typeids.indexOf(table[i].id) > -1) {
      table[i].checked = true
    }
  }
}

function setparentids() {
  parent.typeids = []
  parent.typenames = []

  const inputs = $('#' + type + 'table td input')
  const tds = $('#' + type + 'table td.trow')

  for (let i = 0; i < inputs.length; ++i) {
    if (inputs[i].checked) {
      const name = $(tds[i])[0].textContent
      parent.typeids.push(inputs[i].id)

      if (type === '13') {
        const ad = inputs[i].id.substr(7, 6)
        if (adTypes.hasOwnProperty(ad)) {
          parent.typenames.push(name + '[' + adTypes[ad] + ']')
        }
      } else {
        parent.typenames.push(name)
      }
    }
  }
  parent.setTypenames()
}

function getSelids() {
  const resids = []
  const table = $('#' + type + 'table input')
  for (let i = 0; i < table.length; ++i) {
    if (table[i].checked) {
      resids.push(table[i].id)
    }
  }
  return resids
}

function getAllids() {
  const res = []
  const table = $('#' + type + 'table input')
  for (let i = 0; i < table.length; ++i) {
    res.push(table[i].id)
  }
  return res
}
