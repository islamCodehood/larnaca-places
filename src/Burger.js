import React, { Component } from 'react'

class Burger extends Component {
    render() {
        return (
            <div id="burger" onClick={this.props.handleClick}> &#9776; <span id="burger-header">Larnaca Places</span></div>
        )
    }
}

export default Burger