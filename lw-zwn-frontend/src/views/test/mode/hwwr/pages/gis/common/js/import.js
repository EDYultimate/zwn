const GIS = {}
require([
  'esri/layers/GraphicsLayer',
  'esri/geometry/Extent',
  'dojo/dom-construct',
  'esri/map',
  'esri/Color',
  'esri/symbols/Font',
  'esri/dijit/InfoWindow',
  'esri/layers/ArcGISTiledMapServiceLayer',
  'esri/dijit/Legend',
  'esri/tasks/LegendLayer',
  'esri/layers/ArcGISDynamicMapServiceLayer',
  'esri/layers/ArcGISImageServiceLayer',
  'esri/tasks/PrintTask',
  'esri/layers/FeatureLayer',
  'esri/tasks/PrintParameters',
  'esri/tasks/PrintTemplate',
  'esri/config',
  'esri/dijit/Print',
  'esri/toolbars/draw',
  'esri/graphic',
  'dojo/dom',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/TextSymbol',
  'esri/symbols/PictureMarkerSymbol',
  'dojo/parser',
  'dijit/registry',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane',
  'dijit/form/Button',
  'dijit/WidgetSet',
  'dojo/domReady!'
], function (
  GraphicsLayer,
  Extent,
  domConstruct,
  Map,
  Color,
  Font,
  InfoWindow,
  ArcGISTiledMapServiceLayer,
  Legend,
  LegendLayer,
  ArcGISDynamicMapServiceLayer,
  ArcGISImageServiceLayer,
  PrintTask,
  FeatureLayer,
  PrintParameters,
  PrintTemplate,
  esriConfig,
  Print,
  Draw,
  Graphic,
  dom,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  TextSymbol,
  PictureMarkerSymbol,
  parser,
  registry
) {
  //	esriConfig.defaults.io.proxyUrl = "http://localhost/java/proxy.jsp" ;
  //	esriConfig.defaults.io.alwaysUseProxy = true;
  GIS.GraphicsLayer = GraphicsLayer
  GIS.Extent = Extent
  GIS.Map = Map
  GIS.Color = Color
  GIS.Font = Font
  GIS.InfoWindow = InfoWindow
  GIS.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer
  GIS.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer
  GIS.FeatureLayer = FeatureLayer
  GIS.Draw = Draw
  GIS.Graphic = Graphic
  GIS.SimpleMarkerSymbol = SimpleMarkerSymbol
  GIS.SimpleLineSymbol = SimpleLineSymbol
  GIS.SimpleFillSymbol = SimpleFillSymbol
  GIS.TextSymbol = TextSymbol
  GIS.PictureMarkerSymbol = PictureMarkerSymbol
})
