// ////////////// //
// datasetList.js //
// ////////////// //
const returnCorrectUrl = function (link, pk) {
  return link.getAttribute('url')
    ? link.getAttribute('url')
    : `/load_dataset/${pk}`
}

const returnLayer = function (color, popupCallback, markerOptions) {
  return L.geoJson(null, {
    // set the points to little circles
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, markerOptions)
    },
    onEachFeature: (feature, layer) => {
      // make sure the fill is the color
      layer.options.fillColor = color
      // and make sure the perimiter is black (if it's a point) and the color otherwise
      feature.geometry.type === 'Point'
        ? layer.options.color = 'black'
        : layer.options.color = color
      // add those popups
      popupCallback(feature, layer)
      // mapFunctions.addPopups(feature, layer) // this comes from the index_maps.js file
    }
  })
}

const returnCluster = function (color) {
  return L.markerClusterGroup({
    iconCreateFunction: cluster => {
      const textColor = color === 'blue' || color === 'purple' || color === 'green'
        ? 'white'
        : 'black'
      return L.divIcon({
        html: `<div style="text-align: center; background-color: ${color}; color: ${textColor}"><b>${cluster.getChildCount()}</b></div>`,
        iconSize: new L.Point(40, 20)
      })
    }
  })
}

module.exports = {
  returnCorrectUrl: returnCorrectUrl,
  returnLayer: returnLayer,
  returnCluster: returnCluster
//  handleDatasetLink: handleDatasetLink
}
