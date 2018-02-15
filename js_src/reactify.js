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

// datasetLink
const DatasetLink = props => (
    <a
      className='btn'
      id={`datasetLink${props.pk}`}
      href={`/${props.fields.account}/${props.fields.dataset_slug}/${props.pk}/`}>
      Dataset Page
    </a>
);

// datasetLinkButtonGroup
const DatasetLinkButtonGroup = props => (
    <div
      className='btn-group'
      id={`datasetLinkButtonGroup${props.pk}`}>
      <DatasetLink dataset={props} />
    </div>
);

// datasetButton
// the non-essential attributes should be taken off of this element
const DatasetButton = props => (
    <button
      className='btn btn-default'
      id={`dataset-button${props.pk}`}
      value={`${props.fields.ext}`}
      url={`${props.fields.url}`}>
    </button>
);

// datasetButtonGroup
const DatasetButtonGroup = props => (
    <div
      className="btn-group"
      id={`dataset-button-group${props.pk}`}>
      <DatasetButton />
    </div>
);

// justifiedDatasetButtonGroup
const JustifiedDatasetButtonGroup = props => (
    <div
      className="btn-group btn-group-justified"
      id={`justified-button-group${props.pk}`}>
      <DatasetButtonGroup dataset={props} />


    </div>
);

window.json_data.map(x => console.log(x));

/*
const justifiedButtonGroups = window.json_data
      .map(dataset => 
            <JustifiedDatasetButtonGroup
            props={dataset}
            key={dataset.pk}
            />
          );
          */

// put all the datasets sidebar stuff in here
/*
const DatasetsContainer = props => (
    <div className='col-xs-12 col-md-4 col-lg-3' id='datasetsContainer'>
      <SearchBarClearMapUl />
      {justifiedButtonGroups}
    </div>
);
*/


/*
const App = () => (
    <div className='row' id='main'>
      <MapContainer />
      <DatasetsContainer dataset_list={window.json_data} />
    </div>
);
*/

const App = props => {

    const datasetList = props.datasetList;

    const sideBarDatasetList = datasetList
          .map(dataset =>
               <li key={dataset.pk.toString()}>
               {dataset.pk}
               </li>
              );

    return (
        <div className='row' id='main'>
          <MapContainer />
          <ul
            className='col-xs-12 col-md-4 col-lg-3'
            id='datasetsContainer'>
            <SearchBarClearMapUl />
            {sideBarDatasetList}
          </ul>
        </div>
    );
};

ReactDOM.render(
    <App datasetList={window.json_data} />,
    window.react_mount
);
