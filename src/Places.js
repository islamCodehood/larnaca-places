import React, { Component} from 'react'
import Header from './Header'
import SearchForm from './SearchForm'
import List from './List'

class Places extends Component {
    render() {
        return (
            <div>
                <Header />
                <SearchForm />
                <List />
            </div>
        )
    }
}


export default Places