import React from 'react';

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
              id={`dataset-button${props.dataset.pk}`}>
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

const SidebarDatasetList = props => {

    const datasetList = props.datasetList;

    return datasetList
        .map(dataset =>
             <JustifiedButtonGroup
             key={dataset.pk.toString()}
             dataset={dataset}
             />
            );
};


export default SidebarDatasetList;
