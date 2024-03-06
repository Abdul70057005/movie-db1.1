import React, { Component } from 'react'
import { Spin, Alert, Rate } from 'antd'
import { format } from 'date-fns'

export default class MovieList extends Component {
  state = {
    movieId: null,
  }

  overviewLength(overview) {
    if (overview.length <= 180) {
      return overview
    }

    overview = overview.slice(0, 181)
    const index = overview.lastIndexOf(' ', overview)
    return overview.slice(0, index) + '...'
  }

  render() {
    const { movieData, loading, error, start, updateRaitingMovies, guestSessionId, genre, getRaitingMovieData } =
      this.props

    let nameGenre = genre?.map((e) => {
      return e.name
    })

    let idGenre = genre?.map((e) => {
      return e.id
    })

    let elements = movieData.map((e) => {
      //Жанр
      let elementGenre = e.genre_ids
      let arrGenre = elementGenre?.map((item) => {
        return idGenre?.map((elem, index) => {
          if (elem === item) {
            return nameGenre[index]
          }
        })
      })

      arrGenre = arrGenre.map((item) => {
        return item.filter((el) => el !== undefined)
      })

      arrGenre = arrGenre.map((item, id) => {
        return (
          <div key={id} className="movie-list__item-col2__janr-1">
            {item}
          </div>
        )
      })

      // цвет рейтинга
      let style
      if (e.vote_average < 3) {
        style = { border: '1px solid #E90000' }
      } else if (e.vote_average >= 3 && e.vote_average < 5) {
        style = { border: '1px solid #E97E00' }
      } else if (e.vote_average >= 5 && e.vote_average < 7) {
        style = { border: '1px solid #E9D100' }
      } else if (e.vote_average >= 7) {
        style = { border: '1px solid #66E900' }
      }

      //дата
      let time = new Date(e.release_date)

      if (Number.isNaN(Date.parse(time))) {
        return (time = '')
      }

      let data = format(time, 'MMMM d, y')

      return (
        <div key={e.id} className="movie-list__item">
          <img className="movie-list__item-img" src={`https://image.tmdb.org/t/p/original/${e.poster_path}`} />
          <div className="movie-list__item-col2">
            <span className="movie-list__item-col2__title-wrapper">
              <span className="movie-list__item-col2__title">{e.title}</span>
              <span className="movie-list__item-col2__rating" style={style}>
                <div className="movie-list__item-col2__rating__text">{e.vote_average.toFixed(1)}</div>
              </span>
            </span>
            <span className="movie-list__item-col2__data">{data}</span>
            <span className="movie-list__item-col2__janr">{arrGenre}</span>
            <span className="movie-list__item-col2__overview">{this.overviewLength(e.overview)}</span>
            <Rate
              count={10}
              onChange={(key) => updateRaitingMovies(guestSessionId, e.id, key)}
              onClick={() => getRaitingMovieData(guestSessionId)}
            />
          </div>
        </div>
      )
    })

    if (loading) {
      return (
        <div className="wrapper__movie-list__item">
          <div className="error">
            <Spin />
          </div>
        </div>
      )
    }

    if (error) {
      return <Alert message="Ошибка!" type="error" />
    }
    if (elements.length === 0 && start) {
      return <Alert message="Ничего не найдено!" type="error" />
    }
    return <div className="wrapper__movie-list__item">{elements}</div>
  }
}
