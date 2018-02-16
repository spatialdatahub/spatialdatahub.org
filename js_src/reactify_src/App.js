import React from 'react';

// import containers
import SearchBar from './containers/Sidebar/Searchbar';
import ClearMapButton from './containers/Sidebar/ClearMapButton';
import SidebarDatasetList from './containers/Sidebar/SidebarDatasetList';
import MapContainer from './containers/MapContainer/MapContainer';

// where should all of the crazy logic be?
// there are a lot of things that have to go on with the map and getting data and stuff
const App = props => {

    const initialMapState = {
        lat: 0,
        lng: 8.846,
        zoom: 2
    };

    return (
        <div className='row' id='main'>
          <MapContainer mapState={initialMapState} />
          <div
            className='col-xs-12 col-md-4 col-lg-3'
            id='datasetsContainer'>

            <ul className='nav nav-pills nav-stacked' id='searchBarClearMapUl'>
              <SearchBar />
              <ClearMapButton />
            </ul>  

            <SidebarDatasetList datasetList={props.datasetList} />
          </div>
        </div>
    );
};

export default App;
