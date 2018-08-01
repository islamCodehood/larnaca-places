import React, { Component } from "react";

class InfoWindow extends Component {
    render() {
      return (
        <div>
            <div id="title">{this.props.title}</div>
            <img src={this.props.bestPhoto} alt=""/>
            <div id="category"><span>Category: </span>{this.props.category}</div>
            <div id="location"><span>Location: </span> {this.props.address}</div>
        </div>
      );
    }
  }
  
  export default InfoWindow;