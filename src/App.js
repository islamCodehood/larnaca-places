import React, { Component } from 'react';
import './App.css';
import Burger from './Burger'
import Places from './Places'
import Map from './Map'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Burger />
        <Places />
        <Map />
      </div>
    );
  }
}

export default App;
