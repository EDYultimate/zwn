var GIS = GIS || {}
require([
  'Measure/measuretools',
  'esri/toolbars/draw',
  'esri/symbols/Font',
  'esri/symbols/TextSymbol',
  'Symbol/Symbol',
  'Query/QueryLocator',
  'esri/layers/FeatureLayer',
  'esri/renderers/SimpleRenderer',
  'esri/symbols/PictureMarkerSymbol',
  'esri/map',
  'esri/layers/QueryDataSource',
  'esri/layers/LayerDrawingOptions',
  'esri/renderers/SimpleRenderer',
  'esri/layers/LayerDataSource',
  'esri/layers/TableDataSource',
  'esri/layers/DynamicLayerInfo',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'esri/tasks/IdentifyTask',
  'esri/tasks/IdentifyParameters',
  'esri/dijit/InfoWindow',
  'esri/graphic',
  'esri/Color',
  'esri/layers/GraphicsLayer',
  'esri/symbols/SimpleFillSymbol',
  'esri/layers/FeatureLayer',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/tasks/Geoprocessor',
  'esri/tasks/JobInfo',
  'esri/layers/ArcGISTiledMapServiceLayer',
  'esri/layers/ArcGISDynamicMapServiceLayer',
  'esri/geometry/Extent',
  'esri/SpatialReference',
  'dojo/dom',
  'dojo/on',
  'dojo/dom-class',
  'esri/geometry/Point',
  'esri/geometry/ScreenPoint',
  'tdlib/TDTimage',
  'tdlib/TDTLayer',
  'tdlib/TDTDemLayer',
  'tdlib/VectorLayer',
  'layer/infoLayer/InfoLayer',
  'layer/infoWindow/InfoWindow',
  'dojo/domReady!'
], function (
  measuretools,
  Draw,
  Font,
  TextSymbol,
  SymbolTool,
  QueryLocator,
  FeatureLayer,
  SimpleRenderer,
  PictureMarkerSymbol,
  Map,
  QueryDataSource,
  LayerDrawingOptions,
  SimpleRenderer,
  LayerDataSource,
  TableDataSource,
  DynamicLayerInfo,
  Query,
  QueryTask,
  IdentifyTask,
  IdentifyParameters,
  InfoWindow,
  Graphic,
  Color,
  GraphicsLayer,
  SimpleFillSymbol,
  FeatureLayer,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  Geoprocessor,
  JobInfo,
  ArcGISTiledMapServiceLayer,
  ArcGISDynamicMapServiceLayer,
  Extent,
  SpatialReference,
  dom,
  on,
  domClass,
  Point,
  ScreenPoint,
  TDTimage,
  TDTLayer,
  TDTDemLayer,
  Zoomgralayer,
  InfoLayerEx,
  InfoWindowEx
) {
  GIS.Map = GIS.Map || Map
  GIS.Draw = GIS.Draw || Draw
  GIS.Font = Font
  GIS.TextSymbol = TextSymbol
  GIS.SymbolTool = SymbolTool
  GIS.QueryLocator = QueryLocator
  GIS.FeatureLayer = FeatureLayer
  GIS.Measuretool = measuretools
  GIS.SimpleRenderer = SimpleRenderer
  GIS.PictureMarkerSymbol = PictureMarkerSymbol
  GIS.QueryDataSource = GIS.QueryDataSource || QueryDataSource
  GIS.LayerDrawingOptions = GIS.LayerDrawingOptions || LayerDrawingOptions
  GIS.SimpleRenderer = GIS.SimpleRenderer || SimpleRenderer
  GIS.LayerDataSource = GIS.LayerDataSource || LayerDataSource
  GIS.TableDataSource = GIS.TableDataSource || TableDataSource
  GIS.DynamicLayerInfo = GIS.DynamicLayerInfo || DynamicLayerInfo
  GIS.Query = GIS.Query || Query
  GIS.QueryTask = GIS.QueryTask || QueryTask
  GIS.IdentifyTask = GIS.IdentifyTask || IdentifyTask
  GIS.IdentifyParameters = GIS.IdentifyParameters || IdentifyParameters
  GIS.ArcGISTiledMapServiceLayer = GIS.ArcGISTiledMapServiceLayer || ArcGISTiledMapServiceLayer
  GIS.ArcGISDynamicMapServiceLayer =
    GIS.ArcGISDynamicMapServiceLayer || ArcGISDynamicMapServiceLayer
  GIS.Extent = GIS.Extent || Extent
  GIS.SpatialReference = GIS.SpatialReference || SpatialReference
  GIS.Geoprocessor = GIS.Geoprocessor || Geoprocessor
  GIS.JobInfo = GIS.JobInfo || JobInfo
  GIS.SimpleLineSymbol = GIS.SimpleLineSymbol || SimpleLineSymbol
  GIS.FeatureLayer = GIS.FeatureLayer || FeatureLayer
  GIS.GraphicsLayer = GIS.GraphicsLayer || GraphicsLayer
  GIS.SimpleFillSymbol = GIS.SimpleFillSymbol || SimpleFillSymbol
  GIS.Color = GIS.Color || Color
  GIS.Graphic = GIS.Graphic || Graphic
  GIS.InfoWindow = GIS.InfoWindow || InfoWindow
  GIS.TDTimage = TDTimage
  GIS.TDTLayer = TDTLayer
  GIS.Zoomgralayer = Zoomgralayer
  GIS.TDTDemLayer = TDTDemLayer
  GIS.InfoLayerEx = InfoLayerEx
  GIS.Point = Point
  this.ScreenPoint = ScreenPoint
  GIS.InfoWindowEx = InfoWindowEx
  GIS.SimpleMarkerSymbol = SimpleMarkerSymbol
  init()
})
