import React, { Component } from 'react'

class Burger extends Component {
    render() {
        return (
            <section id="burger">
                <span id="burger-icon" onClick={this.props.handleClick}>&#9776;</span>
                <header id="burger-header" className="burger-header-disappear" tabIndex="0">LARNACA Places</header>
            </section>
        )
    }
}

export default Burger