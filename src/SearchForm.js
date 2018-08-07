import React, { Component } from "react";
import PropTypes from "prop-types";

class SearchForm extends Component {
  state = {
    query: ""
  };
  //Check for changes in text box and update query state simultaniously
  handleChange = query => {
    this.setState({
      query
    });
    /*Then calling this function to transmit the query value to the parent components ending 
    * in App.js where actions according to it happens.*/
    this.props.filterPlaces(query);
  };
  handleClick = evt => {
    /*Transmit the target of click text content which is the name of location to parent components ending 
    * in App.js where actions according to it happens.*/
    this.props.selectPlace(evt.target.textContent);
  };
  handleKeyDown = evt => {
    //Does the same like the previous func but with enter key while element is in focus.
    this.props.selectPlaceByKeyDown(evt.target.textContent, evt.keyCode);
  };

  render() {
    return (
      <div id="search-area" className="">
        <div id="searchForm">
          <form value={this.state.query} autoComplete="off">
            <input
              type="text"
              id="search-text-input"
              aria-label="Filter places"
              placeholder="Filter..."
              value={this.state.query}
              onChange={evt => this.handleChange(evt.target.value)}
            />
          </form>
        </div>
        <div id="list">
          <ul id="unordered-list">
            {this.props.listedPlaces.map(marker => (
              <li
                key={marker.id}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                className="list-item"
                tabIndex="0"
              >
                {marker.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

//propType checking
SearchForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  key: PropTypes.number,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func
};

export default SearchForm;
