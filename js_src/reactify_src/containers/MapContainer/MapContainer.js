import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

// create map stuff 
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


export default MapContainer;
