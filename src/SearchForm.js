import React, { Component } from "react";


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
  handleClick = (e) => {

    console.log(e.target.textContent, 'clicked')
    this.props.selectPlace(e.target.textContent)
  }
  
  render() {
 /*    document.getElementsByTagName('li').addEventListener('click', () => {
      console.log('weee')
    }) */
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
              <li key={marker.id} onClick={this.handleClick}>{marker.title}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchForm;
