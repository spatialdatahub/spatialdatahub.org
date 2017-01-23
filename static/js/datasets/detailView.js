// This is the javascript file for the map detail view

// How many of these can I define with the 'const' designation
// Define my variables

const value = document.getElementById("dataset_pk").getAttribute("value"),
  ext = document.getElementById("dataset_ext").getAttribute("value"),
  submitValuesButton = document.getElementById('submit_values_button'),
  resetValuesButton = document.getElementById('reset_values_button'),
  lngMinInput = document.getElementById("lng_min_input"),
  lngMaxInput = document.getElementById("lng_max_input"),
  latMinInput = document.getElementById("lat_min_input"),
  latMaxInput = document.getElementById("lat_max_input");
  featureCountElement = document.getElementById('feature_count'),
  datasetUrl = `/load_dataset/${value}`;


let dataset,
  featureCount = 0,
  datasetProperties = [],
  featureSelector = document.getElementById('feature_selector');


// define geojson layer that the dataset may be added to
let filteredLayer = L.geoJson().addTo(myMap);


// define my popups function
const onReadyPopups = () => {
  featureCount = 0;
  filteredLayer.eachLayer( layer => {
    featureCount++;
    const popupContent = [];
    for (const key in layer.feature.properties) {
      popupContent.push(
        `<b>${key}</b>: ${layer.feature.properties[key]}`
      );
      // get keys and put them into keys variable
      datasetProperties.push(`${key}`);
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

    // these for loops run every time the function is called. It's going to
    // make things slow probably, but it works right now. I can refactor later.
    // It's more important to keep functionality going right now.
    const uniqueDatasetProperties = [...new Set(datasetProperties)];

    // delete options in the featureSelector element
    for (i in featureSelector) {
      featureSelector.options[i] = null;
      // console.log(uniqueDatasetProperties[i]);
    }

    // create and add options to the feature selector element
    for (i in uniqueDatasetProperties) {
      const opt = document.createElement('option');
      opt.value = uniqueDatasetProperties[i];
      opt.innerHTML = uniqueDatasetProperties[i];
      featureSelector.appendChild(opt);
    }
  
  // count features and add them to 'feature count html element'
  featureCountElement.innerHTML = ` ${featureCount}`;
};


const getDataset = (url) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.responseText);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = () => reject(Error("Network Error"));
    xhr.send();
  });
  return promise;
};


// We are going to start with JSON, then expand from there
// make the function that deals with the promises loads the data, then saves it
// to a variable
const addDatasetToMapJSON = () => {
  getDataset(datasetUrl)
    .then((response) => {
      dataset = JSON.parse(response);
      filteredLayer.addData(dataset);
    })
    .then((response) => {
      onReadyPopups(response);
    }, (error) => {
      console.log('promise error handler', error);
    });
};


// Now I've got to figure out what the url and necessary DOM elements are all called.
const filterValues = () => {
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
  filterValues();
  onReadyPopups();
});


// add event listener to resetValuesButton
resetValuesButton.addEventListener("click", () => {
  resetValues();
  onReadyPopups();
});







// I might be able to add the .on and .addTo parts of this extensions to a function
// This stuff is going to be changed
/*
const typeSwitcher = () => {
  switch (ext) {
    case "kml":
      console.log('kml')
      dataset = omnivore.kml(url=datasetUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
      break;
    case "csv":
      console.log('csv')
      dataset = omnivore.csv(url=datasetUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
      break;
    default:
      console.log('geojson')
      dataset = omnivore.geojson(url=datasetUrl)
      .on("ready", onReadyPopups)
      .addTo(myMap);
      break;
  }
};
typeSwitcher();
*/

// Start messing with the filter function
// I am going to have to re-create my elements, then I am going to have to use something
// other than omnivore to bring in the data, I think.
// Here is a method to get the data using a Promise and an XMLHttpResponse. The response text
// should be parsable by JSON.parse, or some XML Parse method. Hopefully the decision to
// use some parsing mechanism can be made outside of this function, or maybe the response
// text can be sent to omnivore after all.
