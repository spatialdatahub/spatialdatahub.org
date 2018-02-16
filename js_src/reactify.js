import React from 'react';
import ReactDOM from 'react-dom';
import App from './reactify_src/App';

ReactDOM.render(
    <App datasetList={window.json_data} />,
    window.react_mount
);
