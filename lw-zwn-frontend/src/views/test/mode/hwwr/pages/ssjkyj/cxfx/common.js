function getWqType(num) {
  if (num) {
    try {
      if (parseInt(num) == NaN) {
        return ''
      }

      switch (num) {
        case '1':
          return 'Ⅰ'
        case '2':
          return 'Ⅱ'
        case '3':
          return 'Ⅲ'
        case '4':
          return 'Ⅳ'
        case '5':
          return 'Ⅴ'
        case '6':
          return '劣Ⅴ'
        default:
          return ''
      }
    } catch (e) {
      return ''
    }
  } else {
    return ''
  }
}

function isNulls(vad) {
  if (vad === undefined || vad === null || vad === '' || vad === 'undefined' || vad === 'null') {
    return ''
  }
  return vad
}
