import React, { Component } from "react";
import PropTypes from 'prop-types';


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
  handleClick = (evt) => {

    console.log(evt.target.textContent, 'clicked')
    this.props.selectPlace(evt.target.textContent)
  }
  handleKeyDown = (evt) => {
    console.log(evt.target.textContent, evt.keyCode)
    this.props.selectPlaceByKeyDown(evt.target.textContent, evt.keyCode)
  }


  
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
                tabIndex="0">{marker.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

SearchForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  key: PropTypes.number,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func
}

export default SearchForm;
