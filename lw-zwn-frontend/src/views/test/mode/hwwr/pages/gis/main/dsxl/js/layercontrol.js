function initialTree(ags) {
  $('.layercontainer').empty()
  $('#layercontrol').css('display', 'block')
  const layercontainer = $('<div></div>')
  layercontainer.attr('id', 'layertest')
  layercontainer.css({
    width: 'auto',
    height: 'auto'
  })

  $('.layercontainer').append(layercontainer)
  commonConfig = ''
  $('#layertest')
    .jstree({
      /*'plugins' : [ "wholerow", "checkbox", "types" ],  */
      core: {
        data: ags
      }
    })
    .bind('click.jstree', function (event) {
      const ags = event.target
      const txt = event.target.id
      //ags.STCD = txt.slice(2, -7);
      ags.STCD = ags.text
      const stcd = ags.STCD
      locatPoint(stcd)
    })
}

function treeclickHandle() {
  $('#layertest').on('changed.jstree', function (e, data) {
    if (typeof data.node !== 'undefined') {
      window.parent.setvisible(data.node.id, data.node.state.selected)
      //		console.log(data.node.state.selected);
    }
    //alert('The selected node is: ' + data.instance.get_node(data.selected[0]).text);
  })
}
