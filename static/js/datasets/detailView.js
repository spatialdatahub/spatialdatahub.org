// This is the javascript file for the map detail view

//***************************************************//
// Set up if / else  or switchstatement for
// json / kml / csv choice.
//
// Then add in input box or something with the feature_selector
// that will modify the points that show up on the map,
// 
// One thing I may be able to do is use the Turf.js
// library for all the filtering functions. That would reduce
// the amount of code I write quite a bit... I will start
// by writing everything myself and see where I go from there
//***************************************************//


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
          resolve(xhr.responseText); // CSV
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



// We are going to start with JSON, then expand from there
// make the function that deals with the promises loads the data, then saves it
// to a variable

// I don't want to add another if / else statement, but I think i may have to 
// so that I can deal with the kml and csv stuff, except that I don't want 
// a layer, I want a json object

const addDatasetToMapJSON = () => {
  getDataset(datasetUrl)
    .then((response) => {
      dataset = response; // this should work after kml has been
                                      //converted to geojson
      filteredLayer.addData(dataset);
//    }, (error) => { console.log('promise error handler', error);})};

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
