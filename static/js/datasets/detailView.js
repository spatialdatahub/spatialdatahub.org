// This is the javascript file for the map detail view

// Define my variables

const value = document.getElementById('dataset_pk').getAttribute('value')
const ext = document.getElementById('dataset_ext').getAttribute('value')
const submitValuesButton = document.getElementById('submit_values_button')
const resetValuesButton = document.getElementById('reset_values_button')
const lngMinInput = document.getElementById('lng_min_input')
const lngMaxInput = document.getElementById('lng_max_input')
const latMinInput = document.getElementById('lat_min_input')
const latMaxInput = document.getElementById('lat_max_input')
const featureCountElement = document.getElementById('feature_count')
const datasetUrl = `/load_dataset/${value}`

let dataset
let featureCount = 0
let datasetProperties = []
// let featureSelector = document.getElementById('feature_selector')

// define geojson layer that the dataset may be added to
let filteredLayer = L.geoJson().addTo(myMap);


// define my popups function
const onReadyPopups = () => {
  featureCount = 0;
  filteredLayer.eachLayer( layer => {
    featureCount++;
    const popupContent = [];

    // make sure there are properties
    if (
      layer.feature.properties.length !== undefined ||
      layer.feature.properties.length != 0) {
      for (const key in layer.feature.properties) {
        popupContent.push(
          `<b>${key}</b>: ${layer.feature.properties[key]}`
        );
        // get keys and put them into keys variable
        datasetProperties.push(`${key}`);
      }
    }

    if (layer.feature.geometry.type === "Point") {
      popupContent.push(`<b>Latitude:</b> ${layer.feature.geometry.coordinates[1]}`);
      popupContent.push(`<b>Longitude:</b> ${layer.feature.geometry.coordinates[0]}`);
    }
    layer.bindPopup(popupContent.join("<br/>"));
  });

  // fit map to bounds
  const bounds = filteredLayer.getBounds();
  myMap.fitBounds(bounds);

  if (datasetProperties.length > 0) {
    // get unique dataset properties
    const uniqueDatasetProperties = [...new Set(datasetProperties)];

    const ifFeatureProperties = () => {
      // remove if they are there elements, then create elements
      if (document.getElementById("selector_container")) {
        document.getElementById("selector_container").remove();
      }

      // create elements
      const ifFeaturesElement = document.getElementById("if_features"),
        p = document.createElement("p"),
        span = document.createElement("span"),
        b = document.createElement("b"),
        text = document.createTextNode("Select property to filter by: "),
        selector = document.createElement("select"),
        input = document.createElement("input");

      // set id of p and select element
      p.setAttribute("id", "selector_container");
      selector.setAttribute("id", "feature_selector");
      input.setAttribute("id", "feature_selector_input");
      input.setAttribute("type", "text");

      // put them together
      b.appendChild(text);
      span.appendChild(b);
      span.appendChild(selector);
      span.appendChild(input);
      p.appendChild(span);
      ifFeaturesElement.appendChild(p);

      // add options to select element

      // delete options in the featureSelector element
      for (i in selector) {
        selector.options[i] = null;
      }

      // create and add options to the feature selector element
      for (i in uniqueDatasetProperties) {
        const opt = document.createElement('option');
        opt.value = uniqueDatasetProperties[i];
        opt.innerHTML = uniqueDatasetProperties[i];
        selector.appendChild(opt);
      }

    }
    ifFeatureProperties(); // this should be 'if feature properties'

  }

  // count features and add them to 'feature count html element'
  featureCountElement.innerHTML = ` ${featureCount}`;
};

// would it be better to write an if/else statement within this function
// that checks the ext variable, or to write three functions and an if / else
// statement that selects which function to use?
// what would be easier to test? What would be easier to write? What would be
// easier to debug?

// I'm going with three functions and an if / else statement
// that actually modifies which functions are even defined.


const getDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    if (ext === 'kml') {
      xhr.responseType = 'document';
      xhr.overrideMimeType('text/xml');
    }

    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
      // Maybe I should just define the if/else statement right here
        if (ext === 'csv') {
          let csvJson;
          csv2geojson.csv2geojson(
            xhr.responseText, function(err, data) {
              if (err) {
                return err;
              } else {
                return csvJson = data;
              }
          });
          resolve(csvJson); // CSV
        } else if (ext === 'kml') {
          const kmlJson = toGeoJSON.kml(xhr.response);
          resolve(kmlJson); // XML this may not work for a bit
        } else {
          resolve(JSON.parse(xhr.responseText)); // JSON
        }
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = () => reject(Error("Network Error"));
    xhr.send();
  });
  return promise;
};



if (ext === 'csv') {
  console.log('csv');
} else if (ext === 'kml') {
  console.log('kml');
} else {
  console.log('json');
}



// I don't want to add another if / else statement, but I think i may have to
// so that I can deal with the kml and csv stuff, except that I don't want
// a layer, I want a json object

const addDatasetToMapJSON = () => {
  getDataset(datasetUrl)
    .then((response) => {
      dataset = response; // this should work after kml has been
                                      //converted to geojson
      filteredLayer.addData(dataset);

    })
    .then((response) => {
      onReadyPopups(response);
    }, (error) => {
      console.log('promise error handler', error);
    });
};


// Now I've got to figure out what the url and necessary DOM elements are all called.
const filterLatLngValues = () => {
  // remove filteredLayer
  myMap.removeLayer(filteredLayer);

  // get min and max values from lat and lng inputs
  // can I lift this out of the function, and just get the values
  // for each?
  let minLng = lngMinInput.value,
      maxLng = lngMaxInput.value,
      minLat = latMinInput.value,
      maxLat = latMaxInput.value;

  // if else statements. There should be a better way to do this.
  if (minLng == "") {
    minLng = -180
  } else if (minLng <= -180) {
    minLng = -180
  } else if (minLng >= 180) {
    minLng = 180
  }

  if (maxLng == "") {
    maxLng = 180
  } else if (maxLng <= -180) {
    maxLng = -180
  } else if (maxLng >= 180) {
    maxLng = 180
  }

  if (minLat == "") {
    minLat = -90
  } else if (minLat <= -90) {
    minLat = -90
  } else if (minLat >= 90) {
    minLat = 90
  }

  if (maxLat == "") {
    maxLat = 90
  } else if (maxLat <= -90) {
    maxLat = -90
  } else if (maxLat >= 90) {
    maxLat = 90
  }

  // remake filtered layer with new min and max values
  filteredLayer = L.geoJson(dataset, {
    filter: (feature, layer) => {
      let coords = feature.geometry.coordinates;
      let filteredData = coords[0] > minLng &&
                         coords[0] < maxLng &&
                         coords[1] > minLat &&
                         coords[1] < maxLat;
      return filteredData;
    }
  }).addTo(myMap);
};


const resetValues = () => {
  // remove filteredLayer
  myMap.removeLayer(filteredLayer);

  // set filteredLayer to unfiltered dataset
  filteredLayer = L.geoJson(dataset).addTo(myMap);

  // clear lat and long min and max input values
  lngMinInput.value = "",
  lngMaxInput.value = "",
  latMinInput.value = "",
  latMaxInput.value = "";
};


// call the function that adds data to the map
// should the switch function for JSON / XML / CSV be here?
addDatasetToMapJSON();


// add event listener to submitValuesButton
submitValuesButton.addEventListener("click", () => {
  filterLatLngValues();
  onReadyPopups();
});


// add event listener to resetValuesButton
resetValuesButton.addEventListener("click", () => {
  resetValues();
  onReadyPopups();
});
