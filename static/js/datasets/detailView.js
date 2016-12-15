// This is the javascript file for the map detail view

// Define my variables
  let value = document.getElementById("mapid").getAttribute("value"),
      ext = document.getElementById("mapid").getAttribute("ext"),
      dsUrl = `/load_dataset/${value}`,
      dataset,
      featureCount = 0,
      featureCountElement = document.getElementById('feature_count'),
      featureSelector = document.getElementById('feature_selector');

// define my popups function
  function onReadyPopups() {
    dataset.eachLayer( (layer) => {
      featureCount++;
      let popupContent = []; 
      for (let key in layer.feature.properties) {
        popupContent.push(
          `<b>${key}</b>: ${layer.feature.properties[key]}`
        );
        // add elements to property filter selector
        featureSelector.options[featureSelector.options.length] = new Option(key);
        // this doesn't work because it adds all elements for every single layer
        // I only want it to run through a single layer and add it
      }

      if (layer.feature.geometry.type === "Point") {
        popupContent.push(`<b>Latitude:</b> ${layer.feature.geometry.coordinates[1]}`);
        popupContent.push(`<b>Longitude:</b> ${layer.feature.geometry.coordinates[0]}`);
      }
      layer.bindPopup(popupContent.join("<br/>"));
    });

    let bounds = dataset.getBounds();
    myMap.fitBounds(bounds);
    // count features and add them to 'feature count html element'
    featureCountElement.innerHTML = featureCountElement.innerHTML + ` ${featureCount}`;
  }

// I might be able to add the .on and .addTo parts of this extensions to a function
let typeSwitcher = () => {
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
};

typeSwitcher();

// It would be nice to get all the different features into a 'select' element or something,
// and then use that to create a filter function
// maybe it would be easiest to start with latitude and longitude

