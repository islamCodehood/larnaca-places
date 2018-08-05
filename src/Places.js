import React, { Component } from "react";
import Header from "./Header";
import SearchForm from "./SearchForm";

class Places extends Component {
  handleClick = () => {
    this.props.closeDrawer()
  }
  render() {
    return (
      <div id="places-section" className="places-section-width">
        <div className="places-closeButton" onClick={this.handleClick} >x</div>
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
