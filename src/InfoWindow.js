import React, { Component } from "react";
import PropTypes from 'prop-types';

class InfoWindow extends Component {
    render() {
      return (
        <div>
            <img src={this.props.bestPhoto} alt={`${this.props.title} ${this.props.category}`}/>
            <div id="title"><span>{this.props.title}</span></div>
            <div id="info">
              <div id="category"><span>{this.props.category}</span></div>
              <div id="location"><span>Location </span> {this.props.address}</div>
              <div id="likes"><span>Likes </span> {this.props.likes}</div>
              <div id="rating"><span id="rating-title">Rating </span> <span id="ratingColor" style={{background: `${this.props.ratingColor}`}}>{this.props.rating}</span></div>
            </div>
        </div>
      );
    }
  }

  InfoWindow.PropTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired
  }
  
  export default InfoWindow;