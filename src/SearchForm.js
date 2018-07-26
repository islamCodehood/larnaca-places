import React, { Component } from "react";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";

class SearchForm extends Component {
  state = {
    query: ""
  };
  handleChange = (query, arr) => {
    this.setState({
      query: query.trim()
    });
  };

  render() {
    let matchedPlaces;
    if (this.state.query) {
      const searchText = new RegExp(escapeRegExp(this.state.query), "i");
      matchedPlaces = this.props.markers.filter(marker =>
        searchText.test(marker.title)
      );
    } else {
      matchedPlaces = this.props.markers;
    }
    matchedPlaces.sort(sortBy("title"));

    console.log(matchedPlaces);
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
            <input type="button" id="filter-button" value="Filter" />
          </form>
        </div>
        <div id="list">
          <ul id="unordered-list">
            {matchedPlaces.map(marker => (
              <li key={marker.id}>{marker.title}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchForm;
