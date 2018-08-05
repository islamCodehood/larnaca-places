import React, { Component } from "react";


class SearchForm extends Component {
  state = {
    query: ''
  };
  handleChange = query => {
    this.setState({
      //trim white spaces
      query: query
    });
    this.props.filterPlaces(query);
  };
  handleClick = (e) => {

    console.log(e.target.textContent, 'clicked')
    this.props.selectPlace(e.target.textContent)
  }

  
  render() {
    return (
      <div id="search-area" className="">
        <div id="searchForm">
          <form value={this.state.query} autoComplete="off">
            <input
              type="text"
              id="seacrh-text-input"
              placeholder="Search..."
              value={this.state.query}
              onChange={evt => this.handleChange(evt.target.value)}
            />
          </form>
        </div>
        <div id="list">
          <ul id="unordered-list">
            {this.props.listedPlaces.map(marker => (
              <li key={marker.id} onClick={this.handleClick} id="list-item">{marker.title}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default SearchForm;
