import axios from 'axios'
const liveUrl = 'https://mmlapi.ericmbryant.com'
const devUrl = 'http://192.168.50.74:3000'

const apiClient = axios.create({
  baseURL: liveUrl,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  searchMulti(query, page) {
    if (!page) {
      page = 1
    }
    return apiClient.get(`/search/multi/${query}/?page=${page}`)
  },
  searchPerson(query, page) {
    if (!page) {
      page = 1
    }
    return apiClient.get(`/search/person/${query}/?page=${page}`)
  },
  searchMovie(query, page) {
    if (!page) {
      page = 1
    }
    return apiClient.get(`/search/movie/${query}/?page=${page}`)
  },
  searchTV(query, page) {
    if (!page) {
      page = 1
    }
    return apiClient.get(`/search/tv/${query}/?page=${page}`)
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
  },
  getTvDetails(tvID) {
    return apiClient.get(`/tv/${tvID}`)
  },
  getTvTrailers(tvID) {
    return apiClient.get(`/tv/${tvID}/videos`)
  },
  getTvCredits(tvID) {
    return apiClient.get(`/tv/${tvID}/credits`)
  },
  getTvSimilar(tvID) {
    return apiClient.get(`/tv/${tvID}/similar`)
  },
  getRecommendedTv(tvID) {
    return apiClient.get(`/tv/${tvID}/recommendations`)
  },
  getPersonDetails(personID) {
    return apiClient.get(`/person/${personID}`)
  },
  getPersonCredits(personID) {
    return apiClient.get(`/person/${personID}/combined_credits`)
  }
}
