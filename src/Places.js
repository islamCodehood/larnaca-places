import React, { Component} from 'react'
import Header from './Header'
import SearchForm from './SearchForm'

class Places extends Component {

    render() {
        return (
            <div>
                <Header />
                <SearchForm markers={this.props.markers} testMe={this.props.testMe} />
            </div>
        )
    }
}


export default Places