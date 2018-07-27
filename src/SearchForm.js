import React, { Component } from "react";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";

class SearchForm extends Component {
  state = {
    query: ''
  };
  handleChange = query => {
    this.setState({
      //trim white spaces
      query: query.trim()
    });
    this.props.testMe(query);
  };

  render() {
    return (
      <div>
        <div id="searchForm">
          <form>
            <input
              type="text"
              id="seacrh-text-input"
              placeholder="Enter a place"
              value={this.state.query}
              onChange={evt => this.handleChange(evt.target.value)}
            />
            <input
              type="button"
              id="filter-button"
              value="Filter"
              onClick={this.handleClick}
            />
          </form>
        </div>
        <div id="list">
          <ul id="unordered-list">
            {this.props.listedPlaces.map(marker => (
              <li key={marker.id}>{marker.title}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchForm;
