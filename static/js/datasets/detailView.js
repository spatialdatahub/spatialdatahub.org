// This is the javascript file for the map detail view

// How many of these can I define with the 'const' designation
// Define my variables

const value = document.getElementById("mapid").getAttribute("value"),
	ext = document.getElementById("mapid").getAttribute("ext"),
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
    dataset.eachLayer( layer => {
      featureCount++;
      const popupContent = [];
      for (let key in layer.feature.properties) {
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


			// maybe I want to comment this stuff out for a moment...

      // make features from datasetProperties 
      const uniqueDatasetProperties = [...new Set(datasetProperties)];
      for (i in uniqueDatasetProperties) {
        featureSelector.options[featureSelector.options.length] = new Option(uniqueDatasetProperties[i]);
      }


    const bounds = dataset.getBounds();
    myMap.fitBounds(bounds);
    // count features and add them to 'feature count html element'
    featureCountElement.innerHTML = featureCountElement.innerHTML + ` ${featureCount}`;

    // add elements to property filter selector
//    featureSelector.options[featureSelector.options.length] = new Option(key);
    // this doesn't work because it adds all elements for every single layer
     // I only want it to run through a single layer and add it

  }

// I might be able to add the .on and .addTo parts of this extensions to a function
// This stuff is going to be changed
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


// Start messing with the filter function
// I am going to have to re-create my elements, then I am going to have to use something
// other than omnivore to bring in the data, I think. 

// Here is a method to get the data using a Promise and an XMLHttpResponse. The response text
// should be parsable by JSON.parse, or some XML Parse method. Hopefully the decision to
// use some parsing mechanism can be made outside of this function, or maybe the response
// text can be sent to omnivore after all.

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

const useDatasetJSON = () => {
	getDataset(datasetUrl)
		.then((response) => {
			dataset = JSON.parse(response);
			filteredLayer.addData(dataset);
		}, (error) => {
			console.log('promise error handler', error);
		});
};

// Now I've got to figure out what the url and necessary DOM elements are all called.

