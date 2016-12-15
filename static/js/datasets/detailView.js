// This is the javascript file for the map detail view
// It is proving difficult to test because of mocking a dataset



// when the dom is ready do all this stuff -- maybe...
// this should be put into a function.

  let value = document.getElementById("mapid").getAttribute("value"),
  ext = document.getElementById("mapid").getAttribute("ext");

  var dataset;

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
    let bounds = dataset.getBounds();
    myMap.fitBounds(bounds);
  }

// is there any reason to use this instead of an if else chain?
  let dsUrl = `/load_dataset/${value}`
  switch (ext) {
    case "kml":
      console.log('kml')
      dataset = omnivore.kml(url=dsUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
      break;
    case "csv":
      console.log('csv')
      dataset = omnivore.csv(url=dsUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
      break;
    default:
      console.log('geojson')
      dataset = omnivore.geojson(url=dsUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
      break;
  }


