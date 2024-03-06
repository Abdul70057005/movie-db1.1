export default class SwapiService {
  async getResource(url) {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(res.status)
    }

    return await res.json()
  }

  async getMovies(label = '', page = 1) {
    const res = await this.getResource(
      `https://api.themoviedb.org/3/search/movie?api_key=a9e58b81424c80c4d0046e9596adde4b&query=${label}&include_adult=false&language=en-US&page=${page}`
    )
    return {
      results: res.results,
      total_pages: res.total_pages,
    }
  }

  async getGuestSession() {
    const res = await this.getResource(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=a9e58b81424c80c4d0046e9596adde4b'
    )
    return res.guest_session_id
  }

  async addRaiting(guest_session_id, movie_id, raiting) {
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/rating?api_key=a9e58b81424c80c4d0046e9596adde4b&guest_session_id=${guest_session_id}`
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': ' application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: raiting }),
    }

    const addRaitingResults = await fetch(url, options)
    if (!addRaitingResults.ok) {
      throw new Error(addRaitingResults.status)
    }

    return await addRaitingResults.json()
  }

  async getRaitingMovieData(guest_session_id) {
    const url = `https://api.themoviedb.org/3/guest_session/${guest_session_id}/rated/movies?api_key=a9e58b81424c80c4d0046e9596adde4b&language=en-US&page=1&sort_by=created_at.asc`
    const raitingMovieData = await fetch(url)

    if (!raitingMovieData.ok) {
      throw new Error(raitingMovieData.status)
    }
    const res = await raitingMovieData.json()

    return res.results
  }

  async getGenreMovie() {
    const res = await this.getResource(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=a9e58b81424c80c4d0046e9596adde4b&language=en'
    )
    return res.genres
  }
}
