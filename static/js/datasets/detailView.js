// This is the javascript file for the map detail view
// It is proving difficult to test because of mocking a dataset



// when the dom is ready do all this stuff
// this should be put into a function.
  let value = document.getElementById("mapid").getAttribute("value"),
  ext = document.getElementById("mapid").getAttribute("ext");
  console.log(ext);

  var dataset;

  if (ext === "kml") {
    dataset = omnivore.kml(url=`/load_dataset/${value}`);
  } else if (ext === "csv") {
    dataset = omnivore.csv(url=`/load_dataset/${value}`);
  } else {
    dataset = omnivore.geojson(url=`/load_dataset/${value}`);
  }

  function onReadyPopups() {
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
  }


domReady( () => { 
  dataset.on("ready", onReadyPopups()).addTo(myMap);
  var bounds = dataset.getBounds();
  myMap.fitBounds(bounds);
});
