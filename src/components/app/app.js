import React, { Component } from 'react'
import { Alert, Pagination, Tabs } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'
import PropTypes from 'prop-types'

import SwapiService from '../../services/swapi-servise'
import MovieList from '../movie-list/movie-list'
import MovieRaitingList from '../movieRaitingList/movieRaitingList'
import SearchInput from '../searchInput/searchInput'
import './app.css'
import { SwapiServiceProvider, SwapiServiceConsumer } from '../swapi-service-context'

export default class App extends Component {
  swapiService = new SwapiService()

  state = {
    movieData: [],
    loading: false,
    error: false,
    start: false,
    page: null,
    totalPages: null,
    label: '',
    paginationLoading: true,
    guestSessionId: null,
    ratingData: [],
    genre: [],
    data: null,
  }

  componentDidMount() {
    this.updateMovies()
    this.createGuestSession()
    this.genreMovie()
  }

  onError = () => {
    this.setState(({ loading }) => {
      return {
        error: true,
        loading: !loading,
      }
    })
  }

  createGuestSession = () => {
    this.swapiService.getGuestSession().then((res) => {
      this.setState(() => {
        return {
          guestSessionId: res,
        }
      })
    })
  }

  updateMovies = debounce((label, page) => {
    this.swapiService
      .getMovies(label, page)
      .then((movie) => {
        this.setState(() => {
          return {
            movieData: movie.results,
            totalPages: movie.total_pages,
            loading: false,
            page: page,
            label: label,
          }
        })
      })
      .catch(this.onError)
  }, 500)

  getRaitingMovieData = (guest_session_id) => {
    this.swapiService
      .getRaitingMovieData(guest_session_id)
      .then((movie) => {
        this.setState(() => {
          return {
            ratingData: movie,
          }
        })
      })
      .catch((err) => {
        return err
      })
  }

  updateRaitingMovies = (guest_session_id, movie_id, raiting) => {
    this.swapiService
      .addRaiting(guest_session_id, movie_id, raiting)
      .then((movie) => {
        this.setState(() => {
          return {
            data: movie,
          }
        })
      })
      .catch((err) => {
        return err
      })
  }

  genreMovie = () => {
    this.swapiService.getGenreMovie().then((genre) => {
      this.setState(() => {
        return {
          genre: genre,
        }
      })
    })
  }

  loadingMovie = () => {
    this.setState(() => {
      return {
        loading: true,
        start: true,
        paginationLoading: false,
      }
    })
  }
  onChange = (key) => {
    return key
  }

  render() {
    const { movieData, loading, error, start, label, paginationLoading, guestSessionId, genre, ratingData } = this.state

    let className = 'main-pagination-'

    if (paginationLoading) {
      className += 'hidden'
    }

    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div>
            <Online>
              <SwapiServiceProvider value={genre}>
                <div className="wrapper">
                  <header className="header">
                    <SearchInput onUpdateMovies={this.updateMovies} onLoadingMovie={this.loadingMovie} />
                  </header>

                  <main className="main">
                    <SwapiServiceConsumer>
                      {(genre) => {
                        return (
                          <MovieList
                            movieData={movieData}
                            loading={loading}
                            error={error}
                            start={start}
                            updateRaitingMovies={this.updateRaitingMovies}
                            getRaitingMovieData={this.getRaitingMovieData}
                            guestSessionId={guestSessionId}
                            genre={genre}
                          />
                        )
                      }}
                    </SwapiServiceConsumer>
                    <div className={className}>
                      <Pagination
                        centered
                        defaultCurrent={1}
                        total={50}
                        onChange={(page) => this.updateMovies(label, page)}
                      />
                    </div>
                  </main>
                </div>
              </SwapiServiceProvider>
            </Online>
            <Offline>
              <div className="error-Network">
                <Alert message="Отсутуствует подключение к сети" type="error" />
              </div>
            </Offline>
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rate',
        children: (
          <div>
            <Online>
              <SwapiServiceProvider value={genre}>
                <div className="wrapper">
                  <main className="main">
                    <SwapiServiceConsumer>
                      {(genre) => {
                        return (
                          <MovieRaitingList
                            ratingData={ratingData}
                            loading={loading}
                            error={error}
                            start={start}
                            updateRaitingMovies={this.updateRaitingMovies}
                            guestSessionId={guestSessionId}
                            genre={genre}
                          />
                        )
                      }}
                    </SwapiServiceConsumer>
                    <div className={className}>
                      <Pagination defaultCurrent={1} total={50} onChange={(page) => this.updateMovies(label, page)} />
                    </div>
                  </main>
                </div>
              </SwapiServiceProvider>
            </Online>

            <Offline>
              <div className="error-Network">
                <Alert message="Отсутуствует подключение к сети" type="error" />
              </div>
            </Offline>
          </div>
        ),
      },
    ]

    return (
      <div className="movieDB">
        <Tabs defaultActiveKey="1" centered items={items} onChange={this.onChange} />
      </div>
    )
  }
}

App.defaultProps = {
  movieData: [],
  genre: [],
  ratingData: [],
  loading: false,
  error: false,
  start: false,
  updateRaitingMovies: () => {},
  getRaitingMovieData: () => {},
  onLoadingMovie: () => {},
}

App.propTypes = {
  movieData: PropTypes.arrayOf(PropTypes.object).isRequired,
  genre: PropTypes.arrayOf(PropTypes.object).isRequired,
  ratingData: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateRaitingMovies: PropTypes.func,
  getRaitingMovieData: PropTypes.func,
  onLoadingMovie: PropTypes.func,
}
