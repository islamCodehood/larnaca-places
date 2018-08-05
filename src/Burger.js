import React, { Component } from 'react'

class Burger extends Component {
    render() {
        return (
            <div id="burger">
                <span id="burger-icon" onClick={this.props.handleClick}>&#9776;</span>
                <span id="burger-header" className="burger-header-disappear">LARNACA Places</span>
            </div>
        )
    }
}

export default Burger