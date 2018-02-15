import React from 'react';
import ReactDOM from 'react-dom';

console.log(window.json_data);

// instead of breaking things up into files, just make things here first 

// create map stuff 

const MapId = () => <div className='custom-popup' id='mapId'></div>;

const MapContainer = () => {
    return (
        <div className='col-xs-12 col-md-8 col-lg-9' id='mapContainer'>
          <MapId />
        </div>
    );
};

// create sidebar stuff 
const SearchBarFormInput = () => (
    <input className='form-control'
           name='q'
           type='text'
           title='Search Datasets'
           placeholder='Search title, account, author, keyword'
           >
    </input>
);

const SearchBarForm = () => (
    <form action='.' method='GET'>
      <SearchBarFormInput />
    </form>  
);

const SearchBarLi = () => (
    <li className='searchBarLi' id='searchBarLi'>
      <SearchBarForm />
    </li>  
);

const ClearMapButton = () => (
    <button className='btn btn-default btn-block' id='clear_map'>
      Clear Map
    </button>  
);

const ClearMapLi = () => (
    <li className='clearMapLi' id='clearMapLi'>
      <ClearMapButton />
    </li>  
);

const SearchBarClearMapUl = () => (
    <ul className='nav nav-pills nav-stacked' id='searchBarClearMapUl'>
      <SearchBarLi />
      <ClearMapLi />
    </ul>  
);

// Now for the fun part
// make many justifed button groups with button groups that have buttons and dataset page links in them
// add them into the datasets container below



// put all the datasets sidebar stuff in here
const DatasetsContainer = () => (
    <div className='col-xs-12 col-md-4 col-lg-3' id='datasetsContainer'>
      <SearchBarClearMapUl />
    </div>
);



const app = (
    <div className='row' id='main'>
      <MapContainer />
      <DatasetsContainer />
    </div>
);

ReactDOM.render(
    app,
    window.react_mount
);
