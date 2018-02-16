import React from 'react';
import ReactDOM from 'react-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

// import containers
import SearchBar from './reactify_src/containers/Sidebar/Searchbar';
import ClearMapButton from './reactify_src/containers/Sidebar/ClearMapButton';
import SidebarDatasetList from './reactify_src/containers/Sidebar/SidebarDatasetList';


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

const App = props => {
    return (
        <div className='row' id='main'>
          <MapContainer mapState={initialMapState} />
          <div
            className='col-xs-12 col-md-4 col-lg-3'
            id='datasetsContainer'>
            <SearchBarClearMapUl />
            <SidebarDatasetList datasetList={props.datasetList} />
          </div>
        </div>
    );
};


ReactDOM.render(
    <App datasetList={window.json_data} />,
    window.react_mount
);
