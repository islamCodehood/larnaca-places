import React, { Component } from "react";
import Header from "./Header";
import SearchForm from "./SearchForm";

class Places extends Component {
  render() {
    return (
      <div>
        <Header />
        <SearchForm
          listedPlaces={this.props.listedPlaces}
          testMe={this.props.testMe}
          placesLocations={this.props.placesLocations}
        />
      </div>
    );
  }
}

export default Places;
