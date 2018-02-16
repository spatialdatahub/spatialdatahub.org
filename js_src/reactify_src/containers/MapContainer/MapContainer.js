import React from 'react';
import { Map, TileLayer, LayersControl } from 'react-leaflet';
const { BaseLayer } = LayersControl;

// create map stuff 



const baseLayers = (
    <LayersControl position="topright">
      <BaseLayer checked name="OpenStreetMap.Mapnik">
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
      </BaseLayer>
      <BaseLayer name="OpenStreetMap.BlackAndWhite">
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
          />
      </BaseLayer>
      <BaseLayer name="Black And White">
        <TileLayer
          attribution='Map tiles by <a href="https://stamen.com">Stamen Design</a>,
                    <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>
                    &mdash; Map data &copy;
                    <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
                    />
      </BaseLayer>
    </LayersControl>
);


const MapContainer = props => {
    const initialPosition = [props.mapState.lat, props.mapState.lng];
    const initialZoom = props.mapState.zoom;

    return (
        <div className='col-xs-12 col-md-8 col-lg-9' id='mapContainer'>
          <Map center={initialPosition} zoom={initialZoom} id='mapid'>
            {baseLayers}
          </Map>
        </div>
    );
};


export default MapContainer;
