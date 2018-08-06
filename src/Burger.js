import React, { Component } from 'react'

class Burger extends Component {
    handleKeyDown = (evt) => {
        evt.preventDefault()
        console.log(evt.keyCode)
        this.props.openCloseDrawerByKeyDown(evt.keyCode)
    }
    render() {
        return (
            <div id="burger">
                <span 
                    id="burger-btn" 
                    role="button" 
                    aria-label={this.props.BurgerBtnLabel} 
                    tabIndex="0" 
                    onClick={this.props.handleClick}
                    onKeyDown={this.handleKeyDown}
                >&#9776;
                </span>
                <header 
                    id="burger-header" 
                    className="burger-header-disappear" 
                    tabIndex="0"
                >LARNACA Places
                </header>
            </div>
        )
    }
}

export default Burger