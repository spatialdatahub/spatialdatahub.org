// This is the javascript file for the map detail view
// It is proving difficult to test because of mocking a dataset

// when the dom is ready do all this stuff
domReady( () => { 
  let value = document.getElementById("mapid").getAttribute("value"),
  dataset = omnivore.geojson(url=`/load_dataset/${value}`)
  .on("ready", () => {

    // add popups with same code as in portalView.js
    dataset.eachLayer( (layer) => {
      let popupContent = [];
      for (let key in layer.feature.properties) {
        popupContent.push(
          `<b>${key}</b>: ${layer.feature.properties[key]}`
        );
      }
      if (layer.feature.geometry.type === "Point") {
        popupContent.push(`<b>Latitude:</b> ${layer.feature.geometry.coordinates[1]}`);
        popupContent.push(`<b>Longitude:</b> ${layer.feature.geometry.coordinates[0]}`);
      }
      layer.bindPopup(popupContent.join("<br/>"));
    });

    // fit bounds
    let bounds = dataset.getBounds();
    myMap.fitBounds(bounds);
  });

  //add to map
  dataset.addTo(myMap);
});
