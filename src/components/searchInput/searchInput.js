import React, { Component } from 'react'

export default class SearchInput extends Component {
  state = {
    label: '',
  }

  onLabelChange = (e) => {
    this.setState({
      label: e.target.value,
    })
    this.props.onLoadingMovie()
    this.props.onUpdateMovies(this.state.label)
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.setState({
      label: '',
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          className="header__form__input"
          placeholder="Type to search..."
          onChange={this.onLabelChange}
          value={this.state.label}
        />
      </form>
    )
  }
}
