import React, { Component } from "react";

class InfoWindow extends Component {
  handleClick = (evt) => {
    evt.preventDefault()
    console.log(evt.target.title)
    this.props.showMore(evt.target.title)
  }
    render() {
      return (
        <div>
            <div id="title">{this.props.title}</div>
            <img src={this.props.bestPhoto} alt=""/>
            <div id="category"><span>Category: </span>{this.props.category}</div>
            <div id="location"><span>Location: </span> {this.props.address}</div>
            <button onClick={this.handleClick} title={this.props.title}>Show more</button>
        </div>
      );
    }
  }
  
  export default InfoWindow;