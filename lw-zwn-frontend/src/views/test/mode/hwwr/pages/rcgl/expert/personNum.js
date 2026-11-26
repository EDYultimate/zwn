function radomPerson() {
  const personnum = $('#personnum').val()
  if (personnum == '' || personnum <= 0) {
    alert('人数不能小于零')
    return
  }
  parent.newAdd(personnum)
  parent.layer.closeAll()
}
