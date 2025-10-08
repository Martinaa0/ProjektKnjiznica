import apiClient from './api'

export const pretraziKnjige = async (query, page = 1, limit = 20, sort = 'relevance') => {
  try {
    const response = await apiClient.get('/books/search', {
      params: { q: query, page, limit, sort }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const pretraziPoNaslovu = async (title, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/books/search/title', {
      params: { title, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const pretraziPoAutoru = async (author, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/books/search/author', {
      params: { author, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const pretraziPoZanru = async (subject, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/books/search/subject', {
      params: { subject, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const dohvatiDetaljeKnjige = async (workId) => {
  try {
    const response = await apiClient.get(`/books/details/${workId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const dohvatiPopularne = async (limit = 20) => {
  try {
    const response = await apiClient.get('/books/trending', {
      params: { limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// pomocne funkcije

export const imaKnjigaCover = (book) => {
  return book.coverUrl && book.coverUrl !== null
}

export const dohvatiCoverUrl = (book, size = 'M') => {
  if (book.coverUrl) {
    return book.coverUrl.replace('-M.jpg', `-${size}.jpg`)
  }
  return null
}

export const formatirajAutore = (authors) => {
  if (!authors || authors.length === 0) return 'Nepoznat autor'
  if (authors.length === 1) return authors[0]
  if (authors.length === 2) return `${authors[0]} i ${authors[1]}`
  return `${authors[0]} i ostali`
}

export const skratiTekst = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const formatirajGodinu = (year) => {
  if (!year) return 'Godina nepoznata'
  return year.toString()
}
