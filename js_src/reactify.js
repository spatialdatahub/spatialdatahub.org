import React from 'react';
import ReactDOM from 'react-dom';

console.log(window.json_data);

// instead of breaking things up into files, just make things here first 

// create map stuff 
const MapContainer = () => {
    return (
        <div className='col-xs-12 col-md-8 col-lg-9' id='mapContainer'>
          <div className='custom-popup' id='mapId'></div>
        </div>
    );
};

// all this stuff acts a single unit, there is no reason to break it up
// breaking it up would only make more complexity
const SearchBarLi = () => {
    return (
        <li className='searchBarLi' id='searchBarLi'>
          <form action='.' method='GET'>
            <input className='form-control'
                   name='q'
                   type='text'
                   title='Search Datasets'
                   placeholder='Search title, account, author, keyword'>
            </input>
          </form>  
        </li>  
    );
};

const ClearMapLi = () => (
    <li className='clearMapLi' id='clearMapLi'>
      <button className='btn btn-default btn-block' id='clearMapButton'>
        Clear Map
      </button>  
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
      id={`datasetLink${props.dataset.pk}`}
      href={`/${props.dataset.fields.account}/${props.dataset.fields.dataset_slug}/${props.dataset.pk}/`}>
      Dataset Page
    </a>
);

// datasetLinkButtonGroup
const DatasetLinkButtonGroup = props => (
    <div
      className='btn-group'
      id={`datasetLinkButtonGroup${props.dataset.pk}`}>
      <DatasetLink dataset={props.dataset} />
    </div>
);

// datasetButton
// the non-essential attributes should be taken off of this element
const DatasetButton = props => (
    <button
      className='btn btn-default'
      id={`dataset-button${props.dataset.pk}`}
      value={`${props.dataset.fields.ext}`}
      url={`${props.dataset.fields.url}`}>
      {props.dataset.fields.title}
    </button>
);

// datasetButtonGroup
const DatasetButtonGroup = props => (
    <div
      className="btn-group"
      id={`dataset-button-group${props.dataset.pk}`}>
      <DatasetButton dataset={props.dataset}/>
    </div>
);

// justifiedDatasetButtonGroup
const JustifiedDatasetButtonGroup = props => (
    <div
      className="btn-group btn-group-justified"
      id={`justified-button-group${props.dataset.pk}`}>
      <DatasetButtonGroup dataset={props.dataset} />
    </div>
);

// this should bave the justified dataset button group and the link
// I think
const JustifiedButtonGroup = props => (
    <div
      className="btn-group btn-group-justified"
      id={`justified-button-group${props.dataset.pk}`}
      >
      <JustifiedDatasetButtonGroup dataset={props.dataset} />
      <DatasetLinkButtonGroup dataset={props.dataset} />
    </div>
);

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
          <MapContainer />
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

