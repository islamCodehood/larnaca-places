import React, { Component } from "react";

class Modal extends Component {

    render() {
      return (
        <div id="modal">
          <div id="title">{this.props.title}</div>
          <img src="" alt=""/>
          <div id="location"><span>Location: </span>{this.props.address}</div>
          <div id="likes"><span>Likes: </span>{this.props.likes}</div>
          <div id="rating"><span>Rating: </span>{this.props.rating}</div><div id="rating-color" style={{background: `#${this.props.color}`}}></div>
          <div id="hours"><span>Hours: </span>{this.props.hours}</div>
        </div>
      );
    }
  }
  
  export default Modal;