import React, { Component } from "react";
import Header from "./Header";
import SearchForm from "./SearchForm";

class Places extends Component {
  render() {
    return (
      <div id="places-section" className="places-section-width places-org-width">
        <Header />
        <SearchForm
          listedPlaces={this.props.listedPlaces}
          testMe={this.props.testMe}
          selectPlace={this.props.selectPlace}
        />
      </div>
    );
  }
}

export default Places;
