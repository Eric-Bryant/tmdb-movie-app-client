import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://192.168.50.74:3000`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  searchMulti(query) {
    return apiClient.get(`/search/multi/${query}`)
  },
  searchPerson(query) {
    return apiClient.get(`/search/person/${query}`)
  },
  searchMovie(query) {
    return apiClient.get(`/search/movie/${query}`)
  },
  searchTV(query) {
    return apiClient.get(`/search/tv/${query}`)
  },
  getMovieDetails(movieID) {
    return apiClient.get(`/movie/${movieID}`)
  },
  getMovieTrailers(movieID) {
    return apiClient.get(`/movie/${movieID}/videos`)
  },
  getMovieCredits(movieID) {
    return apiClient.get(`/movie/${movieID}/credits`)
  },
  getMovieSimilar(movieID) {
    return apiClient.get(`/movie/${movieID}/similar`)
  },
  getRecommendedMovies(movieID) {
    return apiClient.get(`/movie/${movieID}/recommendations`)
  }
}
