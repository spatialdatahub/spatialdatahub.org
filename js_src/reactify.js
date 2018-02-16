import React from 'react';
import ReactDOM from 'react-dom';
import {Map, TileLayer, Marker, Popup } from 'react-leaflet';

// import containers
import SearchBar from './reactify_src/containers/Sidebar/Searchbar';
import ClearMapButton from './reactify_src/containers/Sidebar/ClearMapButton';


// instead of breaking things up into files, just make things here first 


// to be put through the MapContainer container
const initialMapState = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13
};

// create map stuff 
// this is going not the correct way right now.
const MapContainer = props => {
    const initialPosition = [props.mapState.lat, props.mapState.lng];
    const initialZoom = props.mapState.zoom;
    return (
        <div className='col-xs-12 col-md-8 col-lg-9' id='mapContainer'>
          <Map center={initialPosition} zoom={initialZoom} id='mapid'>
            <TileLayer
              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
          </Map>
        </div>
    );
};


// this is a relic tha I would like to be rid of.
const SearchBarClearMapUl = () => {
    return (
        <ul className='nav nav-pills nav-stacked' id='searchBarClearMapUl'>
          <SearchBar />
          <ClearMapButton />
        </ul>  
    );
};

// Now for the fun part
// make many justifed button groups with button groups that have buttons and dataset page links in them
// add them into the datasets container below

// datasetLink
// datasetLinkButtonGroup
const DatasetLinkButtonGroup = props => {
    return (
        <div
          className='btn-group'
          id={`datasetLinkButtonGroup${props.dataset.pk}`}>
          <a
            className='btn'
            id={`datasetLink${props.dataset.pk}`}
            href={`/${props.dataset.fields.account}/${props.dataset.fields.dataset_slug}/${props.dataset.pk}/`}>
            Dataset Page
          </a>
        </div>
    );
};

// datasetButton
// the non-essential attributes should be taken off of this element
// all this info can be taken care of in a different way.
// datasetButtonGroup
// justifiedDatasetButtonGroup
// this is a button within a div within a div. How can this be simplified? It's all to use bootstrap3,
// how can we remove bootstrap3?
const JustifiedDatasetButtonGroup = props => {
    return (
        <div
          className="btn-group btn-group-justified"
          id={`justified-button-group${props.dataset.pk}`}>

          <div
            className="btn-group"
            id={`dataset-button-group${props.dataset.pk}`}>

            <button
              className='btn btn-default'
              id={`dataset-button${props.dataset.pk}`}
              value={`${props.dataset.fields.ext}`}
              url={`${props.dataset.fields.url}`}>
              {props.dataset.fields.title}
            </button>

          </div>

        </div>
        
    );
};

// this should bave the justified dataset button group and the link
// I think
const JustifiedButtonGroup = props => {
    return (
        <div
          className="btn-group btn-group-justified"
          id={`justified-button-group${props.dataset.pk}`}>
          <JustifiedDatasetButtonGroup dataset={props.dataset} />
          <DatasetLinkButtonGroup dataset={props.dataset} />
        </div>
    );
};

const App = props => {

    const datasetList = props.datasetList;

    const sideBarDatasetList = datasetList
          .map(dataset =>
               <JustifiedButtonGroup
               key={dataset.pk.toString()}
               dataset={dataset}
               />
              );

    return (
        <div className='row' id='main'>
          <MapContainer mapState={initialMapState} />
          <div
            className='col-xs-12 col-md-4 col-lg-3'
            id='datasetsContainer'>
            <SearchBarClearMapUl />
            {sideBarDatasetList}
          </div>
        </div>
    );
};


ReactDOM.render(
    <App datasetList={window.json_data} />,
    window.react_mount
);
