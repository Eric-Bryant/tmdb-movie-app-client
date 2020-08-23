import axios from 'axios'

const apiClient = axios.create({
  baseURL: `http://localhost:3000`,
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
  }
}
