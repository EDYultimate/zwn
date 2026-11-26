dojoConfig = {
  parseOnLoad: true,
  packages: [
    {
      name: 'tdlib',
      location: this.location.pathname.replace(/\/[^/]+$/, '') + '/../../../common/js/tdlib'
    },
    {
      name: 'splib',
      location: this.location.pathname.replace(/\/[^/]+$/, '') + '/../../../common/js/splib'
    },
    {
      name: 'layer',
      location: this.location.pathname.replace(/\/[^/]+$/, '') + '/../../../common/js/layerEx'
    },
    {
      name: 'Measure',
      location: this.location.pathname.replace(/\/[^/]+$/, '') + '/../../../common/js/Measure'
    },
    {
      name: 'Query',
      location: this.location.pathname.replace(/\/[^/]+$/, '') + '/../../../common/js/Query'
    },
    {
      name: 'Symbol',
      location: this.location.pathname.replace(/\/[^/]+$/, '') + '/../../../common/js/Symbol'
    }
  ]
}
