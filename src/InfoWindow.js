import React, { Component } from "react";

class InfoWindow extends Component {
    render() {
      return (
        <div>
            <div id="title"><span>{this.props.title}</span></div>
            <img src={this.props.bestPhoto} alt=""/>
            <div id="category"><span>Category: </span>{this.props.category}</div>
            <div id="location"><span>Location: </span> {this.props.address}</div>
            <div id="likes"><span>Likes: </span> {this.props.likes}</div>
        </div>
      );
    }
  }
  
  export default InfoWindow;