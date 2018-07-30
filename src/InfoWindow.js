import React, { Component } from "react";

class InfoWindow extends Component {
    
    handleClick = (evt) => {
        const param = [this.props.title, this.props.lat, this.props.lng]
        const [title, lat, lng] = param
        console.log(evt.target)
        this.props.getId(title, lat, lng)
        //this.props.getDetails()
    }
    render() {
      return (
        <div>
            <div id="title">{this.props.title}</div>
            <div id="address">Cyprus</div>
            <button onClick={this.handleClick}>read more</button>
        </div>
      );
    }
  }
  
  export default InfoWindow;