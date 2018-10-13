import React from 'react';

import Router from './router'

export default class App extends React.PureComponent {
    
    render() {
        return (<div className="container">
            <h1>hello world</h1>
            <Router />
        </div>);
    }
}
