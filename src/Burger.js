import React, { Component } from 'react'

class Burger extends Component {
    render() {
        return (
            <div id="burger" onClick={this.props.handleClick}> &#9776; </div>
        )
    }
}

export default Burger