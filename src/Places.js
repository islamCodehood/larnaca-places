import React, { Component } from "react";
import Header from "./Header";
import SearchForm from "./SearchForm";

class Places extends Component {
  handleClick = () => {
    this.props.closeDrawer()
  }
  render() {
    return (
      <section id="places-section" className="places-section-width">
        <div className="places-closeButton" onClick={this.handleClick} >x</div>
        <Header />
        <SearchForm
          listedPlaces={this.props.listedPlaces}
          filterPlaces={this.props.filterPlaces}
          selectPlace={this.props.selectPlace}
          selectPlaceByKeyDown={this.props.selectPlaceByKeyDown}
        />
      </section>
    );
  }
}

export default Places;
