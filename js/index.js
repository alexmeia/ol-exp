var markerOne = new ol.Feature({
  geometry: new ol.geom.Point([11.68767, 43.9847398]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500
});

var markerTwo = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.transform([11.6703, 43.1857], 'EPSG:4326', 'EPSG:3857')),
  name: 'Da qualche parte in Italia',
  population: 4000,
  rainfall: 500
});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
    anchor: [0.5, 22],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    opacity: 1,
    src: 'images/marker.png'
  }))
});

markerOne.setStyle(iconStyle);
markerTwo.setStyle(iconStyle);

var vectorSource = new ol.source.Vector({
  features: [markerOne, markerTwo]
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource
});

var rasterLayer = new ol.layer.Tile({
  source: new ol.source.TileJSON({
    url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp'
  })
});

var osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var map = new ol.Map({
  layers: [osmLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new ol.View({
    center: ol.proj.transform([11.0, 43.0], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5
  })
});

var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(popup);

// display popup on click
map.on('click', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
  if (feature) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    popup.setPosition(coord);
    $(element).popover({
      'placement': 'top',
      'html': true,
      'content': feature.get('name')
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});

// change mouse cursor when over marker
$(map.getViewport()).on('mousemove', function(e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return true;
  });
  if (hit) {
    map.getTarget().style.cursor = 'pointer';
  } else {
    map.getTarget().style.cursor = '';
  }
});