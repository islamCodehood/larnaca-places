import React, { Component } from "react";
import PropTypes from 'prop-types';
import Header from "./Header";
import SearchForm from "./SearchForm";

class Places extends Component {
  handleClick = () => {
    this.props.closeDrawer()
  }
  handleKeyDown = (evt) => {
    this.props.closeDrawerByKeyDown(evt.keyCode)
  }
  render() {
    return (
      <section id="places-section" className="places-section-width">
        <div 
          className="places-closeButton" 
          onClick={this.handleClick} 
          tabIndex="0"
          onKeyDown={this.handleKeyDown}
          aria-label="Hide menu"
          role="button"
        >x</div>
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

Places.propTypes = {
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  listedPlaces: PropTypes.array.isRequired,
  filterPlaces: PropTypes.func,
  selectPlace: PropTypes.func,
  selectPlaceByKeyDown: PropTypes.func
}

export default Places;
